/**
 * Schema.org structured data — helps Google understand what Najaح is and
 * generates rich snippets in search results (organization card, breadcrumb,
 * FAQ rich result, etc.)
 *
 * Renders directly in the document head as <script type="application/ld+json">.
 * No client JS, pure SSR.
 */

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://naja7dz.com/#organization",
  name: "Najaح",
  alternateName: ["نجاح", "Najah", "Naja7"],
  url: "https://naja7dz.com",
  logo: "https://naja7dz.com/logo-mark-navy.png",
  image: "https://naja7dz.com/opengraph-image",
  description:
    "Plateforme éducative algérienne du primaire au Bac. Quiz personnalisés, tuteur en ligne, aide aux devoirs, archive Bac/BEM. En arabe et en français.",
  inLanguage: ["fr", "ar"],
  areaServed: { "@type": "Country", name: "Algeria" },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: ["student", "parent", "teacher"],
  },
  email: "contact@naja7dz.com",
  sameAs: [],
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://naja7dz.com/#website",
  url: "https://naja7dz.com",
  name: "Najaح",
  publisher: { "@id": "https://naja7dz.com/#organization" },
  inLanguage: ["fr-DZ", "ar-DZ"],
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE) }}
      />
    </>
  );
}
