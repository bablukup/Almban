// src/components/ChatInput.jsx
import React, { useState } from "react";
import { Send, Smile } from "lucide-react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-white rounded-2xl shadow-md border border-gray-200/50 p-4">
          {/* Emotion Button */}
          <button
            type="button"
            className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          {/* Input Field */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How are you feeling today? Share your thoughts..."
            className="flex-1 resize-none border-none outline-none bg-transparent text-[#1F2937] placeholder-gray-500 min-h-[24px] max-h-32"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
