import weatherData from "@/app/utils/weatherData.json"; // Supponiamo che il JSON sia nella cartella utils

interface WeatherData {
  time: { data: string[] };
  depth: { data: number[] };
  temp: { data: number[][] };
}

type TrendEntry = {
  depth: number;
  time: string;  // Aggiungiamo l'orario per ogni trend
  trend: "increase" | "decrease" | "none";
};

const typedWeatherData: WeatherData = weatherData as WeatherData;

// Funzione per recuperare i dati meteo con temperatura minima e massima nel periodo richiesto
export const fetchWetData = async (start: string, end: string) => {
  // Filtra i dati in base alla data
  const filteredTime = typedWeatherData.time.data.filter((time) => {
    const timeDate = new Date(time);
    const startDate = new Date(`${start}T00:00:00Z`); // Aggiunge l'orario
    const endDate = new Date(`${end}T23:59:59Z`); // Assicura di prendere tutta la giornata

    return timeDate >= startDate && timeDate <= endDate;
  });

  if (filteredTime.length === 0) {
    return "Nessun dato trovato per il periodo indicato.";
  }

  // Estrai i dati per tutte le profondità e il periodo filtrato
  const temperatureData = filteredTime.map((time) => {
    const timeIndex = typedWeatherData.time.data.indexOf(time);
    const temperaturesAtDepths = typedWeatherData.depth.data.map((depth, depthIndex) => ({
      depth,
      temperature: typedWeatherData.temp.data[timeIndex][depthIndex],
      time,  // Aggiungi l'orario ai dati
    }));

    return temperaturesAtDepths;
  });

  // Trova la temperatura minima e massima e analizza i trend
  let minTemperature = Infinity;
  let maxTemperature = -Infinity;

  const trendAnalysis = temperatureData.map((dayData) => {
    let dayTrend: TrendEntry[] = []; // Specifica il tipo dell'array
    let prevTemperature = dayData[0].temperature;
    let currentTrend: "increase" | "decrease" | "none" = "none"; // Tipo più preciso
    let trendStartDepth: number | null = null;

    dayData.forEach((entry) => {
      if (entry.temperature > prevTemperature) {
        if (currentTrend !== "increase") {
          if (trendStartDepth !== null) {
            dayTrend.push({
              depth: trendStartDepth, // Aggiungi la profondità da cui inizia il trend
              time: entry.time,       // Aggiungi l'orario
              trend: currentTrend,
            });
          }
          currentTrend = "increase";
          trendStartDepth = entry.depth; // Salva la profondità dove inizia l'aumento
        }
      } else if (entry.temperature < prevTemperature) {
        if (currentTrend !== "decrease") {
          if (trendStartDepth !== null) {
            dayTrend.push({
              depth: trendStartDepth, // Aggiungi la profondità da cui inizia il trend
              time: entry.time,       // Aggiungi l'orario
              trend: currentTrend,
            });
          }
          currentTrend = "decrease";
          trendStartDepth = entry.depth; // Salva la profondità dove inizia la diminuzione
        }
      }

      prevTemperature = entry.temperature;
    });

    // Aggiungi l'ultimo trend se presente
    if (trendStartDepth !== null) {
      dayTrend.push({
        depth: trendStartDepth,
        time: dayData[dayData.length - 1].time, // Usa l'ultimo orario disponibile
        trend: currentTrend,
      });
    }

    // Aggiungi anche la temperatura accanto al trend
    return dayTrend.map(entry => ({
      depth: entry.depth,
      temperature: dayData.find(d => d.depth === entry.depth)?.temperature ?? 0, // Trova la temperatura per quella profondità
      time: entry.time,
      trend: entry.trend,
    }));
  });

  // Trova la temperatura minima e massima
  temperatureData.forEach((dayData) => {
    dayData.forEach((entry) => {
      if (entry.temperature < minTemperature) minTemperature = entry.temperature;
      if (entry.temperature > maxTemperature) maxTemperature = entry.temperature;
    });
  });

  // Restituisce i dati con la temperatura minima, massima e l'analisi del trend
  return {
    start,
    end,
    min_temperature: minTemperature,
    max_temperature: maxTemperature,
    trend_analysis: JSON.stringify(trendAnalysis, null, 2), // Converti l'analisi in stringa leggibile
  };
};
