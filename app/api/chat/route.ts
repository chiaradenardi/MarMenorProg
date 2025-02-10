import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { fetchWetData } from "@/app/utils/fetchWet2d"; 

// Definisce la struttura di un messaggio
interface Message {
  content: string; // Contenuto del messaggio
  role: "user" | "system" | "assistant"; // Ruolo del messaggio (utente, sistema, assistente)
  id: string; // ID univoco del messaggio
}

const model = openai("gpt-4o-mini");

// Prompt iniziale per il modello col suo comportamento
const systemPrompt = 
  "You are a friendly CLI interface with some tools up your sleeve. You can fetch wet data on temperature by using the wet2d tool.";

  export const POST = async (req: Request) => {
    const body = await req.json();
    console.log("Corpo della richiesta ricevuta:", body);
  
    const { messages }: { messages: Message[] } = body;
    console.log("Messaggi estratti:", messages);
  
    if (!messages || !Array.isArray(messages)) {
      console.error("Errore: 'messages' non è un array valido!", messages);
      return new Response(JSON.stringify({ error: "Formato messaggi non valido" }), { status: 400 });
    }
  
    const wetDataQuery = messages.find((message) => message.content.includes("temperatura"));
    console.log("Messaggio che richiede temperatura:", wetDataQuery);
  
    if (wetDataQuery) {
      const dates = extractDatesFromMessage(wetDataQuery.content); // Estrai le date dal messaggio
      
      if (dates) {
        const { start, end } = dates;
        
        if (start && end) {
          // Chiama la funzione per recuperare i dati meteo
          const temperatureData = await fetchWetData(start, end);
          
          console.log("Dati temperatura ricevuti:", temperatureData);
          
          // Controlla se i dati sono validi
          if (
            typeof temperatureData === "object" &&
            temperatureData.min_temperature !== undefined &&
            temperatureData.max_temperature !== undefined
          ) {
            const responseContent = `La temperatura minima dal ${start} al ${end} è di ${temperatureData.min_temperature}°C, mentre la temperatura massima è di ${temperatureData.max_temperature}°C.`;
            return new Response(
              JSON.stringify({
                messages: [
                  {
                    role: "assistant",
                    content: responseContent,
                  },
                ],
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          } else {
            console.error("Errore nei dati di temperatura:", temperatureData);
            return new Response(
              JSON.stringify({
                messages: [
                  {
                    role: "assistant",
                    content: "Si è verificato un errore nel recupero dei dati meteo. Riprova più tardi.",
                  },
                ],
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
        } else {
          console.error("Date trovate ma non valide:", dates);
          return new Response(
            JSON.stringify({ messages: [{ role: "assistant", content: "Non sono stati trovati parametri validi per data." }] }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      } else {
        console.error("Nessuna data trovata nel messaggio.");
        return new Response(
          JSON.stringify({ messages: [{ role: "assistant", content: "Date non trovate nel messaggio." }] }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
  
    // Se non ci sono richieste meteo, continua con il comportamento predefinito dell'AI
    const result = await streamText({
      model,
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
    });
  
    return result.toDataStreamResponse();
  };
  
  function extractDatesFromMessage(message: string) {
    console.log("Tentativo di estrazione date dal messaggio:", message);
  
    const regex = /(?:dal|from)\s*(\d{4}-\d{2}-\d{2})\s*(?:al|to)\s*(\d{4}-\d{2}-\d{2})/i;
    const match = message.match(regex);
  
    if (match) {
      console.log("Date trovate:", { start: match[1], end: match[2] });
      return { start: match[1], end: match[2] };
    }
  
    console.error("Nessun match per le date trovato nel messaggio:", message);
    return null;
  }
  