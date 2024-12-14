// app/utils/fetchWetDataTool.ts
import { fetchWetData } from "./fetchWet2d";

export const fetchWetDataTool = async (start: string, end: string) => {
  try {
    const data = await fetchWetData(start, end);
    return data;  
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return { error: "Si è verificato un errore durante il recupero dei dati." };
  }
};
