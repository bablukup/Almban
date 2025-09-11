import React, { useState } from "react";
import { Heart, Shield, Sparkles, AlertCircle, Loader2 } from "lucide-react";

// ===================== API SERVICE (From your provided code) =====================
const API_BASE_URL = "http://localhost:8080/api";

const getAuthToken = () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt") ||
      sessionStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const isValidToken = (token) => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const sendMessageToBackend = async (message) => {
  const token = getAuthToken();
  if (!token || !isValidToken(token)) {
    throw new Error("Invalid or expired token. Please login again.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const requestBody = {
    text: message,
    messageType: "text",
    timestamp: new Date().toISOString(),
    sessionId: "temp_session_" + Date.now(),
  };

  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore if parsing fails
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

// ===================== ERROR TOAST (From your provided code) =====================
const ErrorToast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 ml-2 flex-shrink-0"
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// ===================== UPDATED WELCOMESCREEN COMPONENT =====================
const WelcomeScreen = ({ userName = "Friend", onQuickAction = () => {} }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const quickMoodActions = [
    { emotion: "happy", label: "I'm feeling good today!", icon: "😊" },
    { emotion: "calm", label: "I'm feeling calm", icon: "😌" },
    { emotion: "sad", label: "I'm a bit sad", icon: "😔" },
    { emotion: "neutral", label: "Just want to chat", icon: "💬" },
  ];

  const handleQuickActionClick = async (emotion, label) => {
    if (isSending) return;

    setIsSending(true);
    setError("");

    try {
      // Check for token before making a call
      const token = getAuthToken();
      if (!token || !isValidToken(token)) {
        throw new Error("Please login to share your feelings.");
      }

      console.log(`Sending mood to backend: "${label}"`);
      const response = await sendMessageToBackend(label);

      // Pass the response to the parent component if needed
      onQuickAction({
        userMessage: label,
        backendResponse: response,
        timestamp: new Date().toISOString(),
        isAuthenticated: true,
      });
    } catch (err) {
      console.error("Failed to send quick action:", err);
      setError(err.message || "An unexpected error occurred.");
      setTimeout(() => setError(""), 5000); // Auto-clear error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <ErrorToast message={error} onClose={() => setError("")} />
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
        {/* Main Welcome Section */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl animate-ping opacity-20"></div>
            </div>
          </div>

          <h1 className="text-4xl font-semibold text-[#1F2937] mb-4">
            Good afternoon, {userName}
            <span className="inline-block ml-2 animate-pulse">💙</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            I'm <strong className="text-blue-600 font-semibold">Āḷmban</strong>,
            your emotional support companion. This is a safe space where you can
            share anything on your mind. How are you feeling today?
          </p>
        </div>

        {/* Quick Mood Actions */}
        <div className="mb-12 w-full max-w-4xl">
          <div className="flex flex-wrap justify-center gap-3">
            {quickMoodActions.map((action) => (
              <button
                key={action.emotion}
                onClick={() =>
                  handleQuickActionClick(action.emotion, action.label)
                }
                disabled={isSending}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-200 rounded-full transition-all duration-200 ease-in-out hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <span className="text-xl">{action.icon}</span>
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 italic">
            Take your time. I'm here whenever you're ready to share.
          </p>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
