'use client';

import { useState } from "react";
import getWeatherData from "@/app/tools/index_wet_old"; // Tool usato nella chatbot
import Link from "next/link";
import Image from 'next/image';

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false); // Stato per mostrare/nascondere la tabella
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null); // Stato per il messaggio di nessun dato

  // Funzione asincrona per ottenere i dati dal tool della chatbot
  const handleFetchData = async () => {
    if (!startDate || !endDate) return; // Evita chiamate senza date selezionate
    setLoading(true);
    setNoDataMessage(null); // Resetta il messaggio di nessun dato

    try {
      const response = await getWeatherData.execute(
        { start: startDate, end: endDate },
        { toolCallId: "unique-id", messages: [] }
      );
      
      if (!response.data || response.data.length === 0) {
        setNoDataMessage("Nessun dato meteorologico per questo range di date.");
      } else {
        setData(response.data || null); // Imposta i dati ricevuti
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati:", error);
      setData(null);
      setNoDataMessage("Errore nel recupero dei dati.");
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

      {/* Messaggio di errore o nessun dato */}
      {noDataMessage && (
        <p className="text-red-500 mb-8 font-semibold">{noDataMessage}</p>
      )}

      {/* Bottone per mostrare/nascondere la tabella */}
      {data && !noDataMessage && (
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-green-500 text-white p-2 rounded mb-8"
        >
          {showTable ? "Nascondi Tabella" : "Mostra Tabella"}
        </button>
      )}

      {/* Visualizzazione dei dati */}
      {loading && <p>Caricamento...</p>}
      {!loading && data && showTable && (
        <>
          <h1 className="text-lg mb-8 font-semibold">Dati Meteo</h1>

          {/* Tabella con dati */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-gray-300 p-2">Giorno e Ora</th>
                  <th className="border border-gray-300 p-2">Profondità</th>
                  <th className="border border-gray-300 p-2">Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry: { time: string; values: { z: number; value: number }[] }, index: number) => (
                  entry.values.map((value, idx) => (
                    <tr key={`${index}-${idx}`} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                      <td className="border border-gray-300 p-2 text-center">{entry.time}</td>
                      <td className="border border-gray-300 p-2 text-center">{value.z}</td>
                      <td className="border border-gray-300 p-2 text-center">{value.value}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
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
