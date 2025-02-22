import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import indexAPI from "@/app/datarange_tools/index_wet_new";
import indexAPIold from "@/app/datarange_tools/index_wet_old";
import depthold from "@/app/depth_tools/index_depth_old";
import depthnew from "@/app/depth_tools/index_depth_new";

const model = openai("gpt-4o-mini");

// Prompt iniziale per il modello col suo comportamento
const systemPrompt = `
You are a friendly CLI interface with tools to fetch wet data on temperature. 
Avoid using markdown formatting in the responses and go to a new line when necessary. 
Use the tools indexAPI, indexAPIold, index_depth_new and index_depth_old to analyze wet data from different sources.
`;

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
        tools: { indexAPIold, depthold}, // Si può cambiare mettendo i due tools basati sul json nuovo
        maxSteps: 3,
      });
  
      //Se l'elaborazione è riuscita, la risposta viene trasformata in un flusso di dati
      return result.toDataStreamResponse();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
  };
  