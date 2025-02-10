//app/utils/fetchWetDataTool.ts

import { fetchWetData } from "./fetchWet2d";

//funzione asincrona che si occupa di recuperare i dati tra due date (start e end)
export const fetchWetDataTool = async (start: string, end: string) => {
  try {
    //prova a recuperare i dati chiamando fetchWetData e passando le date come parametri
    const data = await fetchWetData(start, end);

    //se la richiesta ha successo, restituisce i dati ricevuti
    return data;  
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error); 
    return { error: "Si è verificato un errore durante il recupero dei dati." };
  }
};
