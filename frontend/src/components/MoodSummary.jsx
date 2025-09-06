// src/components/MoodSummary.jsx
import React from "react";
import EmotionIndicator from "./EmotionIndicator";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MoodSummary = ({
  currentMood = "neutral",
  trend = "stable",
  showTrend = true,
  compact = false,
}) => {
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: "😊",
      calm: "😌",
      sad: "😔",
      anxious: "😰",
      angry: "😠",
      excited: "🤩",
      neutral: "😐",
    };
    return moodEmojis[mood] || "😐";
  };

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = (trendType) => {
    switch (trendType) {
      case "up":
        return "text-green-600 bg-green-50 border-green-200";
      case "down":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-full border border-gray-200/50 shadow-sm">
        <EmotionIndicator emotion={currentMood} size="sm" showPulse={true} />
        <span className="text-sm font-medium text-[#1F2937] capitalize">
          {currentMood} {getMoodEmoji(currentMood)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
      {/* Current Mood Display */}
      <div className="flex items-center gap-2">
        <EmotionIndicator emotion={currentMood} size="md" showPulse={true} />
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Current Mood
          </p>
          <p className="text-sm font-semibold text-[#1F2937] capitalize flex items-center gap-1">
            {currentMood}
            <span className="text-base">{getMoodEmoji(currentMood)}</span>
          </p>
        </div>
      </div>

      {/* Mood Trend */}
      {showTrend && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getTrendColor(
            trend
          )}`}
        >
          {getTrendIcon(trend)}
          <span className="text-xs font-medium">
            {trend === "up"
              ? "Improving"
              : trend === "down"
              ? "Declining"
              : "Stable"}
          </span>
        </div>
      )}
    </div>
  );
};

export default MoodSummary;
