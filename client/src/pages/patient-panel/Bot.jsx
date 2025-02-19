import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  console.log(API_KEY)  
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse((messages) => [...messages, `You: ${message}`]); // Add user message first
    setMessage(""); // Clear the input field immediately

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(message);
      const text =  result.response.text(); // Await the response text

      setResponse((messages) => [...messages, `AI: ${text || "No response"}`]);
    } catch (error) {
      console.error("Error:", error);
      setResponse((messages) => [...messages, "Error communicating with AI."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-xl border border-gray-300 flex flex-col">
          <div className="flex justify-between items-center bg-green-600 text-white px-4 py-3 rounded-t-xl">
            <h2 className="text-lg font-semibold">Chat with us</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-gray-600 text-sm">
              <p className="bg-gray-100 p-2 rounded-lg mb-2">
                Hello! How can I assist you today?
              </p>
              {loading && <p className="text-gray-500">Thinking...</p>}
              {response.map((value, index) => {
                // Check if the message is from the user or AI
                const isUserMessage = value.startsWith("You:");
                return (
                  <p
                    key={index}
                    className={`p-2 rounded-lg mt-2 ${
                      isUserMessage ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {value}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-gray-300 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  handleSendMessage()
                }
              }}
              placeholder="Type your message..."
              className="flex-1 border rounded-full p-2 text-sm outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
