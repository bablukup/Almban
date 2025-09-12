import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const { conversationId } = useParams();

  // Load conversation messages
  const loadConversationMessages = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/messages/session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success && data.data) {
        const formattedMessages = data.data.map((msg) => ({
          id: msg._id,
          type: "user",
          text: msg.text,
          timestamp: msg.timestamp,
          emotion: msg.emotionId?.emotion || "neutral",
        }));

        setMessages(formattedMessages);
        setShowWelcome(false); // old conversation → don't show welcome
      }
    } catch (error) {
      console.error("Failed to load conversation messages:", error);
    }
  };

  // Detect conversation change
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setCurrentSessionId(null);
      setShowWelcome(true);
      return;
    }

    if (conversationId === currentSessionId) {
      return;
    }

    console.log("🔄 Conversation changed:", conversationId);
    setCurrentSessionId(conversationId);

    // If new conversation → only show welcome screen
    if (conversationId.startsWith("new-")) {
      setMessages([]);
      setShowWelcome(true);
    } else {
      // Old conversation → load from backend
      loadConversationMessages(conversationId);
    }
  }, [conversationId, currentSessionId]);

  // Message handler
  const handleSendMessage = (messageData) => {
    console.log("📨 Received message data:", messageData);

    if (showWelcome) {
      setShowWelcome(false);
    }

    const userMessage = {
      id: Date.now() + "_user",
      type: "user",
      text: messageData.userMessage,
      timestamp: messageData.timestamp,
      emotion:
        messageData.backendResponse?.emotion ||
        messageData.emotion ||
        "neutral",
    };

    setMessages((prev) => [...prev, userMessage]);

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

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
      }, 500);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* WelcomeScreen - only visible when showWelcome is true */}
        {showWelcome && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <WelcomeScreen userName="Bablu" onQuickAction={handleSendMessage} />
          </div>
        )}

        {/* ChatWindow - visible only when messages exist */}
        {!showWelcome && messages.length > 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <ChatWindow messages={messages} />
          </div>
        )}

        {/* ChatInput - always visible */}
        <div className="flex-shrink-0 bg-white">
          <ChatInput
            onSendMessage={handleSendMessage}
            currentSessionId={conversationId}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
