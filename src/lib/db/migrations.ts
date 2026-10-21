/**
 * Ordered SQL migrations. They run automatically before the first database access of a server
 * instance (client.ts), in one transaction under an advisory lock, and are recorded in
 * schema_migrations. Never edit a migration that has shipped; add a new one.
 */
export interface Migration {
  id: string;
  sql: string;
}

export const migrations: Migration[] = [
  {
    id: "0001_base",
    sql: /* sql */ `
-- Editable values of the website, e.g. the tariffs of the calculators ("tarife.treuhand").
create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Contact and offer requests (optional copy of the e-mail; deleted after the retention period).
create table if not exists requests (
  id                  bigint generated always as identity primary key,
  reference           text not null unique,
  kind                text not null check (kind in ('offerte', 'kontakt')),
  calculator          text check (calculator in ('treuhand', 'firmengruendung', 'immobilien')),
  topic               text,
  name                text not null,
  company             text,
  email               text not null,
  phone               text,
  timing              text,
  message             text,
  input               jsonb,
  estimate            jsonb,
  status              text not null default 'neu' check (status in ('neu', 'in_bearbeitung', 'erledigt')),
  email_status        text not null check (email_status in ('sent', 'failed', 'dry_run')),
  email_id            text,
  email_error         text,
  confirmation_status text check (confirmation_status in ('sent', 'failed', 'skipped')),
  consent_at          timestamptz not null,
  ip_hash             text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists requests_created_idx on requests (created_at desc);
create index if not exists requests_ip_idx on requests (ip_hash, created_at);

-- Admin sessions: only the SHA-256 of the cookie token is stored. "credential" is a fingerprint
-- of the password and the TOTP key at login, so changing either one ends every session.
create table if not exists admin_sessions (
  id           text primary key,
  credential   text not null,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at   timestamptz not null,
  ip_hash      text,
  user_agent   text
);

-- Login throttling of the admin area.
create table if not exists login_attempts (
  id      bigint generated always as identity primary key,
  ip_hash text not null,
  kind    text not null default 'password' check (kind in ('password', 'code')),
  success boolean not null default false,
  at      timestamptz not null default now()
);
create index if not exists login_attempts_at_idx on login_attempts (at);

-- Changes made in the admin area (tariffs, requests).
create table if not exists audit_log (
  id         bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  action     text not null,
  detail     jsonb,
  session_id text
);
create index if not exists audit_log_at_idx on audit_log (at desc);
`,
  },
];
