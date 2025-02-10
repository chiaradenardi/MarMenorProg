import { openai } from "@ai-sdk/openai"; 
import { convertToCoreMessages, streamText } from "ai"; 
import { fetchWetData } from "@/app/utils/fetchWet2d"; 

//definisce la struttura di un messaggio
interface Message {
  content: string; //contenuto del messaggio
  role: "user" | "system" | "assistant"; //ruolo del messaggio (utente, sistema, assistente)
  id: string; //ID univoco del messaggio
}

const model = openai("gpt-4o-mini");

//prompt iniziale per il modello col suo comportamento
const systemPrompt = 
  "You are a friendly CLI interface with some tools up your sleeve. You can fetch wet data on temperature by using the wet2d tool.";

export const POST = async (req: Request) => {
  console.log("Richiesta ricevuta!"); 

  //parsing del corpo della richiesta per ottenere i messaggi
  const { messages }: { messages: Message[] } = await req.json(); //parsing del JSON in arrivo
  console.log("Messaggi ricevuti:", messages); 

  //controllo se uno dei messaggi contiene una richiesta di dati meteo
  const wetDataQuery = messages.find((message) => message.content.includes("wet data"));
  console.log("Controllo per richiesta dati meteo:", wetDataQuery); 

  if (wetDataQuery) {
    console.log("Richiesta di dati meteo:", wetDataQuery.content); 

    //estrazione delle date dalla richiesta
    const dates = extractDatesFromMessage(wetDataQuery.content);
    
    if (dates) {
      try {
        //recupero dei dati meteo utilizzando le date estratte
        const data = await fetchWetData(dates.start, dates.end);

        //serializzazione dei dati meteo per garantire la corretta restituzione
        const serializedData = {
          ...data,
          wet2d: {
            ...data.wet2d,
            data: data.wet2d.data.map((item: any) => JSON.stringify(item)) //conversione degli elementi in stringhe
          }
        };

        console.log("Dati meteo serializzati:", serializedData); 
        return new Response(JSON.stringify({ data: serializedData }), { status: 200 }); //restituzione dei dati meteo
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error); 
        return new Response(JSON.stringify({ error: "Non sono riuscito a recuperare i dati meteo." }), { status: 500 });
      }
    } else {
      //rrrore se le date non possono essere estratte
      return new Response(JSON.stringify({ error: "Non sono riuscito a capire le date richieste." }), { status: 400 });
    }
  }

  //caso in cui non ci sia una richiesta di dati meteo: continua con la gestione standard
  console.log("Nessuna richiesta meteo, procedo con la risposta AI...");

  //converti i messaggi in un formato accettato dal modello AI
  const result = await streamText({
    model, //modello da utilizzare
    system: systemPrompt, //prompt iniziale
    messages: convertToCoreMessages(messages), //conversione dei messaggi in formato standard
  });

  console.log("Messaggi convertiti per AI:", convertToCoreMessages(messages)); 
  console.log("Risultato finale della risposta:", result); 

  //restituzione della risposta come stream per il frontend
  return result.toDataStreamResponse();
};

//funzione per estrarre le date da una richiesta testuale
function extractDatesFromMessage(message: string) {
  console.log("Estrazione date dal messaggio:", message); 

  //regex per trovare le date nel formato "from YYYY-MM-DD to YYYY-MM-DD"
  const regex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;
  const match = message.match(regex); //ricerca del pattern nel messaggio

  if (match) {
    console.log("Match trovato:", match); 
    return { start: match[1], end: match[2] }; //restituzione delle date estratte
  }

  console.log("Nessun match trovato."); 
  return null; 
}
