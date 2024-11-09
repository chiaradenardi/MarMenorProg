// app/page.tsx -->home
import React from 'react';

const Page = () => {
  return (
    <div>
      <h1>Benvenuto nella home</h1>
      <p>La temperatura dell'acqua della laguna è: .....</p>
      <h3>Data Disclaimer:</h3>
      <p>
      Questo portale rappresenta un digital twin della laguna del Mar Menor e del suo intero bacino idrografico, 
      reso operativo tramite il portale ASAP di WaterWebTools. Il digital twin è in fase di sviluppo e test come parte 
      del progetto SMARTLAGOON finanziato dal programma UE Horizon2020 Pathfinder FET (https://www.smartlagoon.eu/). 
      Il digital twin rappresenta i dati in tempo reale sulla temperatura e la qualità dell'acqua raccolti da una boa 
      situata al centro del Mar Menor, nonché le previsioni per i successivi 9 giorni relative all'idrologia del bacino 
      idrografico e alla temperatura e qualità dell'acqua della laguna. Tutti i dati in tempo reale e le previsioni sono provvisori. 
      Qualsiasi affidamento sui dati prima di una corretta validazione avviene senza alcuna responsabilità, obbligo o garanzia.
      </p>
    </div>
  );
};

export default Page;
