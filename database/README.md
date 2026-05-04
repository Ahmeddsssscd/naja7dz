# Database

Migrations for the Najaح Postgres database (hosted on Supabase).

## How to apply a migration

1. Open your Supabase project: <https://supabase.com/dashboard/project/cyabavzunccvlfwvuyuj/sql/new>
2. Paste the SQL from the latest migration file in `migrations/`
3. Click **Run**
4. Verify in **Table Editor** that the table exists

## Naming convention

`YYYYMMDD_NNN_short_description.sql`

- `YYYYMMDD` — date applied
- `NNN` — sequence number for that day (001, 002, …)
- `short_description` — what it does (e.g. `early_access_signups`, `add_users_table`)

## Current migrations

| File | Tables / changes | Applied |
|---|---|---|
| `20260504_001_early_access_signups.sql` | `early_access_signups` (waitlist) | ⏳ Apply this first |

## After applying

When more tables exist, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id cyabavzunccvlfwvuyuj > ../src/lib/supabase/types.ts
```
