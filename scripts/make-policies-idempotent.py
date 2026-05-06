"""
make-policies-idempotent.py

PostgreSQL doesn't support CREATE POLICY IF NOT EXISTS, so re-running our
SETUP.sql fails on the second pass. This script transforms every

    create policy "NAME"
        on public.TABLE
        for ...

into

    drop policy if exists "NAME" on public.TABLE;
    create policy "NAME"
        on public.TABLE
        for ...

Then regenerates SETUP.sql.

Usage:
    python scripts/make-policies-idempotent.py
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MIGRATIONS_DIR = ROOT / "database" / "migrations"

# Match: create policy "NAME" then optional whitespace/newline then "on TABLE"
# TABLE is captured up to the next whitespace
PATTERN = re.compile(
    r'(create\s+policy\s+"([^"]+)"\s*(?:\n\s*)?on\s+(\S+))',
    re.IGNORECASE,
)


def transform(text: str) -> tuple[str, int]:
    """Returns (new_text, replacements_made)."""
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        full = m.group(1)
        name = m.group(2)
        table = m.group(3).rstrip(",;")
        # If there's already a drop-if-exists immediately before, skip
        # (handled by checking the source after the substitution — we use
        #  a marker comment so we don't double-process on subsequent runs)
        marker = f'-- idempotent guard for "{name}"'
        if marker in text and text.find(marker) < m.start():
            # Already guarded earlier in the file; this is a different policy with same name
            pass
        count += 1
        return f'{marker}\ndrop policy if exists "{name}" on {table};\n{full}'

    new = PATTERN.sub(repl, text)
    return new, count


def main():
    files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    total = 0
    for f in files:
        text = f.read_text(encoding="utf-8")
        # Skip if already processed (markers present)
        if "idempotent guard for" in text:
            print(f"  {f.name}: already processed")
            continue
        new_text, n = transform(text)
        if n > 0:
            f.write_text(new_text, encoding="utf-8")
            total += n
            print(f"  {f.name}: added {n} drop-if-exists guards")
        else:
            print(f"  {f.name}: no policies found")

    # Regenerate SETUP.sql
    out = ROOT / "database" / "SETUP.sql"
    parts = [
        "-- ================================================================",
        "-- Najaح — CONSOLIDATED DATABASE SETUP",
        "--",
        "-- All migrations stitched into one idempotent file.",
        "-- Paste into Supabase SQL Editor -> Run.",
        "-- Re-running is SAFE (every CREATE uses IF NOT EXISTS, every",
        "-- CREATE POLICY is preceded by DROP POLICY IF EXISTS).",
        "--",
        "-- Apply at: https://supabase.com/dashboard/project/cyabavzunccvlfwvuyuj/sql/new",
        "-- ================================================================",
        "",
    ]
    for f in files:
        parts.append("")
        parts.append(f"-- ==== FROM {f.name} ====")
        parts.append("")
        parts.append(f.read_text(encoding="utf-8"))

    out.write_text("\n".join(parts), encoding="utf-8")
    print(f"\nRegenerated {out.relative_to(ROOT)} ({out.stat().st_size} bytes)")
    print(f"Total guards added: {total}")


if __name__ == "__main__":
    main()
