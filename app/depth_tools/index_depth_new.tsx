import { tool } from "ai";
import { z } from "zod";
import weatherDataRaw from "@/app/utils/weatherData.json"; 

const weatherData: WeatherData = weatherDataRaw as WeatherData;

// Definizione dello schema per validare i dati del JSON
const WeatherDataSchema = z.object({
  time: z.object({ data: z.array(z.string()) }),
  depth: z.object({ data: z.array(z.number()) }),
  temp: z.object({ data: z.array(z.array(z.number())) }),
});

// Definisce il tipo `WeatherData` basato sullo schema Zod
type WeatherData = z.infer<typeof WeatherDataSchema>;

// Pulizia dei dati: assicura che `depth` sia un array di numeri valido
const cleanedWeatherData = {
  ...weatherData,
  depth: {
    ...weatherData.depth,
    data: weatherData.depth?.data?.flat().filter((item: any) => typeof item === "number") || []
  }
};

// Applica la validazione e la tipizzazione ai dati puliti
const typedWeatherData: WeatherData = WeatherDataSchema.parse(cleanedWeatherData);

// Tool per ottenere i dati meteo filtrati per profondità
const getWeatherDataByDepth = tool({
  description: "Ottiene tutti i dati meteo della laguna per una specifica profondità dal dataset più recente.",
  parameters: z.object({
    depth: z.number().describe("Profondità in metri per cui ottenere i dati meteo."),
  }),
  execute: async ({ depth }) => {
    // Filtra gli indici in cui la profondità è uguale a quella richiesta
    const filteredIndices = typedWeatherData.depth.data
      .map((d, index) => ({ depth: d, index }))
      .filter(({ depth: d }) => d === depth);

    if (filteredIndices.length === 0) {
      return { error: `Nessun dato trovato per la profondità di ${depth} metri.` };
    }

    // Mappa i dati per ogni indice corrispondente alla profondità richiesta
    const results = filteredIndices.map(({ index }) => ({
      time: typedWeatherData.time.data[index] ?? null,
      depth: typedWeatherData.depth.data[index] ?? null,
      temp: typedWeatherData.temp.data[index] ?? [],
    }));

    return { data: results };
  },
});

export default getWeatherDataByDepth;
