"use client"
import { useChat } from "ai/react";
import { FC, useEffect, useState } from "react";

// Componenti per mostrare i risultati dei tools per range date
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

// Card per i dati meteo filtrati per profondità
const WeatherDataByDepthCardOld: FC<{ data: any }> = ({ data }) => (
  <div className="bg-green-100 p-4 rounded-lg my-2">
    <strong>Dati meteo filtrati per profondità usando il json vecchio:</strong>
  </div>
);

const WeatherDataByDepthCardNew: FC<{ data: any }> = ({ data }) => (
  <div className="bg-purple-100 p-4 rounded-lg my-2">
    <strong>Dati meteo filtrati per profondità usando il json nuovo:</strong>
  </div>
);


// Componente principale della chat
const ChatPage: FC = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat();
  const [showIcon, setShowIcon] = useState(true); // Mostra il fulmine all'inizio

  useEffect(() => {
    console.log("Messaggi ricevuti dall'API:", messages);
    if (error) {
      console.error("Errore nella chat:", error);
    }
    setShowIcon(messages.length === 0);
  }, [messages, error]);

  // Funzione per gestire il click sul suggerimento di domanda
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion); // Imposta la domanda suggerita come input
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full space-y-4">
          {/* Finestra della chat */}
          <div className="h-[500px] overflow-y-auto bg-white p-6 border rounded-lg shadow-lg relative">
            {messages && messages.length > 0 &&
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isLoading={isLoading && index === messages.length - 1}
                />
              ))
            }
            {/* Icona di sfondo (fulmine) */}
            {showIcon && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 pointer-events-none transition-opacity duration-700 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 32"
                  fill="#E5E7EB"
                  stroke="#D1D5DB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-48 h-64 opacity-50 drop-shadow-lg blur-[2px] transform scale-y-125"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
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
          <form onSubmit={handleSubmit} className="flex items-center justify-center mt-2 space-x-4">
            {/* Label con testo descrittivo per l'input */}
            <label htmlFor="userInput" className="text-lg font-medium text-gray-700">
            </label>
            <input
              id="userInput"
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full px-6 py-3 rounded-full border border-gray-300 outline-none text-lg shadow-sm"
              placeholder="Fai una domanda..."
              aria-label="Fai una domanda..."
              title="Inserisci la tua domanda riguardo il meteo" // Optional title for accessibility
            />
            {/* Bottone separato e arrotondato */}
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition"
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
          if (toolName === "depthnew") return <WeatherDataByDepthCardNew key={toolCallId} data={result} />;
          if (toolName === "depthold") return <WeatherDataByDepthCardOld key={toolCallId} data={result} />;
          return <div key={toolCallId}>Tool sconosciuto: {toolName}</div>;
        } else {
          return <div key={toolCallId}>Elaborazione in corso...</div>;
        }
      })}
    </>
  );
};

export default ChatPage;
