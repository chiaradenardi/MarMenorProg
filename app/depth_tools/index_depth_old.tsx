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

// Funzione per ottenere i dati filtrati per profondità
const getWeatherDataByDepth = tool({
  description: "Ottiene tutti i dati meteo della laguna per una specifica profondità dal dataset più recente.",
  parameters: z.object({
    depth: z.number().describe("Profondità in metri per cui ottenere i dati meteo."),
  }),
  execute: async ({ depth }) => {
    // Filtra i dati in base alla profondità specificata
    const filteredData = typedWeatherData.wet2d.data
      .map(entry => ({
        time: entry.time,
        values: entry.values.filter(value => value.z === depth) // Filtra per profondità
      }))
      .filter(entry => entry.values.length > 0); // Rimuove voci senza dati validi

    // Se non ci sono dati per la profondità selezionata, ritorna un errore
    if (filteredData.length === 0) {
      return { error: `Nessun dato trovato per la profondità di ${depth} metri.` };
    }

    return { data: filteredData };
  },
});

export default getWeatherDataByDepth;
