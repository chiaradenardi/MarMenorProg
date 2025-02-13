"use client"
import { useChat } from "ai/react";
import { FC, useEffect } from "react";

// Componenti per mostrare i risultati dei tools
const WeatherDataCard: FC<{ data: any }> = ({ data }) => (
  <div className="bg-blue-100 p-4 rounded-lg my-2">
    <strong>Dati meteo attuali usando il json nuovo filtrato per range di date:</strong>
  </div>
);

const WeatherHistoryCard: FC<{ data: any }> = ({ data }) => (
  <div className="bg-gray-100 p-4 rounded-lg my-2">
    <strong>Dati meteo attuali usando il json vecchio filtrato per range di date:</strong>
  </div>
);

// Componente principale della chat
const ChatPage: FC = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat();

  useEffect(() => {
    console.log("Messaggi ricevuti dall'API:", messages);
    if (error) {
      console.error("Errore nella chat:", error);
    }
  }, [messages, error]);

  // Funzione per gestire il click sul suggerimento di domanda
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);  // Imposta la domanda suggerita come input
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full space-y-4">
          {/* Finestra della chat */}
          <div className="h-[500px] overflow-y-auto bg-white p-6 border rounded-lg shadow-lg">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isLoading={isLoading && index === messages.length - 1}
                />
              ))
            ) : (
              <div></div>
            )}
          </div>

          {/* Suggerimento domanda stilizzato */}
          <div className="text-center text-sm text-gray-600 italic mb-4">
            <p>
              <span className="text-gray-500">Es. Chiedi: </span>
              <span
                className="inline-block bg-blue-100 text-blue-600 px-6 py-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-200 hover:shadow-xl transition duration-300 ease-in-out"
                onClick={() => handleSuggestionClick("Qual è la temperatura massima della laguna il 20-10-2024?")}
              >
                "Qual è la temperatura massima della laguna il 20-10-2024?"
              </span>
            </p>
          </div>

          {/* Form per l'input dell'utente */}
          <form onSubmit={handleSubmit} className="flex bg-white border rounded-lg shadow-md">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow px-6 py-3 rounded-lg border-none outline-none text-lg"
              placeholder="Fai una domanda..."
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg shadow-md transition"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Invia"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

// ChatMessage gestisce ogni messaggio della chat
const ChatMessage: FC<{ message: any; isLoading: boolean }> = ({ message, isLoading }) => {
  if (message.toolInvocations) {
    return <ToolMessageContent message={message} />;
  }

  if (message.role === "assistant") {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-2">
        <strong>Assistente:</strong> {isLoading ? "Sto elaborando..." : message.content}
      </div>
    );
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`px-4 py-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
      >
        {message.content}
      </div>
    </div>
  );
};

// Gestisce i messaggi che provengono dai tools
const ToolMessageContent: FC<{ message: any }> = ({ message }) => {
  return (
    <>
      {message.toolInvocations?.map((toolInvocation: any) => {
        const { toolName, toolCallId, state, result } = toolInvocation;

        if (state === "result") {
          if (toolName === "indexAPI") return <WeatherDataCard key={toolCallId} data={result} />;
          if (toolName === "indexAPIold") return <WeatherHistoryCard key={toolCallId} data={result} />;
          return <div key={toolCallId}>Tool sconosciuto: {toolName}</div>;
        } else {
          return <div key={toolCallId}>Elaborazione in corso...</div>;
        }
      })}
    </>
  );
};

export default ChatPage;
