"use client";

import { useChat } from "ai/react";
import { FC, useEffect } from "react";

const ChatPage: FC = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    if (error) {
      console.error("Errore nella chat:", error.message || error);
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-500 text-white py-4 text-center">
        <h1 className="text-2xl font-bold">Chatbot</h1>
      </header>

      <main className="grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} isLoading={isLoading && index === messages.length - 1} />
        ))}
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 border rounded-md"
            placeholder="Scrivi il tuo messaggio..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Inviando..." : "Invia"}
          </button>
        </form>
      </footer>
    </div>
  );
};

const ChatMessage: FC<{ message: any; isLoading: boolean }> = ({ message, isLoading }) => {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`px-4 py-2 rounded-lg ${
          message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {isLoading && message.role === "assistant"
          ? "Sto recuperando i dati..."
          : message.content}
      </div>
    </div>
  );
};




export default ChatPage;
