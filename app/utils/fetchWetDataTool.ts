//app/utils/fetchWetDataTool.ts

import { fetchWetData } from "./fetchWet2d";

//funzione asincrona che si occupa di recuperare i dati tra due date (start e end)
export const fetchWetDataTool = async (start: string, end: string, depth: number) => {
  try {
    //prova a recuperare i dati chiamando fetchWetData e passando le date come parametri
    const temperatureData = await fetchWetData(start, end);
    console.log("Dati temperatura ricevuti:", JSON.stringify(temperatureData, null, 2));    


    //se la richiesta ha successo, restituisce i dati ricevuti
    return temperatureData;  
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error); 
    return { error: "Si è verificato un errore durante il recupero dei dati." };
  }
};
