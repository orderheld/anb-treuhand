"use client";

import { ActionForm, TextField } from "@/components/admin/form";
import { login } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  return (
    <ActionForm action={login} submitLabel="Anmelden" pendingLabel="Wird geprüft …" className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <TextField name="password" label="Passwort" type="password" autoComplete="current-password" required />
      <TextField
        name="code"
        label="Code aus der Authenticator-App"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={7}
        placeholder="123456"
        hint="Sechs Ziffern, neu alle 30 Sekunden."
        required
      />
    </ActionForm>
  );
}
