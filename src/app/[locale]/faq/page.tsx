import { useTranslations } from "next-intl";
import { PageShell } from "@/components/landing/PageShell";
import { PlusIcon } from "@/components/Icon";
import { Link } from "@/i18n/routing";

const CATEGORIES = [
  {
    title: "Général",
    items: [
      {
        q: "Qu'est-ce que Najaح ?",
        a: "Najaح est une plateforme éducative algérienne qui aide les enfants à réussir, du primaire au Bac. Quiz personnalisés, tuteur en ligne, aide aux devoirs, archive Bac/BEM, et un univers ludique pour les 5–10 ans.",
      },
      {
        q: "À quel âge Najaح s'adresse-t-il ?",
        a: "À tous les élèves algériens du 1AP au 3AS — soit de 5 à 18 ans. L'expérience s'adapte à l'âge : univers ludique pour les petits, mode étudiant pour les grands.",
      },
      {
        q: "Le contenu suit-il le programme officiel ?",
        a: "Oui. Toutes les matières et chapitres sont strictement alignés sur le programme national algérien défini par le ministère de l'Éducation.",
      },
    ],
  },
  {
    title: "Langues & accessibilité",
    items: [
      {
        q: "C'est en arabe ou en français ?",
        a: "Les deux. Tu choisis la langue à tout moment — chaque matière est disponible dans les deux langues. Pour les plus petits, des explications audio en darija sont également disponibles.",
      },
      {
        q: "Sur quels appareils ça fonctionne ?",
        a: "Téléphone, tablette ou ordinateur — tout fonctionne dans le navigateur, sans téléchargement. Najaح peut aussi être ajouté à l'écran d'accueil de ton téléphone comme une application.",
      },
      {
        q: "Faut-il une connexion internet permanente ?",
        a: "Non. Une fois la leçon chargée, beaucoup de fonctionnalités fonctionnent hors ligne, et tu te synchronises automatiquement quand la connexion revient.",
      },
    ],
  },
  {
    title: "Sécurité & contrôle parental",
    items: [
      {
        q: "Mon enfant peut-il l'utiliser sans surveillance ?",
        a: "Oui. L'espace petits est entièrement sécurisé : pas de publicité, pas de contact extérieur, pas d'achats intégrés. Les parents définissent les limites de temps depuis leur espace.",
      },
      {
        q: "Comment fonctionnent les groupes d'étude ?",
        a: "Les groupes sont privés (5–10 amis maximum), créés sur invitation. Toutes les conversations passent par une modération automatique avant publication. Tu approuves chaque demande d'amitié.",
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Oui. Stockage chiffré, conforme à la Loi 18-07 algérienne. Aucune donnée personnelle n'est jamais vendue ni partagée à des fins publicitaires.",
      },
    ],
  },
  {
    title: "Tarifs & paiement",
    items: [
      {
        q: "Comment se passe le paiement ?",
        a: "Carte CIB, EDAHABIA ou virement BaridiMob. Paiement local sécurisé via Chargily. Aucun gateway étranger ni frais cachés.",
      },
      {
        q: "Puis-je essayer avant de payer ?",
        a: "Bien sûr. L'inscription est gratuite et ne demande aucune carte bancaire. Tu découvres la plateforme avant tout engagement.",
      },
      {
        q: "Et si je ne suis pas satisfait ?",
        a: "Tu peux annuler en un clic, à tout moment, depuis ton espace. Pas de frais cachés, pas de questions.",
      },
      {
        q: "Quelle est la différence entre Élève et Famille ?",
        a: "Élève couvre un seul enfant, Famille couvre jusqu'à 4 enfants et inclut l'univers des petits, l'espace parents complet, et les rapports PDF hebdomadaires.",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        q: "Comment vous contacter ?",
        a: "Via la page Contact, par email à support@naja7dz.com, ou par WhatsApp. Réponse sous 24h, du dimanche au jeudi.",
      },
      {
        q: "Y a-t-il un programme pour les enseignants ?",
        a: "Oui — les enseignants ont accès gratuitement à la communauté professionnelle, aux outils gratuits, et au partage de ressources.",
      },
    ],
  },
];

export default function FAQPage() {
  const t = useTranslations("FAQ");
  return (
    <PageShell active="faq">
      <section className="py-20 md:py-26 bg-surface-2 text-center">
        <div className="container-x max-w-3xl">
          <span className="eyebrow mb-3 block">{t("eyebrow")}</span>
          <h1 className="text-[clamp(34px,5vw,48px)] font-bold tracking-tight text-fg mb-4">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-x max-w-3xl space-y-14">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-xs font-semibold text-gold uppercase tracking-[0.08em] mb-4">
                {cat.title}
              </h2>
              <div>
                {cat.items.map((item, i) => (
                  <details key={i} className="border-b border-line group">
                    <summary className="flex justify-between items-center py-5 text-base md:text-lg font-medium text-fg cursor-pointer list-none">
                      <span>{item.q}</span>
                      <PlusIcon
                        size={20}
                        className="text-fg-soft transition-transform group-open:rotate-45 group-open:text-gold flex-shrink-0 ms-4"
                      />
                    </summary>
                    <p className="pb-5 text-fg-soft text-base leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-surface-2 text-center border-t border-line">
        <p className="text-fg-soft mb-3">Une question qui n&apos;est pas dans la liste ?</p>
        <Link href="/contact" className="btn btn-primary">
          Nous contacter
        </Link>
      </section>
    </PageShell>
  );
}
