import React, { useState, useRef } from "react";
import { Send, Smile, Loader2, AlertCircle } from "lucide-react";

// ===================== API SERVICE =====================
const API_BASE_URL = "http://localhost:8080/api";

// Helper function to get token from localStorage
const getAuthToken = () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt") ||
      sessionStorage.getItem("token");

    if (token) {
      console.log("🔑 Found token in storage:", token.substring(0, 20) + "...");
      return token;
    }

    console.log("❌ No token found in storage");
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Helper function to validate token format
const isValidToken = (token) => {
  if (!token || typeof token !== "string") return false;

  // Basic JWT format check (header.payload.signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.warn("⚠️ Invalid token format - not a JWT");
    return false;
  }

  try {
    // Check if payload can be decoded (basic validation)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn("⚠️ Token is expired");
      return false;
    }

    console.log("✅ Token is valid:", {
      userId: payload.userId,
      expires: new Date(payload.exp * 1000).toLocaleString(),
    });
    return true;
  } catch (error) {
    console.warn("⚠️ Cannot decode token payload:", error);
    return false;
  }
};

const sendMessageToBackend = async (message, providedToken = null) => {
  console.log("🚀 Sending message:", message.substring(0, 50) + "...");

  // Get token from storage if not provided
  const token = providedToken || getAuthToken();

  // Check if user is authenticated
  if (!token) {
    throw new Error("Authentication required. Please login first.");
  }

  // Validate token format and expiration
  if (!isValidToken(token)) {
    // Clear invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("jwt");
    throw new Error("Invalid or expired token. Please login again.");
  }

  const headers = {
    "Content-Type": "application/json",
    // Ensure Bearer prefix is added correctly
    Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  console.log("📤 Request headers:", {
    "Content-Type": headers["Content-Type"],
    Authorization: "Bearer ***",
  });

  // Simple request body - temporary sessionId until backend is updated
  const requestBody = {
    text: message,
    messageType: "text",
    timestamp: new Date().toISOString(),
    sessionId: "temp_session_" + Date.now(), // Temporary fix for backend validation
  };

  console.log("📤 Request body:", requestBody);

  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers,
      // Remove credentials: 'include' temporarily to fix CORS
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Response status:", response.status);
    console.log(
      "📥 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("jwt");
      throw new Error("Authentication failed. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("Access forbidden. Check your permissions.");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);

      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Use default message if can't parse JSON
      }

      throw new Error(errorMessage);
    }

    // Parse successful response
    const data = await response.json();
    console.log("✅ Success response from backend:", data);
    console.log("🔍 Backend response structure:", {
      hasResponse: !!data.response,
      hasText: !!data.text,
      hasMessage: !!data.message,
      allKeys: Object.keys(data),
    });

    return {
      ...data,
      isAuthenticated: true,
    };
  } catch (error) {
    // Enhanced error handling
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }

    throw error; // Re-throw other errors
  }
};

// ===================== ERROR TOAST =====================
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
    </div>
  );
};

// ===================== MAIN CHATINPUT COMPONENT =====================
const ChatInput = ({
  onSendMessage,
  token = null, // JWT token for authenticated users
  disabled = false, // Disable input
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  // Get effective token (provided or from storage)
  const effectiveToken = token || getAuthToken();
  const isAuthenticated = !!(effectiveToken && isValidToken(effectiveToken));

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || isSending || disabled) {
      return;
    }

    // Check authentication before sending
    if (!isAuthenticated) {
      setError("Please login to send messages.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      // Send message to backend with token-based authentication
      const response = await sendMessageToBackend(
        message.trim(),
        effectiveToken
      );

      // Call parent component's callback with the response
      if (onSendMessage) {
        onSendMessage({
          userMessage: message.trim(),
          backendResponse: response,
          timestamp: new Date().toISOString(),
          isAuthenticated: true,
        });
      }

      // Clear input on success
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px";
      }
    } catch (err) {
      console.error("Failed to send message:", err);

      let errorMessage =
        err.message || "Failed to send message. Please try again.";

      // Don't show raw error messages to users
      if (errorMessage.includes("fetch")) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);

      // Auto-clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <ErrorToast message={error} onClose={() => setError("")} />

      <div className="px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200/50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3 bg-white rounded-2xl shadow-md border border-gray-200/50 p-3 sm:p-4">
            {/* Emotion Button */}
            <button
              type="button"
              className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full items-center justify-center transition-colors"
              disabled={disabled || isSending || !isAuthenticated}
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            {/* Input Field */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isAuthenticated
                  ? "How are you feeling today? Share your thoughts..."
                  : "Please login to send messages..."
              }
              className="flex-1 resize-none border-none outline-none bg-transparent text-[#1F2937] placeholder-gray-500 min-h-[24px] max-h-32 text-sm sm:text-base leading-relaxed"
              rows="1"
              disabled={disabled || isSending || !isAuthenticated}
              maxLength={4000}
            />

            {/* Character Counter */}
            {message.length > 3500 && (
              <span className="text-xs text-gray-400 self-end pb-1">
                {4000 - message.length}
              </span>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={
                !message.trim() || isSending || disabled || !isAuthenticated
              }
              className="flex-shrink-0 w-12 h-12 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>

          {/* Status indicators */}
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {/* Authentication status */}
              {isAuthenticated ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Authenticated
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Please login
                </span>
              )}

              {/* Character count */}
              {message.length > 100 && (
                <span className="text-gray-400">{message.length}/4000</span>
              )}
            </div>

            {/* Connection status */}
            <div className="hidden sm:block">
              {isSending ? (
                <span className="text-blue-600 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending...
                </span>
              ) : error ? (
                <span className="text-red-500">Error</span>
              ) : !isAuthenticated ? (
                <span className="text-orange-500">Login required</span>
              ) : (
                <span>Press Enter to send</span>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatInput;
