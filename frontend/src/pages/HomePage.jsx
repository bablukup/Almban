import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { Heart, Sparkles } from "lucide-react";

const HomePage = () => {
  const [messages, setMessages] = useState([]);

  // FIXED: Handle the complex object from ChatInput
  const handleSendMessage = (messageData) => {
    console.log("📨 Received message data:", messageData);

    // Extract user message
    const userMessage = {
      id: Date.now() + "_user",
      type: "user",
      text: messageData.userMessage,
      timestamp: messageData.timestamp,
      emotion: "neutral", // You can enhance this later
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

  // Quick action button handler with AI responses
  const handleQuickAction = (emotion, text) => {
    // User message add
    const userMessage = {
      id: Date.now() + "_quick_user",
      type: "user",
      text: text,
      timestamp: new Date().toISOString(),
      emotion: emotion,
    };

    setMessages((prev) => [...prev, userMessage]);

    // AI response based on emotion
    setTimeout(() => {
      let aiResponseText = "";

      switch (emotion) {
        case "happy":
          aiResponseText =
            "That's wonderful! I'm so glad you're feeling good today. What's making you feel happy? I'd love to hear about it!";
          break;
        case "calm":
          aiResponseText =
            "It's great that you're feeling calm. Inner peace is so valuable. Would you like to talk about what's helping you feel this way?";
          break;
        case "sad":
          aiResponseText =
            "I'm here for you. It's okay to feel sad sometimes. Would you like to share what's on your mind? I'm listening.";
          break;
        default:
          aiResponseText =
            "Hello! I'm here to listen and support you. What would you like to talk about today?";
      }

      const aiResponse = {
        id: Date.now() + "_quick_ai",
        type: "ai",
        text: aiResponseText,
        timestamp: new Date().toISOString(),
        emotion: "calm",
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Welcome Header - Show when no messages */}
        {messages.length === 0 && (
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
              <button
                onClick={() =>
                  handleQuickAction("happy", "I'm feeling good today!")
                }
                className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors border border-green-200"
              >
                😊 I'm feeling good
              </button>
              <button
                onClick={() =>
                  handleQuickAction("calm", "I'm feeling calm and peaceful.")
                }
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
              >
                😌 I'm calm
              </button>
              <button
                onClick={() =>
                  handleQuickAction("sad", "I'm feeling a bit sad today.")
                }
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-200"
              >
                😔 I'm sad
              </button>
              <button
                onClick={() =>
                  handleQuickAction(
                    "neutral",
                    "Hi! I just want to chat with you."
                  )
                }
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
              >
                💭 Just want to chat
              </button>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <ChatWindow messages={messages} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 bg-white">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
