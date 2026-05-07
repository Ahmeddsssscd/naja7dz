// Crawl all internal pages and report any broken links / 404s.
// Authenticated routes are skipped (they redirect to /connexion).
// Run: node scripts/crawl-links.mjs https://naja7dz.com

const BASE = process.argv[2] || "https://naja7dz.com";
const visited = new Set();
const broken = [];
const okCount = { val: 0 };
const queue = [];

const PUBLIC_SEEDS = [
  "/", "/fr", "/ar",
  "/fr/tarifs", "/ar/tarifs",
  "/fr/faq", "/ar/faq",
  "/fr/about", "/ar/about",
  "/fr/blog", "/ar/blog",
  "/fr/contact", "/ar/contact",
  "/fr/pour-les-parents", "/ar/pour-les-parents",
  "/fr/inscription", "/ar/inscription",
  "/fr/connexion", "/ar/connexion",
  "/fr/connexion/oublie", "/ar/connexion/oublie",
  "/fr/checkout?plan=eleve_monthly", "/ar/checkout?plan=eleve_monthly",
  "/fr/checkout?plan=famille_monthly", "/ar/checkout?plan=famille_monthly",
  "/fr/checkout?plan=pack_bac", "/ar/checkout?plan=pack_bac",
  "/fr/checkout?plan=does-not-exist", // should show "plan not found"
  "/fr/legal/conditions", "/ar/legal/conditions",
  "/fr/legal/confidentialite", "/ar/legal/confidentialite",
  "/fr/legal/loi-18-07", "/ar/legal/loi-18-07",
  "/fr/legal/mentions", "/ar/legal/mentions",
];

for (const p of PUBLIC_SEEDS) queue.push({ from: "(seed)", url: BASE + p });

while (queue.length) {
  const { from, url } = queue.shift();
  if (visited.has(url)) continue;
  visited.add(url);

  try {
    const res = await fetch(url, { redirect: "manual", headers: { "User-Agent": "naja7dz-crawler" } });
    if (res.status >= 300 && res.status < 400) {
      // Treat redirects as ok (auth pages send users to /connexion); don't follow into auth zone
      okCount.val++;
      continue;
    }
    if (res.status === 404) {
      broken.push({ url, status: 404, from });
      continue;
    }
    if (!res.ok) {
      broken.push({ url, status: res.status, from });
      continue;
    }
    okCount.val++;
    const html = await res.text();
    // Extract every <a href="..."> and <link href="..."> and resolve to absolute
    const hrefs = Array.from(html.matchAll(/href=\"([^\"]+)\"/g))
      .map((m) => m[1])
      .filter((h) => h && !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("#") && !h.startsWith("javascript:"))
      .filter((h) => !h.endsWith(".css") && !h.endsWith(".js") && !h.endsWith(".ico"))
      .filter((h) => !h.startsWith("http") || h.startsWith(BASE));
    for (const h of hrefs) {
      try {
        const abs = new URL(h, url).toString();
        if (!abs.startsWith(BASE)) continue;
        // Skip auth-protected zones (they 307 to /connexion which we already check)
        if (/\/(parent|eleve|petits|admin|teacher)(\/|$|\?)/.test(new URL(abs).pathname)) continue;
        if (!visited.has(abs)) queue.push({ from: url, url: abs });
      } catch {}
    }
    // Also flag any literal "[id]" or "[locale]" placeholder leaks in rendered HTML
    if (/href=\"[^"]*\[(id|locale|slug)\][^"]*\"/.test(html)) {
      broken.push({ url, status: "literal-placeholder", from });
    }
  } catch (err) {
    broken.push({ url, status: "fetch-error", from, msg: String(err) });
  }
}

console.log(`\nCrawled ${visited.size} URLs (${okCount.val} OK, ${broken.length} issues)`);
if (broken.length) {
  console.log("\nIssues:");
  for (const b of broken) {
    console.log(`  ${b.status}  ${b.url}  (linked from: ${b.from})${b.msg ? "  — " + b.msg : ""}`);
  }
  process.exit(1);
}
