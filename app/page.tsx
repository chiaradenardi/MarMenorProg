'use client';

import { useState } from "react";
import getWeatherData from "@/app/tools/index_wet_old"; // Importa il tool usato nella chatbot
import Link from "next/link";
import Image from 'next/image';

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Funzione asincrona per ottenere i dati dal tool della chatbot
  const handleFetchData = async () => {
    if (!startDate || !endDate) return; // Evita chiamate senza date selezionate
    setLoading(true);
    
    try {
      const response = await getWeatherData.execute(
        { start: startDate, end: endDate },
        { toolCallId: "unique-id", messages: [] }
      );
      setData(response.data || null); // Imposta i dati ricevuti
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
      setData(null);
    }

    setLoading(false);
  };

  return (
    <div className="p-20 flex-grow">
      <h1 className="text-4xl mb-4 font-bold">Benvenuto nella home</h1>
      
      {/* Form per selezionare le date */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFetchData();
        }}
        className="mb-8"
      >
        <label className="block mb-2">
          Data di inizio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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

      {/* Visualizzazione dei dati */}
      {loading && <p>Caricamento...</p>}
      {!loading && data && (
        <>
          <h1 className="text-lg mb-8">Dati Meteo</h1>
          <ul>
            {data.map((entry: { time: string; values: { z: number; value: number }[] }, index: number) => (
              <li key={index}>
                <strong>Tempo:</strong> {entry.time}
                <ul>
                  {entry.values.map((value: { z: number; value: number }, idx: number) => (
                    <li key={idx}>
                      Z: {value.z}, Valore: {value.value}
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
