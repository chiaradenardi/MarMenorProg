"use server"; // Codice eseguito sul server

export const fetchWetData = async (start: string, end: string) => {
  const formattedStart = `${start}T00:00:00Z`;
  const formattedEnd = `${end}T23:59:59Z`;

  const query = `
    query wet($place: String, $param: Wet_2d_enum, $start: SymbolicDatetime, $end: SymbolicDatetime, $upper: Float, $lower: Float) {
      wet2d(place: $place, param: $param, start: $start, end: $end, upper: $upper, lower: $lower) {
        data {
          time
          values {
            z
            value
          }
        }
        unit
        forecastDate
        name
      }
    }`;

  const variables = {
    place: "marmenor2024",
    start: formattedStart,
    end: formattedEnd,
    upper: -9999,
    lower: 0,
    param: "temp",
  };

  try {
    const response = await fetch("http://test.asap-forecast.com:8081/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore dalla API:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Errore durante il fetch:", error);
    throw error;
  }
};

// Funzione per scaricare i dati in JSON
const downloadJSON = (data: any, filename = "weather_data.json") => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Funzione per gestire il download
export const handleDownload = async () => {
  try {
    const data = await fetchWetData("2025-01-01", "2025-01-31"); // Cambia le date se necessario
    downloadJSON(data);
  } catch (error) {
    console.error("Errore nel download:", error);
  }
};
