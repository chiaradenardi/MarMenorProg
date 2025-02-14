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
  description: "Ottiene tutti i dati meteo della laguna in un intervallo di date specifico dal dataset più recente.",
  parameters: z.object({
    start: z.string().describe("Data di inizio nel formato YYYY-MM-DD."),
    end: z.string().describe("Data di fine nel formato YYYY-MM-DD."),
  }),
  execute: async ({ start, end }) => {
    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T23:59:59Z`);

    // Filtra i dati in base all'intervallo di date specificato
    const filteredData = typedWeatherData.wet2d.data.filter(entry => {
      const entryDate = new Date(entry.time);
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Se non ci sono dati per il periodo selezionato, ritorna un errore
    if (filteredData.length === 0) {
      return { error: "Nessun dato trovato per il periodo selezionato." };
    }

    return { data: filteredData };
  },
});

export default getWeatherData;
