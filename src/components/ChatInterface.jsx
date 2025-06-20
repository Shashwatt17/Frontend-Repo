import React, { useState } from "react";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("https://betternutrition-chatbot.onrender.com/chat", {
        message: trimmedInput,
      });

      const botMessage = {
        role: "bot",
        content: res.data.reply || "🤖 No reply received.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Unable to reach the server. Please try again later." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 mb-2 bg-white rounded shadow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded w-fit max-w-[75%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-green-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 rounded-l border border-gray-300"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
