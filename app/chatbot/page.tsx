"use client"
import { useChat } from "ai/react";
import { FC, useEffect } from "react";

// Componenti per mostrare i risultati dei tools
const WeatherDataCard: FC<{ data: any }> = ({ data }) => (
  <div className="bg-blue-100 p-4 rounded-lg my-2">
    <strong>Dati meteo attuali usando il json nuovo:</strong>
  </div>
);

const WeatherHistoryCard: FC<{ data: any }> = ({ data }) => (
  <div className="bg-gray-100 p-4 rounded-lg my-2">
    <strong>Dati meteo attuali usando il json vecchio:</strong>
  </div>
);

// Componente principale della chat
const ChatPage: FC = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();

  useEffect(() => {
    console.log("Messaggi ricevuti dall'API:", messages);
    if (error) {
      console.error("Errore nella chat:", error);
    }
  }, [messages, error]);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-2xl w-full">
          <div className="h-80 overflow-y-auto bg-white p-4 border rounded-lg shadow-sm">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  isLoading={isLoading && index === messages.length - 1}
                />
              ))
            ) : (
              <div className="text-gray-400">Nessun messaggio disponibile</div>
            )}
          </div>

          {/* Form per l'input dell'utente */}
          <form onSubmit={handleSubmit} className="flex mt-4 bg-white border rounded-lg shadow-sm">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow px-4 py-2 border-none outline-none"
              placeholder="Chiedi la temperatura..."
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
