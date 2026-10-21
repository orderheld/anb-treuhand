import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

/**
 * Login throttling and one-time codes against a real Postgres. Runs only with TEST_DATABASE_URL;
 * the tables of that database are emptied.
 */
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("admin login with Postgres", () => {
  let db: typeof import("@/lib/db/client");
  let limits: typeof import("./rate-limit");
  let login: typeof import("./login");

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = await import("@/lib/db/client");
    limits = await import("./rate-limit");
    login = await import("./login");
  });

  beforeEach(async () => {
    await db.query("truncate login_attempts, settings restart identity");
  });

  afterAll(async () => {
    await globalThis.__anbDb?.pool.end();
  });

  async function reserve(ip: string): Promise<string> {
    const r = await limits.reserveLoginAttempt(ip);
    if (r.status !== "ok") throw new Error(`unexpected ${r.status}`);
    return r.id;
  }

  it("blocks an address after five failures, others stay open", async () => {
    for (let i = 0; i < limits.PER_IP_LIMIT; i++) await reserve("ip-a");
    expect((await limits.reserveLoginAttempt("ip-a")).status).toBe("ip_blocked");
    expect((await limits.reserveLoginAttempt("ip-b")).status).toBe("ok");
  });

  it("clears the failures of an address after a successful login", async () => {
    for (let i = 0; i < limits.PER_IP_LIMIT - 1; i++) await reserve("ip-a");
    const id = await reserve("ip-a");
    expect(await limits.checkLoginCode(id, "ip-a", async () => true)).toBe("ok");
    expect((await limits.reserveLoginAttempt("ip-a")).status).toBe("ok");
  });

  it("locks every login after ten wrong codes", async () => {
    for (let i = 0; i < limits.GLOBAL_CODE_LIMIT; i++) {
      const id = await reserve(`ip-${i}`);
      expect(await limits.checkLoginCode(id, `ip-${i}`, async () => false)).toBe("wrong");
    }
    expect((await limits.reserveLoginAttempt("ip-new")).status).toBe("code_locked");
  });

  it("counts parallel attempts of one address correctly", async () => {
    const results = await Promise.all(Array.from({ length: 12 }, () => limits.reserveLoginAttempt("ip-p")));
    expect(results.filter((r) => r.status === "ok")).toHaveLength(limits.PER_IP_LIMIT);
  });

  it("accepts each code step only once", async () => {
    const claim = (step: number) => db.transaction((client) => login.claimTotpStep(step, client));
    expect(await claim(100)).toBe(true);
    expect(await claim(100)).toBe(false);
    expect(await claim(99)).toBe(false);
    expect(await claim(101)).toBe(true);
  });
});
