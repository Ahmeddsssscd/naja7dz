import { LegalShell } from "@/components/landing/LegalShell";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Conformité Loi 18-07" };

export default function Loi1807Page() {
  return (
    <LegalShell title="Conformité — Loi 18-07" updated="5 mai 2026">
      <p>
        La <strong>Loi n° 18-07 du 25 Ramadhan 1439 correspondant au 10 juin 2018</strong>{" "}
        relative à la protection des personnes physiques dans le traitement des données à
        caractère personnel est le cadre légal algérien de la protection des données
        personnelles. Cette page explique comment Najaح applique cette loi.
      </p>

      <h2>Qui est concerné ?</h2>
      <p>
        La Loi 18-07 protège tous les résidents algériens dont les données sont traitées
        par une entreprise opérant en Algérie ou ciblant le marché algérien. Cela inclut
        tous les utilisateurs de Najaح.
      </p>

      <h2>Principes appliqués par Najaح</h2>

      <h3>1. Consentement</h3>
      <p>
        Aucune donnée personnelle n&apos;est collectée sans votre consentement explicite,
        donné lors de l&apos;inscription. Le consentement est libre, éclairé et révocable
        à tout moment depuis votre espace ou par email à{" "}
        <a href="mailto:privacy@naja7dz.com">privacy@naja7dz.com</a>.
      </p>

      <h3>2. Finalité limitée</h3>
      <p>
        Vos données ne sont utilisées que pour les finalités explicitement déclarées dans
        notre <Link href="/legal/confidentialite">politique de confidentialité</Link> :
        fourniture du service éducatif, communication, sécurité, amélioration pédagogique.
        Aucune utilisation à des fins publicitaires ou commerciales tierces.
      </p>

      <h3>3. Minimisation</h3>
      <p>
        Najaح ne collecte que les données strictement nécessaires. Pas de numéro
        d&apos;identification nationale (NIN), pas de coordonnées bancaires (gérées par
        Chargily), pas de données biométriques.
      </p>

      <h3>4. Exactitude</h3>
      <p>
        Vous pouvez consulter et modifier vos données à tout moment depuis votre espace
        parent. Les corrections sont effectives immédiatement.
      </p>

      <h3>5. Conservation limitée</h3>
      <p>
        Les données sont conservées uniquement pendant la durée nécessaire au service.
        Comptes inactifs supprimés après 24 mois. Données de facturation conservées 10 ans
        (obligation comptable légale).
      </p>

      <h3>6. Sécurité</h3>
      <p>
        Chiffrement TLS 1.3 pour toutes les communications. Chiffrement au repos pour la
        base de données. Mots de passe hachés avec bcrypt. Audits de sécurité réguliers.
      </p>

      <h3>7. Transparence</h3>
      <p>
        Cette politique et notre <Link href="/legal/confidentialite">page de confidentialité</Link>{" "}
        détaillent toutes les pratiques de collecte et de traitement. Aucune pratique cachée.
      </p>

      <h2>Vos droits selon la Loi 18-07</h2>
      <ul>
        <li>
          <strong>Article 32 — Droit d&apos;accès :</strong> obtenir une copie de toutes
          vos données
        </li>
        <li>
          <strong>Article 33 — Droit de rectification :</strong> corriger les données
          inexactes
        </li>
        <li>
          <strong>Article 34 — Droit d&apos;opposition :</strong> refuser certains
          traitements
        </li>
        <li>
          <strong>Article 35 — Droit à l&apos;effacement :</strong> supprimer définitivement
          vos données
        </li>
        <li>
          <strong>Article 36 — Droit à la portabilité :</strong> récupérer vos données
          dans un format réutilisable
        </li>
      </ul>
      <p>
        Pour exercer un de ces droits, contactez{" "}
        <a href="mailto:privacy@naja7dz.com">privacy@naja7dz.com</a>. Délai de réponse :
        30 jours maximum (Art. 37).
      </p>

      <h2>Transferts hors Algérie</h2>
      <p>
        Certains de nos prestataires techniques (Vercel, Supabase, Resend) sont basés en
        Europe ou aux États-Unis. Ces transferts sont encadrés par des engagements
        contractuels équivalents au niveau de protection algérien.
      </p>

      <h2>Autorité de contrôle</h2>
      <p>
        L&apos;autorité algérienne en charge de la protection des données est l&apos;
        <strong>
          Autorité Nationale de Protection des Données à Caractère Personnel (ANPDP)
        </strong>
        . Vous pouvez les saisir en cas de litige non résolu avec Najaح.
      </p>

      <h2>Mineurs</h2>
      <p>
        Najaح s&apos;adresse à un public mineur. La loi exige le consentement explicite du
        parent ou tuteur légal pour tout traitement de données concernant un mineur. Ce
        consentement est recueilli lors de l&apos;ajout du profil enfant au compte parent.
      </p>

      <h2>Notification de violation</h2>
      <p>
        En cas d&apos;incident de sécurité affectant vos données, vous serez informé(e)
        par email dans les 72 heures, conformément à l&apos;Article 31.
      </p>

      <hr />
      <p>
        Pour toute question relative à la Loi 18-07 ou à la protection de vos données :{" "}
        <a href="mailto:privacy@naja7dz.com">privacy@naja7dz.com</a>
      </p>
    </LegalShell>
  );
}
