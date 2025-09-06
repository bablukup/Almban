// src/pages/HomePage.jsx
import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { Heart, Sparkles } from "lucide-react";

const HomePage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello Bablu! I'm Āḷmban, your emotional support companion. How are you feeling today? 💙",
      timestamp: new Date(),
      emotion: "calm",
    },
  ]);

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      text: messageText,
      timestamp: new Date(),
      emotion: "neutral",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simple AI response (you can connect to your API later)
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        text: "I understand how you're feeling. Would you like to talk more about it?",
        timestamp: new Date(),
        emotion: "calm",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Welcome Header - Only show if no messages */}
        {messages.length === 1 && (
          <div className="flex-shrink-0 text-center py-12 px-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-[#1F2937] mb-3">
              Good afternoon, Bablu
            </h1>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              I'm here to listen and support you through whatever you're
              feeling. Share your thoughts, emotions, or just say hello.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors border border-green-200">
                😊 I'm feeling good
              </button>
              <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200">
                😌 I'm calm
              </button>
              <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-200">
                😔 I'm sad
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                💭 Just want to chat
              </button>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow messages={messages} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
