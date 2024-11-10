//components/Disclaimer.tsx

'use client'; //per poter usare useState-->eseguiti nel browser

import { useState } from 'react';
import { IoCloseCircleOutline } from 'react-icons/io5';

const Disclaimer = () => {
  //variabile per il disclaimer pop-up
  const [isPopUpVisible, setPopUpVisible] = useState<boolean>(false);

  //funzione per attivare/disattivare il pop-up
  const togglePopUp = () => setPopUpVisible(prev => !prev);

  return (
    <div>
      <div className='absolute bottom-8 right-8 p-3 bg-gray-700 text-white rounded-full cursor-pointer' onClick={togglePopUp}>
        {isPopUpVisible ? <IoCloseCircleOutline size={24} /> : <span>🔽</span>}
      </div>

      {isPopUpVisible && ( //mostra il testo se la var è true
        <div className='fixed bottom-16 right-4 p-6 bg-white shadow-lg rounded-md w-80'>
          <h3 className='text-xl mb-2 font-semibold'>Data Disclaimer:</h3>
          <p className='text-base'>
            Questo portale rappresenta un digital twin della laguna del Mar Menor e del suo intero bacino idrografico, 
            reso operativo tramite il portale ASAP di WaterWebTools. Il digital twin è in fase di sviluppo e test come parte 
            del progetto SMARTLAGOON finanziato dal programma UE Horizon2020 Pathfinder FET (https://www.smartlagoon.eu/). 
            Il digital twin rappresenta i dati in tempo reale e le previsioni per i successivi 9 giorni sulla temperatura e la qualità 
            dell'acqua raccolti da una boa situata al centro del Mar Menor. Tutti i dati in tempo reale e le previsioni sono provvisori. 
            Qualsiasi affidamento sui dati prima di una corretta validazione avviene senza alcuna responsabilità, obbligo o garanzia.
          </p>
        </div>
      )}
    </div>
  );
};

export default Disclaimer;
