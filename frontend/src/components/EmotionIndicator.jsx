// src/components/EmotionIndicator.jsx
import React from "react";

const EmotionIndicator = ({
  emotion = "neutral",
  size = "md",
  showPulse = true,
  showLabel = false,
}) => {
  const getEmotionConfig = (emotionType) => {
    const emotions = {
      happy: {
        color: "#34D399",
        bgColor: "bg-green-400",
        label: "Happy",
        emoji: "😊",
        shadowColor: "shadow-green-400/50",
      },
      calm: {
        color: "#3B82F6",
        bgColor: "bg-blue-400",
        label: "Calm",
        emoji: "😌",
        shadowColor: "shadow-blue-400/50",
      },
      sad: {
        color: "#8B5CF6",
        bgColor: "bg-purple-400",
        label: "Sad",
        emoji: "😔",
        shadowColor: "shadow-purple-400/50",
      },
      anxious: {
        color: "#F59E0B",
        bgColor: "bg-yellow-400",
        label: "Anxious",
        emoji: "😰",
        shadowColor: "shadow-yellow-400/50",
      },
      angry: {
        color: "#EF4444",
        bgColor: "bg-red-400",
        label: "Angry",
        emoji: "😠",
        shadowColor: "shadow-red-400/50",
      },
      excited: {
        color: "#F97316",
        bgColor: "bg-orange-400",
        label: "Excited",
        emoji: "🤩",
        shadowColor: "shadow-orange-400/50",
      },
      neutral: {
        color: "#6B7280",
        bgColor: "bg-gray-400",
        label: "Neutral",
        emoji: "😐",
        shadowColor: "shadow-gray-400/50",
      },
    };
    return emotions[emotionType] || emotions.neutral;
  };

  const getSizeClasses = (sizeType) => {
    const sizes = {
      xs: "w-2 h-2",
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
    };
    return sizes[sizeType] || sizes.md;
  };

  const emotionConfig = getEmotionConfig(emotion);
  const sizeClass = getSizeClasses(size);

  return (
    <div className="flex items-center gap-2">
      {/* Emotion Dot */}
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeClass} ${emotionConfig.bgColor} rounded-full ${
            emotionConfig.shadowColor
          } ${
            showPulse ? "animate-pulse" : ""
          } shadow-sm transition-all duration-300`}
        />

        {/* Pulse ring effect */}
        {showPulse && (
          <div
            className={`absolute ${sizeClass} rounded-full animate-ping opacity-30`}
            style={{ backgroundColor: emotionConfig.color }}
          />
        )}
      </div>

      {/* Optional Label */}
      {showLabel && (
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-medium"
            style={{ color: emotionConfig.color }}
          >
            {emotionConfig.label}
          </span>
          <span className="text-sm">{emotionConfig.emoji}</span>
        </div>
      )}
    </div>
  );
};

export default EmotionIndicator;
