import { LegalShell } from "@/components/landing/LegalShell";

export const metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  return (
    <LegalShell title="Mentions légales" updated="5 mai 2026">
      <h2>Éditeur du site</h2>
      <p>
        <strong>Najaح</strong>
        <br />
        Plateforme éducative algérienne
        <br />
        Site : <a href="https://naja7dz.com">naja7dz.com</a>
        <br />
        Email : <a href="mailto:contact@naja7dz.com">contact@naja7dz.com</a>
      </p>
      <p>
        <em>
          Les informations légales (RC, NIF, capital social, siège social) seront
          ajoutées dès l&apos;immatriculation officielle de l&apos;entité juridique.
        </em>
      </p>

      <h2>Hébergement</h2>
      <p>
        <strong>Vercel Inc.</strong>
        <br />
        340 S Lemon Ave #4133, Walnut, CA 91789, USA
        <br />
        <a href="https://vercel.com">vercel.com</a>
      </p>
      <p>
        <strong>Supabase Inc.</strong> (base de données)
        <br />
        970 Toa Payoh North #07-04, Singapore 318992
        <br />
        <a href="https://supabase.com">supabase.com</a>
      </p>

      <h2>Paiements</h2>
      <p>
        Les paiements sur naja7dz.com sont traités par <strong>Chargily Pay</strong>,
        prestataire algérien agréé. Najaح n&apos;a jamais accès à vos données bancaires.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu présent sur naja7dz.com (textes, images, logos, code
        source, base de données) est la propriété exclusive de Najaح ou de ses partenaires,
        et est protégé par les lois algériennes et internationales relatives à la propriété
        intellectuelle.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication ou adaptation totale
        ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé,
        est interdite sans l&apos;autorisation écrite préalable de Najaح.
      </p>

      <h2>Crédits</h2>
      <p>
        Polices : Poppins (Google Fonts), Tajawal (Google Fonts) — sous licence SIL Open
        Font License.
        <br />
        Icônes : inspirées de Lucide Icons, sous licence ISC.
      </p>

      <h2>Contact légal</h2>
      <p>
        Pour toute question juridique, mise en demeure ou demande de retrait de contenu :{" "}
        <a href="mailto:legal@naja7dz.com">legal@naja7dz.com</a>
      </p>

      <h2>Loi applicable</h2>
      <p>
        Le site naja7dz.com est régi par le droit algérien. Tout litige relève de la
        compétence des tribunaux d&apos;Alger.
      </p>
    </LegalShell>
  );
}
