// src/components/Sidebar.jsx
import React from "react";
import { Plus, MessageCircle, Settings, Heart, User } from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col h-screen shadow-sm">
      {/* Header with Āḷmban Logo */}
      <div className="px-6 py-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#1F2937]">Āḷmban</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-light italic">
          emotional support companion
        </p>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem
          icon={Plus}
          label="New Conversation"
          isNew={true}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/30"
        />

        <SidebarItem
          icon={MessageCircle}
          label="Chat History"
          isActive={true}
        />

        <SidebarItem icon={Heart} label="Mood Journal" emotionColor="#34D399" />

        <SidebarItem icon={Settings} label="Settings" />

        {/* Recent Conversations */}
        <div className="pt-8">
          <h3 className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </h3>
          <div className="space-y-1 mt-3">
            <div className="px-3 py-2 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 truncate">
                  Feeling anxious about work
                </span>
              </div>
              <p className="text-xs text-gray-400 ml-4 mt-1">2 hours ago</p>
            </div>

            <div className="px-3 py-2 rounded-xl hover:bg-purple-50/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 truncate">
                  Relationship advice needed
                </span>
              </div>
              <p className="text-xs text-gray-400 ml-4 mt-1">1 day ago</p>
            </div>

            <div className="px-3 py-2 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600 group-hover:text-gray-800 truncate">
                  Meditation and mindfulness
                </span>
              </div>
              <p className="text-xs text-gray-400 ml-4 mt-1">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-gray-200/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1F2937] group-hover:text-blue-700">
              Bablu
            </p>
            <p className="text-xs text-gray-500">Your emotional journey</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
