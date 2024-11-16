'use client'; //per poter usare useState-->eseguiti nel browser

import { useState } from "react";
import { fetchWetData } from "./utils/fetchWet2d";

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any | null>(null); //stato per salvare i dati fetchati
  const [loading, setLoading] = useState(false); //stato per mostrare il caricamento dei dati

  const handleFetchData = async () => {
    setLoading(true);
    const response = await fetchWetData(startDate, endDate); //passa le date alla funzione della query
    setData(response.wet2d);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl mb-4 font-bold">Benvenuto nella home</h1>
      
      {/*form per selezionare le date */}
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
          <h1 className="text-lg mb-8">Dati per {data.name}</h1>
          <h1 className="text-lg mb-8">Unità: {data.unit}</h1>
          <ul>
            {data.data.map((entry: { time: string; values: { z: number; value: number }[] }, index: number) => (
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
    </div>
  );
};

export default Page;
