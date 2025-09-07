import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  Share,
  Settings,
  User,
  LogOut,
  Trash2,
  X,
} from "lucide-react";
import MoodSummary from "./MoodSummary";

const Topbar = ({
  isLoggedIn = false,
  user = null,
  onLogin,
  onSignup,
  onLogout,
  onDeleteChat,
  onNewChat,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteChat = () => {
    setShowDeleteConfirm(true);
    setShowMoreMenu(false);
  };

  const confirmDelete = () => {
    onDeleteChat(); // Delete current chat
    onNewChat(); // Start new chat
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Session info */}
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-[#1F2937]">Āḷmban</div>
            {isLoggedIn && user && (
              <div className="text-sm text-gray-600">
                Emotional Support Session
              </div>
            )}
          </div>

          {/* Right side - Auth/Mood summary and actions */}
          <div className="flex items-center gap-4">
            {/* If not logged in - Show Login button */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                {/* Current Mood Summary - Only show when logged in */}
                <MoodSummary currentMood="calm" />

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {user.name}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                  </button>

                  {/* More Menu Dropdown */}
                  {showMoreMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMoreMenu(false)}
                      />

                      {/* Menu */}
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200/50 z-20">
                        <div className="py-2">
                          <button
                            onClick={handleDeleteChat}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Chat
                          </button>
                          <hr className="my-1 border-gray-100" />
                          <button
                            onClick={onLogout}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937]">
                Delete Chat
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this conversation? This action
              cannot be undone, and a new chat will be started.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
