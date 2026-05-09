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
  alternateName: ["نجاح", "Najah", "Naja7", "Naja7dz"],
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
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://naja7dz.com/faq?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Product/Offer for the subscription plans — drives Google rich pricing snippets
// for queries like "naja7dz prix" / "نجاح أسعار".
const PRODUCT = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://naja7dz.com/#product",
  name: "Najaح — Plateforme éducative",
  description:
    "Abonnement à Najaح : quiz personnalisés, tuteur en ligne, aide aux devoirs, archive Bac/BEM, univers ludique 5–10 ans. Accès complet du primaire au Bac.",
  brand: { "@type": "Brand", name: "Najaح" },
  image: "https://naja7dz.com/opengraph-image",
  offers: [
    {
      "@type": "Offer",
      name: "Élève — Mensuel",
      price: "990",
      priceCurrency: "DZD",
      url: "https://naja7dz.com/tarifs",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
    },
    {
      "@type": "Offer",
      name: "Famille — Mensuel",
      price: "1990",
      priceCurrency: "DZD",
      url: "https://naja7dz.com/tarifs",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
    },
    {
      "@type": "Offer",
      name: "Pack École — sur devis",
      // No fixed price; schools get a custom quote based on student count.
      // Schema.org allows omitting price for "by quote" offers if we set
      // priceSpecification.priceType to "https://schema.org/SuggestedRetailPrice"
      // with a minimal value, but the simplest valid pattern is to use
      // PriceRange via priceSpecification.minPrice; for now we publish a
      // Quote-style offer.
      url: "https://naja7dz.com/ecole",
      availability: "https://schema.org/InStock",
      priceCurrency: "DZD",
      priceSpecification: {
        "@type": "PriceSpecification",
        valueAddedTaxIncluded: true,
        priceCurrency: "DZD",
        // minPrice signals "starting from" without a misleading hard number
        minPrice: "0",
      },
    },
  ],
};

// FAQPage schema — Google shows these as expandable Q/A rich results under
// the main search result. Highest-impact structured data for organic CTR.
// Keep <= 8 entries per Google's guidelines.
const FAQ_PAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://naja7dz.com/#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce que Najaح ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Najaح est une plateforme éducative algérienne qui aide les enfants à réussir, du primaire au Bac. Quiz personnalisés, tuteur en ligne, aide aux devoirs, archive Bac/BEM, et un univers ludique pour les 5–10 ans.",
      },
    },
    {
      "@type": "Question",
      name: "À quel âge Najaح s'adresse-t-il ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "À tous les élèves algériens du 1AP au 3AS — soit de 5 à 18 ans. L'expérience s'adapte à l'âge.",
      },
    },
    {
      "@type": "Question",
      name: "Le contenu suit-il le programme officiel algérien ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Oui. Toutes les matières et chapitres sont strictement alignés sur le programme national algérien défini par le ministère de l'Éducation.",
      },
    },
    {
      "@type": "Question",
      name: "Najaح est-il en arabe ou en français ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Les deux. Chaque enfant peut basculer entre l'arabe et le français à tout moment. Toutes les matières sont disponibles dans les deux langues.",
      },
    },
    {
      "@type": "Question",
      name: "Comment se passe le paiement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Carte CIB, EDAHABIA ou virement BaridiMob. Paiement local sécurisé via Chargily. Aucun gateway étranger.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je essayer Najaح avant de payer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Oui. L'inscription est gratuite et ne demande aucune carte bancaire. Tu découvres la plateforme avant tout engagement.",
      },
    },
    {
      "@type": "Question",
      name: "Mes données sont-elles protégées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Oui. Stockage chiffré, conforme à la Loi 18-07 algérienne. Aucune donnée personnelle n'est jamais vendue.",
      },
    },
    {
      "@type": "Question",
      name: "Sur quels appareils Najaح fonctionne-t-il ?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Téléphone, tablette ou ordinateur — tout fonctionne dans le navigateur, sans téléchargement. Najaح peut aussi être ajouté à l'écran d'accueil comme une application.",
      },
    },
  ],
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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_PAGE) }}
      />
    </>
  );
}
