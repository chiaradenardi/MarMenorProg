"use client"

import { useState } from "react";
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import getWeatherData from "@/app/tools/index_wet_old"; // Tool usato nella chatbot
import Link from "next/link";
import Image from 'next/image';
import { format } from "date-fns";
import 'react-date-range/dist/styles.css'; // Importa lo stile
import 'react-date-range/dist/theme/default.css'; // Importa il tema

const Page = () => {
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection',
  });
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);

  // Funzione asincrona per ottenere i dati
  const handleFetchData = async () => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return;
    setLoading(true);
    setNoDataMessage(null);

    try {
      const response = await getWeatherData.execute(
        {
          start: format(startDate, "yyyy-MM-dd"),
          end: format(endDate, "yyyy-MM-dd"),
        },
        { toolCallId: "unique-id", messages: [] }
      );

      if (!response.data || response.data.length === 0) {
        setNoDataMessage("Nessun dato meteorologico per questo range di date.");
      } else {
        setData(response.data || null);
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
      <h1 className="text-center mb-4">
        Seleziona un range di date per vedere la variazione della temperatura nella laguna in base anche alla sua profondità.
      </h1>

      {/* Calendario per selezionare un intervallo di date */}
      <div className="mb-8 flex justify-center">
        <DateRangePicker
          ranges={[dateRange]}
          onChange={(item: any) => setDateRange(item.selection)}
        />
      </div>

      {/* Bottone per ottenere i dati */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleFetchData}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Caricamento..." : "Mostra dati"}
        </button>
      </div>

      {/* Messaggio di errore */}
      {noDataMessage && <p className="text-red-500 mt-4 font-semibold text-center">{noDataMessage}</p>}

      {/* Bottone per mostrare/nascondere la tabella */}
      {data && !noDataMessage && (
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowTable(!showTable)}
            className="bg-green-500 text-white p-2 rounded"
          >
            {showTable ? "Nascondi Tabella" : "Mostra Tabella"}
          </button>
        </div>
      )}

      {/* Tabella con i dati */}
      {!loading && data && showTable && (
        <div className="mt-8">
          <h1 className="text-lg font-semibold mb-4 text-center">Dati Meteo</h1>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-gray-300 p-2">Giorno e Ora</th>
                  <th className="border border-gray-300 p-2">Profondità (m)</th>
                  <th className="border border-gray-300 p-2">Temperatura</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry: { time: string; values: { z: number; value: number }[] }, index: number) =>
                  entry.values.map((value, idx) => {
                    const dateTime = new Date(entry.time);
                    const date = format(dateTime, "dd/MM/yyyy");
                    const time = format(dateTime, "HH:mm");
                    const hour = dateTime.getHours();
                    const rowColor = hour % 2 === 0 ? "bg-gray-100" : "bg-white";

                    return (
                      <tr key={`${index}-${idx}`} className={rowColor}>
                        <td className="border border-gray-300 p-2 text-center">{date} {time}</td>
                        <td className="border border-gray-300 p-2 text-center">{value.z}</td>
                        <td className="border border-gray-300 p-2 text-center">{value.value}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
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
