const MentionLegalPage = () => {
  return (
    <main className="custom-screen mt-20 flex flex-col gap-8 py-16">
      <div>
        <h1 className="text-xl font-bold">INFORMATIONS PRINCIPALES</h1>
        <p>
          <span className="font-bold">Dénomination ou raison sociale :</span>
          MK-Web
        </p>
        <p>
          <span className="font-bold">Siège social :</span> 4 MAIL DES PETITS
          CLOS 28000 CHARTRES
        </p>
        <p>
          <span className="font-bold">Tél :</span> +33 6 46 77 78 04 -{' '}
          <span className="font-bold">Email :</span> contact@mk-web.fr
        </p>
        <p>
          <span className="font-bold">SIRET :</span> 93179152900015
        </p>
        <p>
          <span className="font-bold">TVA :</span> FR81931791529
        </p>
      </div>

      <div>
        <h1 className="text-xl font-bold">HEBERGEMENT</h1>
        <p>
          Le site{' '}
          <a href="https://mk-web.fr/" target="_blank">
            mk-web.fr
          </a>{' '}
          est hébergé par IONOS, dont le siège social est 7 PLACE DE LA GARE
          57200 SARREGUEMINES, joignable par le moyen suivant :
          https://www.ionos.fr/contact
        </p>
      </div>

      <div>
        <h1 className="text-xl font-bold">CRÉATION</h1>
        <p>EI Mohamad AL-KHATIB</p>
      </div>
    </main>
  );
};

export default MentionLegalPage;
