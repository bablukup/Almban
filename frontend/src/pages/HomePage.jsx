import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";
import { Heart, Sparkles } from "lucide-react";

const HomePage = () => {
  const [messages, setMessages] = useState([]);

  // ===================== MESSAGE HANDLER =====================
  const handleSendMessage = (messageData) => {
    console.log("📨 Received message data:", messageData);

    // Extract user message
    const userMessage = {
      id: Date.now() + "_user",
      type: "user",
      text: messageData.userMessage,
      timestamp: messageData.timestamp,
      // ✅ Use backend emotion instead of hardcoded "neutral"
      emotion:
        messageData.backendResponse?.emotion ||
        messageData.emotion ||
        "neutral",
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    // Handle AI response from backend
    if (messageData.backendResponse) {
      const aiMessage = {
        id: Date.now() + "_ai",
        type: "ai",
        text:
          messageData.backendResponse.response ||
          messageData.backendResponse.text ||
          messageData.backendResponse.message ||
          "I received your message!",
        timestamp: new Date().toISOString(),
        emotion: messageData.backendResponse.emotion || "calm",
      };

      // Add AI response after a short delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
      }, 500);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* WelcomeScreen - Show when no messages */}
        {messages.length === 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <WelcomeScreen userName="Bablu" onQuickAction={handleSendMessage} />
          </div>
        )}

        {/* Chat Area - Show when messages exist */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <ChatWindow messages={messages} />
          </div>
        )}

        {/* Chat Input - Always show */}
        <div className="flex-shrink-0 bg-white">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
