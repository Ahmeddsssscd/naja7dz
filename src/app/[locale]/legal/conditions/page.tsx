import { LegalShell } from "@/components/landing/LegalShell";

export const metadata = { title: "Conditions d'utilisation" };

export default function ConditionsPage() {
  return (
    <LegalShell title="Conditions d'utilisation" updated="5 mai 2026">
      <h2>1. Acceptation des conditions</h2>
      <p>
        En utilisant Najaح (« la Plateforme »), accessible via naja7dz.com, vous acceptez
        d&apos;être lié(e) par les présentes conditions d&apos;utilisation. Si vous
        n&apos;acceptez pas ces conditions, n&apos;utilisez pas la Plateforme.
      </p>

      <h2>2. Description du service</h2>
      <p>
        Najaح est une plateforme éducative algérienne destinée aux élèves du primaire au
        Bac (1AP — 3AS), à leurs parents et à leurs enseignants. Elle propose des
        exercices, un tuteur en ligne, une aide aux devoirs, des archives Bac/BEM et un
        univers ludique pour les enfants de 5 à 10 ans.
      </p>

      <h2>3. Comptes utilisateurs</h2>
      <p>
        Seul un parent ou un tuteur légal peut créer un compte sur Najaح. En créant un
        compte, vous garantissez :
      </p>
      <ul>
        <li>Avoir l&apos;âge légal pour contracter (18 ans révolus)</li>
        <li>Être le parent ou le tuteur légal des enfants ajoutés au compte</li>
        <li>Fournir des informations exactes et à jour</li>
        <li>Maintenir la confidentialité de vos identifiants</li>
      </ul>

      <h2>4. Abonnements et paiements</h2>
      <p>
        Najaح propose plusieurs formules d&apos;abonnement (Élève, Famille, Pack Bac,
        Pack BEM). Les paiements sont traités via Chargily Pay (CIB, EDAHABIA) ou
        BaridiMob. Les prix sont indiqués en dinars algériens (DA), TVA incluse.
      </p>
      <p>
        L&apos;abonnement se renouvelle automatiquement à la fin de chaque période
        sauf annulation depuis votre espace. Vous pouvez annuler à tout moment ;
        l&apos;accès reste actif jusqu&apos;à la fin de la période payée.
      </p>

      <h2>5. Utilisation acceptable</h2>
      <p>Vous vous engagez à ne pas :</p>
      <ul>
        <li>Utiliser la Plateforme à des fins illégales ou nuisibles</li>
        <li>Tenter d&apos;accéder à des comptes ou données qui ne vous appartiennent pas</li>
        <li>Copier, reproduire ou redistribuer le contenu de Najaح sans autorisation écrite</li>
        <li>Utiliser des robots, scrapers ou autres outils automatisés</li>
        <li>Publier du contenu offensant, illégal, ou portant atteinte aux droits de tiers</li>
      </ul>

      <h2>6. Contenu généré par l&apos;utilisateur</h2>
      <p>
        Lorsque votre enfant soumet un travail (rédaction, dessin, message dans un groupe
        d&apos;étude), il en garde la propriété intellectuelle. Vous accordez cependant à
        Najaح une licence non exclusive d&apos;utiliser ce contenu pour fournir et améliorer
        le service.
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        Tous les contenus créés par Najaح (interface, logos, exercices générés, archives
        Bac/BEM commentées, contenus pédagogiques) sont protégés par le droit
        d&apos;auteur. Toute reproduction non autorisée est interdite.
      </p>

      <h2>8. Modération et sanctions</h2>
      <p>
        Najaح se réserve le droit de modérer ou supprimer tout contenu violant les
        présentes conditions, et de suspendre ou résilier les comptes concernés. Un
        système de trois avertissements précède toute suspension définitive sauf cas grave.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        Najaح est un outil éducatif complémentaire, pas un substitut à l&apos;école ni à
        la supervision parentale. Najaح ne garantit pas la réussite à un examen et ne peut
        être tenu responsable des résultats scolaires obtenus par l&apos;élève.
      </p>

      <h2>10. Modification des conditions</h2>
      <p>
        Najaح peut modifier ces conditions à tout moment. Les modifications prennent
        effet à leur publication. En continuant à utiliser la Plateforme après modification,
        vous acceptez les nouvelles conditions.
      </p>

      <h2>11. Droit applicable et juridiction</h2>
      <p>
        Les présentes conditions sont régies par le droit algérien. Tout litige relève des
        tribunaux compétents d&apos;Alger.
      </p>

      <h2>12. Contact</h2>
      <p>
        Pour toute question concernant ces conditions :{" "}
        <a href="mailto:legal@naja7dz.com">legal@naja7dz.com</a>.
      </p>
    </LegalShell>
  );
}
