// src/components/ChatWindow.jsx
import React from "react";
import ChatBubble from "./ChatBubble";
import MessageList from "./MessageList";

const ChatWindow = ({ messages = [] }) => {
  return (
    <div className="h-full overflow-y-auto px-6 py-4">
      <MessageList messages={messages} />
    </div>
  );
};

export default ChatWindow;
