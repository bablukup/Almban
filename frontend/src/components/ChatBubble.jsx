// src/components/ChatBubble.jsx
import React from "react";
import { Heart, User, Clock } from "lucide-react";
import EmotionIndicator from "./EmotionIndicator";

const ChatBubble = ({
  message,
  isAI = false,
  emotion = "neutral",
  timestamp,
}) => {
  const getEmotionStyles = (emotionType) => {
    const emotions = {
      happy: {
        color: "#34D399",
        bg: "from-green-100 to-green-50",
        border: "border-green-200",
      },
      calm: {
        color: "#3B82F6",
        bg: "from-blue-100 to-blue-50",
        border: "border-blue-200",
      },
      sad: {
        color: "#8B5CF6",
        bg: "from-purple-100 to-purple-50",
        border: "border-purple-200",
      },
      neutral: {
        color: "#6B7280",
        bg: "from-gray-100 to-gray-50",
        border: "border-gray-200",
      },
    };
    return emotions[emotionType] || emotions.neutral;
  };

  const emotionStyle = getEmotionStyles(emotion);
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (isAI) {
    return (
      <div className="flex items-start gap-4 mb-6">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
          <Heart className="w-5 h-5 text-white" />
        </div>

        {/* AI Message */}
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-[#1F2937]">Āḷmban</span>
            <EmotionIndicator emotion={emotion} size="sm" />
            {timestamp && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </span>
            )}
          </div>

          <div
            className={`bg-gradient-to-r ${emotionStyle.bg} ${emotionStyle.border} border rounded-2xl rounded-tl-md p-4 shadow-md hover:shadow-lg transition-shadow`}
          >
            <p className="text-[#1F2937] leading-relaxed">{message}</p>
          </div>

          {/* Emotion label */}
          <div className="flex items-center gap-2 mt-2 ml-2">
            <span
              className="text-xs italic font-light px-2 py-1 rounded-full"
              style={{
                color: emotionStyle.color,
                backgroundColor: emotionStyle.color + "20",
              }}
            >
              feeling {emotion}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className="flex items-start gap-4 mb-6 flex-row-reverse">
      {/* User Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-md">
        <User className="w-5 h-5 text-white" />
      </div>

      {/* User Message */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-2 justify-end">
          {timestamp && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedTime}
            </span>
          )}
          <EmotionIndicator emotion={emotion} size="sm" />
          <span className="text-sm font-medium text-[#1F2937]">You</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl rounded-tr-md p-4 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-[#1F2937] leading-relaxed">{message}</p>
        </div>

        {/* Emotion label */}
        <div className="flex items-center gap-2 mt-2 mr-2 justify-end">
          <span
            className="text-xs italic font-light px-2 py-1 rounded-full"
            style={{
              color: emotionStyle.color,
              backgroundColor: emotionStyle.color + "20",
            }}
          >
            feeling {emotion}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
