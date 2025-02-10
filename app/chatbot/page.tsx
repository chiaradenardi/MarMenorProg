"use client";

import { useChat } from "ai/react";
import { FC, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ChatPage: FC = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    if (error) {
      console.error("Errore nella chat:", error.message || error);
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen">
      {/* MAIN CHAT */}
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="max-w-2xl w-full">
          {/* SUGGERIMENTI */}
          <div className="flex justify-center space-x-2 mb-4">
            <button className="border rounded-full px-4 py-2 text-gray-700">
              “What was the temperature in the lagoon yesterday?” →
            </button>
            <button className="border rounded-full px-4 py-2 text-gray-700">
              “Create a graph using the lagoon’s temperature data” →
            </button>
          </div>

          {/* AREA MESSAGGI */}
          <div className="h-80 overflow-y-auto bg-white p-4 border rounded-lg shadow-sm">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} isLoading={isLoading && index === messages.length - 1} />
            ))}
          </div>

          {/* INPUT + PULSANTE */}
          <form onSubmit={handleSubmit} className="flex mt-4 bg-white border rounded-lg shadow-sm">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow px-4 py-2 border-none outline-none"
              placeholder="Send a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg shadow-md transition"
              disabled={isLoading}
            >
              {isLoading ? "..." : "Submit"}
            </button>
          </form>
        </div>
      </main>

    </div>
  );
};

/**
 * Componente per visualizzare un messaggio nella chat
 */
const ChatMessage: FC<{ message: any; isLoading: boolean }> = ({ message, isLoading }) => {
  if (message.role === "assistant" && message.data?.wet2d) {
    const { wet2d } = message.data;

    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-2">
        <h3 className="text-lg font-semibold">Weather Data</h3>
        <p>Unit: {wet2d.unit}</p>
        <p>Forecast Date: {wet2d.forecastDate}</p>
        <div>
          {wet2d.data.map((entry: any, index: number) => (
            <div key={index} className="my-2">
              <p><strong>Time:</strong> {entry.time}</p>
              {entry.values.map((v: any, idx: number) => (
                <p key={idx}>
                  Depth: {v.z}, Value: {v.value}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} my-2`}>
      <div className={`px-4 py-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
        {isLoading && message.role === "assistant" ? "Fetching data..." : message.content}
      </div>
    </div>
  );
};

export default ChatPage;
