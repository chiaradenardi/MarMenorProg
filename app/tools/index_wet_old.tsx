import { tool } from "ai";
import { z } from "zod";
import weatherDataRaw from "@/app/utils/weatherDataOLD.json"; 

// Definizione dello schema Zod per validare la struttura dei dati meteo
const WeatherDataSchema = z.object({
  wet2d: z.object({
    data: z.array(
      z.object({
        time: z.string(), // Ora in formato stringa
        values: z.array(
          z.object({
            z: z.number(),  // Profondità
            value: z.number() // Temperatura
          })
        )
      })
    )
  })
});

// Tipo `WeatherData` che corrisponde alla struttura definita dallo schema Zod
type WeatherData = z.infer<typeof WeatherDataSchema>;

// Applica la validazione Zod a weatherDataRaw per garantirne la struttura corretta
const typedWeatherData: WeatherData = WeatherDataSchema.parse(weatherDataRaw);

// Per ottenere i dati meteo tra due date specifiche
const getWeatherData = tool({
  description: "Ottiene i dati meteo della laguna in un intervallo di date specifico dal dataset più recente.",
  parameters: z.object({
    start: z.string().describe("Data di inizio nel formato YYYY-MM-DD."),
    end: z.string().describe("Data di fine nel formato YYYY-MM-DD."),
  }),
  execute: async ({ start, end }) => {
    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T23:59:59Z`);

    // Filtra gli indici dei dati meteo in base all'intervallo di date specificato
    const filteredIndices = typedWeatherData.wet2d.data
      .map((entry, index) => ({
        time: entry.time,
        index,
        date: new Date(entry.time),
      }))
      .filter(({ date }) => date >= startDate && date <= endDate);

    // Se non ci sono dati per il periodo selezionato, ritorna un errore
    if (filteredIndices.length === 0) {
      return { error: "Nessun dato trovato per il periodo selezionato." };
    }

    // Calcola la temperatura minima e massima per ciascun dato filtrato
    const results = filteredIndices.map(({ index, time }) => ({
      time,
      minTemperature: Math.min(...typedWeatherData.wet2d.data[index].values.map((v) => v.value)),
      maxTemperature: Math.max(...typedWeatherData.wet2d.data[index].values.map((v) => v.value)),
    }));

    return results;
  },
});

export default getWeatherData;
