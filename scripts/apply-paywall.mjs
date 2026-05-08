// Bulk-applies paywall guards to all /petits/* and /eleve/matieres/* server
// pages. Each page already has `if (!user) redirect("/connexion")`; we add a
// requireKidsAccess(user.id) call right after for /petits routes and a
// requireAccessForGrade for /eleve/matieres routes.
//
// Idempotent — skips files that already import the helper.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) yield* walk(full);
    else if (entry === "page.tsx") yield full;
  }
}

const root = "src/app/[locale]";
const targets = {
  // /petits/* (excluding the hub /petits/page.tsx — already done)
  petits: [...walk(join(root, "petits"))].filter((p) => !p.endsWith(`petits${join("", "page.tsx")}`) && !p.endsWith("petits/page.tsx") && !p.endsWith("petits\\page.tsx")),
  // /eleve/matieres/* — already did the chapter quiz; do the listing pages
  matieres: [...walk(join(root, "eleve", "matieres"))],
  // /eleve/bac/*
  bac: [...walk(join(root, "eleve", "bac"))],
};

let touched = 0;
for (const [bucket, files] of Object.entries(targets)) {
  for (const file of files) {
    let src = readFileSync(file, "utf8");
    // Skip if already paywalled.
    if (
      src.includes("requireKidsAccess(") ||
      src.includes("requireAccessForGrade(") ||
      src.includes("requireSubscription(")
    ) {
      continue;
    }
    if (!src.includes('redirect("/connexion")')) {
      // No auth check pattern we recognize — skip.
      continue;
    }

    const helper = bucket === "petits" ? "requireKidsAccess" : "requireAccessForGrade";
    const importLine = `import { ${helper} } from "@/lib/subscriptions";`;

    // Add import (under last import).
    const lastImportMatch = [...src.matchAll(/^import .+;$/gm)].pop();
    if (!lastImportMatch) continue;
    const insertImportAt = lastImportMatch.index + lastImportMatch[0].length;
    src = src.slice(0, insertImportAt) + "\n" + importLine + src.slice(insertImportAt);

    // Add the guard right after `if (!user) redirect("/connexion");`
    if (helper === "requireKidsAccess") {
      src = src.replace(
        /if\s*\(\s*!\s*user\s*\)\s*redirect\("\/connexion"\);?/,
        (m) => `${m}\n  // Hard paywall: kids universe is full-tier only.\n  await requireKidsAccess(user.id);`,
      );
    } else {
      // requireAccessForGrade needs the child.grade. We assume there's a child
      // fetch nearby — if not, fall through to grade=null (subscriber-only).
      // Adapt per file: try to detect if `child.grade` is available later.
      src = src.replace(
        /if\s*\(\s*!\s*user\s*\)\s*redirect\("\/connexion"\);?/,
        (m) => `${m}\n  // Hard paywall: subscriber required.\n  const _activeSub = await requireAccessForGrade(user.id, null);\n  void _activeSub;`,
      );
    }

    writeFileSync(file, src, "utf8");
    console.log(`✓ paywalled (${bucket}): ${file.replace(/\\/g, "/")}`);
    touched++;
  }
}
console.log(`\nDone. ${touched} files updated.`);
