// Bulk-patches all 12 remaining game components to use the new useGameBack
// hook instead of hardcoding router.push("/petits..."). One-time migration.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../src/components/app/games/", import.meta.url).pathname.replace(/^\//, "");
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && f !== "useGameBack.ts" && f !== "NumberNinja.tsx");

let touched = 0;
for (const f of files) {
  const path = join(dir, f);
  let src = readFileSync(path, "utf8");
  const before = src;

  // 1. Replace useRouter import with useGameBack import.
  // We keep the original useRouter import line if it imports OTHER things too.
  if (src.includes("router.push")) {
    src = src.replace(
      /import\s*\{\s*useRouter\s*\}\s*from\s*["']@\/i18n\/routing["'];?\s*\n/,
      `import { useGameBack } from "./useGameBack";\n`,
    );
    // Also handle case where useRouter is imported alongside other things.
    src = src.replace(
      /import\s*\{\s*([^}]*?)useRouter([^}]*?)\}\s*from\s*["']@\/i18n\/routing["'];?\s*\n/g,
      (_m, before, after) => {
        const names = (before + after).split(",").map((s) => s.trim()).filter(Boolean);
        if (names.length === 0) {
          return `import { useGameBack } from "./useGameBack";\n`;
        }
        return `import { ${names.join(", ")} } from "@/i18n/routing";\nimport { useGameBack } from "./useGameBack";\n`;
      },
    );

    // 2. Replace `const router = useRouter();` with `const goBack = useGameBack();`.
    // Pick a fallback per game: new games default to /petits/jeux-malins, old ones to /petits.
    const usesNewHub = src.includes('router.push("/petits/jeux-malins")');
    const fallback = usesNewHub ? '' : '"/petits"';
    src = src.replace(
      /const\s+router\s*=\s*useRouter\(\);/,
      fallback
        ? `const goBack = useGameBack(${fallback});`
        : `const goBack = useGameBack();`,
    );

    // 3. Replace all onClick router.push() back-button handlers.
    src = src.replace(/\(\)\s*=>\s*router\.push\("\/petits(?:\/jeux-malins)?"\)/g, "goBack");

    if (src !== before) {
      writeFileSync(path, src, "utf8");
      console.log(`✓ patched ${f}`);
      touched++;
    } else {
      console.log(`  (no changes) ${f}`);
    }
  }
}
console.log(`\nDone. ${touched} files patched.`);
