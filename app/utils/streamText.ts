//File: app/api/utils/streamText.ts

/**
 * Funzione per inviare messaggi al modello OpenAI tramite l'API e ricevere risposte in streaming.
 * 
 * @param {any[]} messages - Array di messaggi da inviare all'API OpenAI, formattati come richiesto dall'endpoint.
 * @returns {Promise<Response>} - Restituisce una `Response` contenente lo stream della risposta generata dal modello.
 */
export async function streamText(messages: any[]): Promise<Response> {
    try {
        console.log("Messaggi per streamText:", messages);

        //invio della richiesta all'API OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST', //metodo HTTP per la creazione di una risorsa
            headers: {
                'Content-Type': 'application/json', //tipo di contenuto della richiesta
                Authorization: `Bearer YOUR_OPENAI_API_KEY`, //autenticazione tramite chiave API
            },
            body: JSON.stringify({
                model: 'gpt-4', //modello OpenAI da utilizzare 
                messages,       //array di messaggi come corpo della richiesta
                stream: true,   //abilita lo streaming della risposta
            }),
        });

        //verifica se la risposta non è valida
        if (!response.ok) {
            throw new Error(`Errore durante la chiamata a OpenAI: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error("Errore durante streamText:", error);
        throw error; 
    }
}
