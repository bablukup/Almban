import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  MessageCircle,
  Heart,
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  Palette,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

// Emotion → Color mapping
const emotionColors = {
  happy: "#FBBF24",
  sad: "#3B82F6",
  angry: "#EF4444",
  stressed: "#8B5CF6",
  calm: "#34D399",
  default: "#9CA3AF",
};

const Sidebar = () => {
  const [recentMessages, setRecentMessages] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [userName, setUserName] = useState("Bablu"); // Default name
  const navigate = useNavigate();

  // Toast notification function
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Load user info from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    if (userInfo.name) {
      setUserName(userInfo.name);
    }
  }, []);

  // Fetch recent conversations from backend
  const fetchRecentMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8080/api/messages/recent?limit=5",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setRecentMessages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recent messages:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecentMessages();
  }, [fetchRecentMessages]);

  // Start new conversation → just navigate with new sessionId
  const startNewConversation = () => {
    const sessionId = `new-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    navigate(`/conversation/${sessionId}`);
  };

  // Navigate to old conversation
  const handleRecentClick = (sessionId) => {
    navigate(`/conversation/${sessionId}`);
  };

  // Mood Journal placeholder
  const handleMoodJournal = () => {
    showToastMessage("This feature will be available in future updates");
  };

  // Settings handlers
  const toggleUserSettings = () => {
    setShowUserSettings(!showUserSettings);
  };

  const handleSettingsClick = (settingType) => {
    setShowUserSettings(false);
    showToastMessage(`${settingType} will be available in future updates`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Helper for time formatting
  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 flex flex-col h-screen shadow-sm relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{toastMessage}</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Header */}
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
          onClick={startNewConversation}
        />

        <SidebarItem
          icon={MessageCircle}
          label="Chat History"
          isActive={true}
          onClick={() => navigate("/chat-history")}
        />

        <SidebarItem
          icon={Heart}
          label="Mood Journal"
          emotionColor="#34D399"
          onClick={handleMoodJournal}
        />

        {/* Recent Conversations */}
        <div className="pt-8">
          <h3 className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </h3>
          <div className="space-y-1 mt-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => {
                const emotion = msg.emotionId?.emotion || "default";
                const color = emotionColors[emotion] || emotionColors.default;

                return (
                  <div
                    key={msg._id}
                    onClick={() => handleRecentClick(msg.sessionId)}
                    className="px-3 py-2 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 truncate">
                        {msg.text}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 ml-4 mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 ml-4 mt-2">
                No conversations yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* User Section with Settings */}
      <div className="px-4 py-4 border-t border-gray-200/50 relative">
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer group"
          onClick={toggleUserSettings}
        >
          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1F2937] group-hover:text-blue-700">
              {userName}
            </p>
            <p className="text-xs text-gray-500">Your emotional journey</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Dropdown */}
        {showUserSettings && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
            <div className="py-2">
              <div
                onClick={() => handleSettingsClick("Profile Settings")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Profile Settings</span>
              </div>

              <div
                onClick={() => handleSettingsClick("Theme Settings")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Palette className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Theme</span>
              </div>

              <div
                onClick={() => handleSettingsClick("Notifications")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Notifications</span>
              </div>

              <div
                onClick={() => handleSettingsClick("Privacy Settings")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Privacy</span>
              </div>

              <div
                onClick={() => handleSettingsClick("Help & Support")}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Help & Support</span>
              </div>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close settings */}
      {showUserSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserSettings(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
