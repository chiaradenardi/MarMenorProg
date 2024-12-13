import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { fetchWetData } from "@/app/utils/fetchWet2d";  

interface Message {
  content: string;
  role: "user" | "system" | "assistant";
  id: string;
}

const model = openai("gpt-4o-mini");
const systemPrompt = `
You are a friendly CLI interface with some tools up your sleeve. You can fetch wet data on temperature by using the wet2d tool.
`;

export const POST = async (req: Request) => {
  const { messages }: { messages: Message[] } = await req.json();  // Aggiungi il tipo per `messages`

  // Cerca se il messaggio contiene una richiesta di dati meteo
  const wetDataQuery = messages.find((message) => message.content.includes("wet data"));

  if (wetDataQuery) {
    console.log("Richiesta di dati meteo:", wetDataQuery.content);  // Log per controllare il contenuto del messaggio
    const dates = extractDatesFromMessage(wetDataQuery.content);
    console.log("Date estratte:", dates);  // Verifica se le date vengono estratte correttamente
  
  if (dates) {
    try {
      const data = await fetchWetData(dates.start, dates.end);
      console.log("Dati meteo ricevuti:", data);  // Log per vedere i dati restituiti dall'API
      return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      return new Response(JSON.stringify({ error: "Non sono riuscito a recuperare i dati meteo." }), { status: 500 });
    }
  }
}

  // Se non c'è richiesta di dati meteo, continua con la gestione standard del modello AI
  const result = await streamText({
    model,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
};

// Funzione per estrarre le date dalla richiesta dell'utente (esempio: "from 2024-01-01 to 2024-01-02")
function extractDatesFromMessage(message: string) {
  const regex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;
  const match = message.match(regex);
  if (match) {
    return { start: match[1], end: match[2] };
  }
  return null;
}
