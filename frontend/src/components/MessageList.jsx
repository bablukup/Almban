// src/components/MessageList.jsx
import React, { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";

const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="italic">Your conversation will appear here...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: "both",
          }}
        >
          <ChatBubble
            message={message.text}
            isAI={message.type === "ai"}
            emotion={message.emotion}
            timestamp={message.timestamp}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
