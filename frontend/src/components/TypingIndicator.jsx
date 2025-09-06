// src/components/TypingIndicator.jsx
import React from "react";
import { Heart } from "lucide-react";

const TypingIndicator = ({
  showAvatar = true,
  message = "Āḷmban is thinking...",
}) => {
  return (
    <div className="flex items-start gap-4 mb-6 animate-fade-in">
      {/* AI Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
          <Heart className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Typing Container */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-[#1F2937]">Āḷmban</span>
          <span className="text-xs text-gray-400 italic">{message}</span>
        </div>

        {/* Typing Bubble */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/30 rounded-2xl rounded-tl-md p-4 shadow-md w-fit">
          {/* 3 Bouncing Dots */}
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms", animationDuration: "1.4s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "200ms", animationDuration: "1.4s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "400ms", animationDuration: "1.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
