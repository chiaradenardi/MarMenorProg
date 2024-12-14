import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { fetchWetData } from "@/app/utils/fetchWet2d";  

interface Message {
  content: string;
  role: "user" | "system" | "assistant";
  id: string;
}

const model = openai("gpt-4o-mini");
const systemPrompt = 
"You are a friendly CLI interface with some tools up your sleeve. You can fetch wet data on temperature by using the wet2d tool."
;

export const POST = async (req: Request) => {
  console.log("Richiesta ricevuta!"); // Log per confermare che la richiesta è arrivata

  const { messages }: { messages: Message[] } = await req.json();  // Aggiungi il tipo per messages
  console.log("Messaggi ricevuti:", messages); // Log per vedere il contenuto dei messaggi ricevuti

  // Cerca se il messaggio contiene una richiesta di dati meteo
  const wetDataQuery = messages.find((message) => message.content.includes("wet data"));
  console.log("Controllo per richiesta dati meteo:", wetDataQuery);  // Log per vedere se è stata trovata una richiesta

  if (wetDataQuery) {
    console.log("Richiesta di dati meteo:", wetDataQuery.content);
    const dates = extractDatesFromMessage(wetDataQuery.content);
    
    if (dates) {
      try {
        const data = await fetchWetData(dates.start, dates.end);
  
        // Serializzazione degli oggetti nella risposta
        const serializedData = {
          ...data,
          wet2d: {
            ...data.wet2d,
            data: data.wet2d.data.map((item: any) => JSON.stringify(item)) // Converti ogni elemento in stringa
          }
        };
  
        console.log("Dati meteo serializzati:", serializedData);
        return new Response(JSON.stringify({ data: serializedData }), { status: 200 });
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        return new Response(JSON.stringify({ error: "Non sono riuscito a recuperare i dati meteo." }), { status: 500 });
      }
    } else {
      return new Response(JSON.stringify({ error: "Non sono riuscito a capire le date richieste." }), { status: 400 });
    }
  }

  // Se non c'è richiesta di dati meteo, continua con la gestione standard del modello AI
  console.log("Nessuna richiesta meteo, procedo con la risposta AI...");

  // Utilizzo di streamText per ottenere la risposta finale
  const result = await streamText({
    model,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  console.log("Messaggi convertiti per AI:", convertToCoreMessages(messages));  // Log per vedere i messaggi convertiti

  // Log della risposta finale
  console.log("Risultato finale della risposta:", result);

  // Restituzione della risposta come stream
  return result.toDataStreamResponse();
};


// Funzione per estrarre le date dalla richiesta dell'utente (esempio: "from 2024-01-01 to 2024-01-02")
function extractDatesFromMessage(message: string) {
  console.log("Estrazione date dal messaggio:", message);  // Log per vedere il messaggio in entrata
  const regex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;
  const match = message.match(regex);

  if (match) {
    console.log("Match trovato:", match);  // Log per vedere se il match è stato trovato
    return { start: match[1], end: match[2] };
  }

  console.log("Nessun match trovato.");  // Log nel caso non venga trovato nulla
  return null;
}