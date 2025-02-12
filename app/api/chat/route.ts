import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import indexAPI from "@/app/tools/index_wet_new";
import indexAPIold from "@/app/tools/index_wet_old";

const model = openai("gpt-4o-mini");

// Prompt iniziale per il modello col suo comportamento
const systemPrompt = 
  "You are a friendly CLI interface with tools to fetch wet data on temperature. Use the tools indexAPI and indexAPIold to analyze wet data from different sources.";

  export const POST = async (req: Request) => {
    try {
      const body = await req.json();
      if (!body.messages) {
        return new Response(JSON.stringify({ error: "Missing messages in request" }), { status: 400 });
      }
  
      // Esecuzione della risposta tramite streamTex
      const result = await streamText({
        model,
        system: systemPrompt,
        messages: convertToCoreMessages(body.messages),
        tools: { indexAPIold }, // Inserire indexAPI per la risposta basata sul json nuovo 
        maxSteps: 3,
      });
  
      //Se l'elaborazione è riuscita, la risposta viene trasformata in un flusso di dati
      return result.toDataStreamResponse();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
  };
  