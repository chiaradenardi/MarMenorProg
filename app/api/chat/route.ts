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
    const body = await req.json(); //Il corpo della richiesta viene letto come JSON
    console.log("Corpo della richiesta ricevuta:", body);
  
    const { messages }: { messages: Message[] } = body;
    console.log("Messaggi estratti:", messages);
  
    //Controlla se la proprietà messages esiste e se è un array;
    // Se non lo è, viene restituita una risposta con errore (400 Bad Request) dicendo che il formato dei messaggi non è valido
    if (!messages || !Array.isArray(messages)) {
      console.error("Errore: 'messages' non è un array valido!", messages);
      return new Response(JSON.stringify({ error: "Formato messaggi non valido" }), { status: 400 });
    }
  
    //Fa una ricerca di un messaggio che contenga la parola "temperatura"
    //Se viene trovato, quel messaggio viene salvato in wetDataQuery
    const wetDataQuery = messages.find((message) => message.content.includes("temperatura"));
    console.log("Messaggio che richiede temperatura:", wetDataQuery);
  
    if (wetDataQuery) {
      const dates = extractDatesFromMessage(wetDataQuery.content); // Estrai le date dal messaggio
      
      if (dates) {
        const { start, end } = dates;
        
        if (start && end) {
          //Se le date sono valide, la funzione fetchWetData viene chiamata per recuperare i dati meteo relativi a quelle date.
          const temperatureData = await fetchWetData(start, end);
          console.log("Dati temperatura ricevuti:", temperatureData);
          
          /**
           * I dati di temperatura vengono controllati:
            Se i dati sono corretti (è un oggetto e contiene min_temperature e max_temperature), viene preparata una risposta con i dati (minima e massima) e viene restituita una risposta 200 OK.
            Se i dati sono errati, viene restituito un errore (400 Bad Request) con un messaggio di errore generico.
           */
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
          //Se non vengono trovate date valide o non c'è nessuna data nel messaggio, 
          // viene restituito un errore con un messaggio che indica il problema.
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
    
  
    // Se non ci sono richieste meteo, continua con il comportamento predefinito dell'AI  tramite la funzione streamText
    const result = await streamText({
      model,
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
    });
  
    return result.toDataStreamResponse();
  };
  
  // Usa una regex per cercare nel messaggio delle date nel formato "YYYY-MM-DD"
  // Se trova un match, restituisce un oggetto con le date di inizio e fine; altrimenti, restituisce null.
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
  