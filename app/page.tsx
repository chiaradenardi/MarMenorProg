'use client'; //dato che il componente deve essere eseguito nel browser

import { useState } from "react"; 
import { fetchWetData } from "./utils/fetchWet2d";
import Link from "next/link";
import Image from 'next/image';

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  //funzione asincrona per recuperare i dati in base alle date selezionate
  const handleFetchData = async () => {
    setLoading(true); //imposta lo stato di loading a true per indicare che i dati sono in fase di caricamento
    const response = await fetchWetData(startDate, endDate); //recupera i dati usando la funzione importata
    setData(response.wet2d); //imposta i dati ottenuti nello stato
    setLoading(false); //imposta lo stato di loading a false una volta che i dati sono stati ricevuti
  };

  return (
    <div className="p-20 flex-grow">
      <h1 className="text-4xl mb-4 font-bold">Benvenuto nella home</h1>
      
      {/*form per selezionare le date */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); //previene il refresh della pagina quando viene inviato il form
          handleFetchData(); //chiama la funzione per recuperare i dati
        }}
        className="mb-8"
      >
        <label className="block mb-2">
          Data di inizio:
          <input
            type="date"
            value={startDate} //imposta il valore dell'input con la data di inizio selezionata
            onChange={(e) => setStartDate(e.target.value)} //aggiorna lo stato startDate quando l'utente cambia la data
            className="border p-2 rounded"
          />
        </label>
        <label className="block mb-4">
          Data di fine:
          <input
            type="date"
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2 rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Mostra dati
        </button>
      </form>

      {/*visualizzazione dei dati */}
      {loading && <p>Caricamento...</p>} 
      {!loading && data && ( //se non si sta caricando e ci sono dati disponibili
        <>
          <h1 className="text-lg mb-8">Dati per {data.name}</h1> {/* visualizza il nome dei dati */}
          <h1 className="text-lg mb-8">Unità: {data.unit}</h1> {/* visualizza l'unità di misura */}
          <ul>
            {/*itera su ogni voce nel range di date (data.data è una lista di dati temporali) */}
            {data.data.map((entry: { time: string; values: { z: number; value: number }[] }, index: number) => (
              <li key={index}>
                <strong>Tempo:</strong> {entry.time} {/*visualizza il tempo di ogni voce */}
                <ul>
                  {/*itera sui valori associati ad ogni tempo */}
                  {entry.values.map((value: { z: number; value: number }, idx: number) => (
                    <li key={idx}>
                      Z: {value.z}, Valore: {value.value} {/*mostra i dettagli dei valori (z e value) */}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Logo ChatGPT cliccabile */}
      <div className="mt-12 flex justify-end">
          <Link href="/chatbot">
              <Image
                  src="/images/chatgpt-logo.png" 
                  alt="Chatbot"
                  width={50}
                  height={50}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
              />
          </Link>
      </div>
    </div>
  );
};

export default Page;
