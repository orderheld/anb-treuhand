import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

/**
 * Login throttling against a real Postgres. Runs only with TEST_DATABASE_URL; the tables of that
 * database are emptied.
 */
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("admin login with Postgres", () => {
  let db: typeof import("@/lib/db/client");
  let limits: typeof import("./rate-limit");

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = await import("@/lib/db/client");
    limits = await import("./rate-limit");
  });

  beforeEach(async () => {
    await db.query("truncate login_attempts restart identity");
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
    await limits.completeLoginAttempt(id, "ip-a");
    expect((await limits.reserveLoginAttempt("ip-a")).status).toBe("ok");
  });

  it("locks every login after thirty failures from any addresses", async () => {
    for (let i = 0; i < limits.GLOBAL_LIMIT - 1; i++) await reserve(`ip-${i}`);
    // Successful logins do not count towards the lock.
    await limits.completeLoginAttempt(await reserve("ip-ok"), "ip-ok");
    expect((await limits.reserveLoginAttempt("ip-new")).status).toBe("ok");
    expect((await limits.reserveLoginAttempt("ip-next")).status).toBe("locked");
  });

  it("counts parallel attempts of one address correctly", async () => {
    const results = await Promise.all(Array.from({ length: 12 }, () => limits.reserveLoginAttempt("ip-p")));
    expect(results.filter((r) => r.status === "ok")).toHaveLength(limits.PER_IP_LIMIT);
  });
});
