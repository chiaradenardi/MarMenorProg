import weatherData from "@/app/utils/weatherData.json"; 

interface WeatherData {
  time: { data: string[] };
  depth: { data: number[] };
  temp: { data: number[][] };
}

type TrendEntry = {
  depth: number;
  time: string; 
  trend: "increase" | "decrease" | "none";
};

const typedWeatherData: WeatherData = weatherData as WeatherData;

// Funzione per estraere le temperature tra due date e analizzare i trend di variazione (temp min, max, increase/decrease)
export const fetchWetData = async (start: string, end: string) => {
  // Filtra i dati in base alla data all'interno del json
  const filteredTime = typedWeatherData.time.data.filter((time) => {
    const timeDate = new Date(time);
    const startDate = new Date(`${start}T00:00:00Z`); // Aggiunge l'orario
    const endDate = new Date(`${end}T23:59:59Z`);

    return timeDate >= startDate && timeDate <= endDate;
  });

  // Se non ci sono dati nel periodo scelto, restituisce un messaggio di errore
  if (filteredTime.length === 0) {
    return "Nessun dato trovato per il periodo indicato.";
  }

  // Estrai i dati per tutte le profondità e il periodo filtrato
  const temperatureData = filteredTime.map((time) => {
    const timeIndex = typedWeatherData.time.data.indexOf(time);
    const temperaturesAtDepths = typedWeatherData.depth.data.map((depth, depthIndex) => ({
      depth,
      temperature: typedWeatherData.temp.data[timeIndex][depthIndex],
      time,
    }));

    return temperaturesAtDepths;
  });

  // Trova la temperatura minima e massima
  let minTemperature = Infinity;
  let maxTemperature = -Infinity;

  temperatureData.forEach((dayData) => {
    dayData.forEach((entry) => {
      if (entry.temperature < minTemperature) minTemperature = entry.temperature;
      if (entry.temperature > maxTemperature) maxTemperature = entry.temperature;
    });
  });

  // Per ogni giorno analizza le variazioni di temperatura per ogni profondità
  const trendAnalysis = temperatureData.map((dayData) => {
    let dayTrend: TrendEntry[] = [];
    let prevTemperature: number | null = null; // Impostato come null per il primo confronto
    let currentTrend: "increase" | "decrease" | "none" = "none";
    let trendStartDepth: number | null = null;

    /**
     * Confronta ogni temperatura con la precedente:
     * Se aumenta, segna un trend increase.
     * Se diminuisce, segna un trend decrease.
     * Se rimane stabile, il trend non cambia.
     */
    dayData.forEach((entry) => {
      if (prevTemperature !== null) {
        if (entry.temperature < prevTemperature) {
          if (currentTrend !== "increase") {
            if (trendStartDepth !== null) {
              dayTrend.push({
                depth: trendStartDepth,
                time: entry.time,
                trend: currentTrend,
              });
            }
            currentTrend = "increase";
            trendStartDepth = entry.depth;
          }
        } else if (entry.temperature > prevTemperature) {
          if (currentTrend !== "decrease") {
            if (trendStartDepth !== null) {
              dayTrend.push({
                depth: trendStartDepth,
                time: entry.time,
                trend: currentTrend,
              });
            }
            currentTrend = "decrease";
            trendStartDepth = entry.depth;
          }
        } else {
          // Se la temperatura non cambia, non aggiorniamo il trend
          if (currentTrend === "none") {
            currentTrend = "none"; // Assicura che il trend resti "none"
          }
        }
      }

      prevTemperature = entry.temperature;
    });

    // Se alla fine del ciclo c’è ancora un trend in corso, lo aggiungiamo a dayTrend
    if (trendStartDepth !== null) {
      dayTrend.push({
        depth: trendStartDepth,
        time: dayData[dayData.length - 1].time, // Usa l'ultimo orario disponibile
        trend: currentTrend,
      });
    }

    return dayTrend.map((entry) => ({
      depth: entry.depth,
      temperature: dayData.find((d) => d.depth === entry.depth)?.temperature ?? 0,
      time: entry.time,
      trend: entry.trend,
    }));
  });

  // Restituisce i dati con la temperatura minima, massima e l'analisi del trend
  return {
    start,
    end,
    min_temperature: minTemperature,
    max_temperature: maxTemperature,
    trend_analysis: trendAnalysis.flatMap((dayTrend) =>
      dayTrend.map((entry) =>
        `A profondità ${entry.depth}m, temperatura ${entry.temperature.toFixed(2)}°C, trend: ${entry.trend}, orario: ${entry.time}`
      )
    ).join("\n"),
  };
};
