import { LegalShell } from "@/components/landing/LegalShell";

export const metadata = { title: "Politique de confidentialité — Najaح" };

export default function ConfidentialitePage() {
  return (
    <LegalShell title="Politique de confidentialité" updated="5 mai 2026">
      <p>
        Najaح prend la protection de vos données personnelles très au sérieux. Cette
        politique explique quelles données nous collectons, pourquoi, et comment vous
        pouvez les contrôler. Najaح est conforme à la <strong>Loi 18-07 algérienne</strong>{" "}
        relative à la protection des personnes physiques dans le traitement des données à
        caractère personnel.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est Najaح (naja7dz.com). Pour toute
        question :{" "}
        <a href="mailto:privacy@naja7dz.com">privacy@naja7dz.com</a>.
      </p>

      <h2>2. Données collectées</h2>

      <h3>Données du parent</h3>
      <ul>
        <li>Nom et prénom</li>
        <li>Adresse email</li>
        <li>Numéro de téléphone (optionnel)</li>
        <li>Wilaya de résidence</li>
        <li>Mot de passe (haché, jamais stocké en clair)</li>
        <li>Données de paiement (traitées par Chargily — Najaح n&apos;y a pas accès)</li>
      </ul>

      <h3>Données de l&apos;enfant</h3>
      <ul>
        <li>Prénom (l&apos;utilisation d&apos;un pseudonyme est encouragée)</li>
        <li>Âge et niveau scolaire</li>
        <li>Avatar (image stylisée, pas de photo réelle)</li>
        <li>Progression pédagogique : exercices effectués, scores, temps d&apos;étude</li>
        <li>Contenu soumis : rédactions, photos d&apos;exercices, dessins</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <p>Vos données sont utilisées exclusivement pour :</p>
      <ul>
        <li>Fournir et personnaliser le service éducatif</li>
        <li>Générer des rapports de progression</li>
        <li>Communiquer avec vous (support, notifications, rapports hebdomadaires)</li>
        <li>Améliorer la qualité pédagogique de la plateforme</li>
        <li>Garantir la sécurité du service (détection de fraude, modération)</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>Le traitement de vos données repose sur :</p>
      <ul>
        <li>
          <strong>Votre consentement</strong> (lors de l&apos;inscription)
        </li>
        <li>
          <strong>L&apos;exécution du contrat</strong> (fournir le service auquel vous êtes
          abonné)
        </li>
        <li>
          <strong>Nos obligations légales</strong> (facturation, conservation comptable)
        </li>
      </ul>

      <h2>5. Destinataires</h2>
      <p>
        Vos données ne sont jamais vendues. Elles sont partagées uniquement avec :
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — hébergement de la base de données (UE)
        </li>
        <li>
          <strong>Vercel</strong> — hébergement du site web
        </li>
        <li>
          <strong>Chargily Pay</strong> — traitement des paiements (Algérie)
        </li>
        <li>
          <strong>Resend</strong> — envoi des emails transactionnels
        </li>
        <li>
          <strong>Anthropic</strong> — fourniture du tuteur en ligne (les données sont
          anonymisées avant transmission)
        </li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>Compte actif : aussi longtemps que vous utilisez le service</li>
        <li>Compte inactif : suppression automatique après 24 mois sans connexion</li>
        <li>Données de facturation : 10 ans (obligation légale algérienne)</li>
        <li>Logs techniques : 90 jours</li>
      </ul>

      <h2>7. Sécurité</h2>
      <p>
        Vos données sont chiffrées au repos et en transit (HTTPS / TLS 1.3). Les mots de
        passe sont hachés avec bcrypt. Seuls les administrateurs techniques autorisés ont
        accès aux serveurs, et chaque accès est journalisé.
      </p>

      <h2>8. Vos droits (Loi 18-07)</h2>
      <p>Vous disposez en permanence des droits suivants :</p>
      <ul>
        <li>
          <strong>Droit d&apos;accès</strong> : obtenir une copie de toutes vos données
        </li>
        <li>
          <strong>Droit de rectification</strong> : corriger les données inexactes
        </li>
        <li>
          <strong>Droit à l&apos;effacement</strong> : supprimer votre compte et vos données
        </li>
        <li>
          <strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données
        </li>
        <li>
          <strong>Droit à la portabilité</strong> : récupérer vos données dans un format ouvert
        </li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez à{" "}
        <a href="mailto:privacy@naja7dz.com">privacy@naja7dz.com</a>. Réponse sous 30 jours
        maximum.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Najaح n&apos;utilise que des cookies <strong>strictement nécessaires</strong> au
        fonctionnement du site (session, langue, thème). Aucun cookie publicitaire, aucun
        pistage tiers. Voir notre{" "}
        <a href="/legal/loi-18-07">page Loi 18-07</a> pour plus de détails.
      </p>

      <h2>10. Mineurs</h2>
      <p>
        Najaح est destiné à un public mineur sous la responsabilité d&apos;un parent ou
        tuteur légal. Aucune donnée d&apos;enfant ne peut être collectée sans le consentement
        explicite du parent. Les profils publics des enfants ne montrent jamais leur vrai
        nom, âge précis ou localisation.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Cette politique peut évoluer. Les modifications majeures vous seront notifiées par
        email. Date de la dernière mise à jour indiquée en haut de cette page.
      </p>
    </LegalShell>
  );
}
