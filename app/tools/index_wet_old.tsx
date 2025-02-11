import { tool } from "ai";
import { z } from "zod";
import weatherDataRaw from "@/app/utils/weatherDataOLD.json"; 

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

type WeatherData = z.infer<typeof WeatherDataSchema>;

// Supponiamo che `weatherDataRaw` sia il tuo JSON
const typedWeatherData: WeatherData = WeatherDataSchema.parse(weatherDataRaw);

const cleanedWeatherData = {
  ...typedWeatherData,
  depth: {
    ...typedWeatherData.wet2d, // Usa il dato corretto, ad esempio wet2d
    data: typedWeatherData.wet2d?.data?.flat().filter((item: any) => typeof item === "number") || []
  }
};

const getWeatherData = tool({
  description: "Ottiene i dati meteo della laguna in un intervallo di date specifico dal dataset più recente.",
  parameters: z.object({
    start: z.string().describe("Data di inizio nel formato YYYY-MM-DD."),
    end: z.string().describe("Data di fine nel formato YYYY-MM-DD."),
  }),
  execute: async ({ start, end }) => {
    const startDate = new Date(`${start}T00:00:00Z`);
    const endDate = new Date(`${end}T23:59:59Z`);

    const filteredIndices = typedWeatherData.wet2d.data
      .map((entry, index) => ({
        time: entry.time,
        index,
        date: new Date(entry.time),
      }))
      .filter(({ date }) => date >= startDate && date <= endDate);

    if (filteredIndices.length === 0) {
      return { error: "Nessun dato trovato per il periodo selezionato." };
    }

    const results = filteredIndices.map(({ index, time }) => ({
      time,
      minTemperature: Math.min(...typedWeatherData.wet2d.data[index].values.map((v) => v.value)),
      maxTemperature: Math.max(...typedWeatherData.wet2d.data[index].values.map((v) => v.value)),
    }));

    return results;
  },
});

export default getWeatherData;
