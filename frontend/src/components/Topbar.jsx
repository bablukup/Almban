// src/components/Topbar.jsx
import React from "react";
import { MoreHorizontal, Share, Settings } from "lucide-react";
import MoodSummary from "./MoodSummary";

const Topbar = () => {
  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Session info */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Emotional Support Session
            </h2>
            <p className="text-sm text-gray-500">
              Safe space for your thoughts and feelings
            </p>
          </div>
        </div>

        {/* Right side - Mood summary and actions */}
        <div className="flex items-center gap-4">
          {/* Current Mood Summary */}
          <MoodSummary currentMood="calm" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Share className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Settings className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
