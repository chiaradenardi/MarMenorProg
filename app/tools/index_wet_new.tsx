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

type WeatherData = z.infer<typeof WeatherDataSchema>;

const cleanedWeatherData = {
  ...weatherData,
  depth: {
    ...weatherData.depth,
    data: weatherData.depth?.data?.flat().filter((item: any) => typeof item === "number") || []
  }
};

const typedWeatherData: WeatherData = WeatherDataSchema.parse(cleanedWeatherData);

// Tool per ottenere i dati meteo tra due date specifiche
const getWeatherData = tool({
  description: "Ottiene i dati meteo della laguna in un intervallo di date specifico dal dataset più recente.",
  parameters: z.object({
    start: z.string().describe("Data di inizio nel formato YYYY-MM-DD."),
    end: z.string().describe("Data di fine nel formato YYYY-MM-DD."),
  }),
  execute: async ({ start, end }) => {
    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T23:59:59Z`);

    const filteredIndices = typedWeatherData.time.data
      .map((time, index) => ({
        time,
        index,
        date: new Date(time),
      }))
      .filter(({ date }) => date >= startDate && date <= endDate);

    if (filteredIndices.length === 0) {
      return { error: "Nessun dato trovato per il periodo selezionato." };
    }

    const results = filteredIndices.map(({ index, time }) => ({
      time,
      minTemperature: Math.min(...typedWeatherData.temp.data[index]),
      maxTemperature: Math.max(...typedWeatherData.temp.data[index]),
    }));
    

    return results;
  },
});

export default getWeatherData;
