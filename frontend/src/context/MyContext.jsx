import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  // User info
  user: {
    name: "Bablu",
    currentMood: "neutral",
    moodHistory: [],
    preferences: {
      theme: "light",
      notifications: true,
      emotionTracking: true,
    },
  },

  // Chat state
  chat: {
    messages: [],
    isTyping: false,
    currentConversationId: null,
    conversations: [],
  },

  // Emotion tracking
  emotions: {
    current: "neutral",
    trend: "stable", // 'up', 'down', 'stable'
    history: [],
    dailySummary: {
      date: new Date().toDateString(),
      emotions: {},
      dominantEmotion: "neutral",
    },
  },

  // UI state
  ui: {
    sidebarOpen: true,
    welcomeScreenVisible: true,
    currentPage: "home",
    loading: false,
    error: null,
  },
};

// Action types
const ActionTypes = {
  // User actions
  SET_USER_NAME: "SET_USER_NAME",
  UPDATE_USER_PREFERENCES: "UPDATE_USER_PREFERENCES",

  // Chat actions
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_TYPING: "SET_TYPING",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  LOAD_CONVERSATION: "LOAD_CONVERSATION",

  // Emotion actions
  SET_CURRENT_EMOTION: "SET_CURRENT_EMOTION",
  ADD_EMOTION_TO_HISTORY: "ADD_EMOTION_TO_HISTORY",
  UPDATE_MOOD_TREND: "UPDATE_MOOD_TREND",
  UPDATE_DAILY_SUMMARY: "UPDATE_DAILY_SUMMARY",

  // UI actions
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_WELCOME_SCREEN: "SET_WELCOME_SCREEN",
  SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    // User actions
    case ActionTypes.SET_USER_NAME:
      return {
        ...state,
        user: { ...state.user, name: action.payload },
      };

    case ActionTypes.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload },
        },
      };

    // Chat actions
    case ActionTypes.ADD_MESSAGE:
      const newMessage = {
        id: Date.now(),
        timestamp: new Date(),
        ...action.payload,
      };
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...state.chat.messages, newMessage],
        },
      };

    case ActionTypes.SET_TYPING:
      return {
        ...state,
        chat: { ...state.chat, isTyping: action.payload },
      };

    case ActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        chat: { ...state.chat, messages: [] },
      };

    // Emotion actions - FIXED: Added block scope to avoid variable conflicts
    case ActionTypes.SET_CURRENT_EMOTION: {
      const emotion = action.payload;
      const timestamp = new Date();

      return {
        ...state,
        user: { ...state.user, currentMood: emotion },
        emotions: {
          ...state.emotions,
          current: emotion,
          history: [
            ...state.emotions.history,
            { emotion, timestamp, context: action.context || "" },
          ].slice(-50), // Keep last 50 emotions
        },
      };
    }

    case ActionTypes.UPDATE_MOOD_TREND:
      return {
        ...state,
        emotions: { ...state.emotions, trend: action.payload },
      };

    case ActionTypes.UPDATE_DAILY_SUMMARY: {
      const today = new Date().toDateString();
      const currentEmotions = state.emotions.dailySummary.emotions;
      const emotion = action.payload; // Now in separate block scope

      const updatedEmotions = {
        ...currentEmotions,
        [emotion]: (currentEmotions[emotion] || 0) + 1,
      };

      // Find dominant emotion
      const dominantEmotion = Object.keys(updatedEmotions).reduce((a, b) =>
        updatedEmotions[a] > updatedEmotions[b] ? a : b
      );

      return {
        ...state,
        emotions: {
          ...state.emotions,
          dailySummary: {
            date: today,
            emotions: updatedEmotions,
            dominantEmotion,
          },
        },
      };
    }

    // UI actions
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
      };

    case ActionTypes.SET_WELCOME_SCREEN:
      return {
        ...state,
        ui: { ...state.ui, welcomeScreenVisible: action.payload },
      };

    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        ui: { ...state.ui, currentPage: action.payload },
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      };

    default:
      return state;
  }
};

// Context creation
const MyContext = createContext();

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useAppContext must be used within a MyContextProvider");
  }
  return context;
};

// Context Provider component
export const MyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const actions = {
    // User actions
    setUserName: (name) =>
      dispatch({ type: ActionTypes.SET_USER_NAME, payload: name }),
    updateUserPreferences: (preferences) =>
      dispatch({
        type: ActionTypes.UPDATE_USER_PREFERENCES,
        payload: preferences,
      }),

    // Chat actions
    addMessage: (message) =>
      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: message }),
    setTyping: (isTyping) =>
      dispatch({ type: ActionTypes.SET_TYPING, payload: isTyping }),
    clearMessages: () => dispatch({ type: ActionTypes.CLEAR_MESSAGES }),

    // Emotion actions
    setCurrentEmotion: (emotion, context = "") => {
      dispatch({
        type: ActionTypes.SET_CURRENT_EMOTION,
        payload: emotion,
        context,
      });
      dispatch({ type: ActionTypes.UPDATE_DAILY_SUMMARY, payload: emotion });
    },
    updateMoodTrend: (trend) =>
      dispatch({ type: ActionTypes.UPDATE_MOOD_TREND, payload: trend }),

    // UI actions
    toggleSidebar: () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR }),
    setWelcomeScreen: (visible) =>
      dispatch({ type: ActionTypes.SET_WELCOME_SCREEN, payload: visible }),
    setCurrentPage: (page) =>
      dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    setLoading: (loading) =>
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) =>
      dispatch({ type: ActionTypes.SET_ERROR, payload: error }),

    // Helper functions
    sendMessage: (text, emotion = "neutral") => {
      const userMessage = {
        type: "user",
        text,
        emotion,
      };
      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: userMessage });
      dispatch({
        type: ActionTypes.SET_CURRENT_EMOTION,
        payload: emotion,
        context: text,
      });

      // Hide welcome screen after first message
      dispatch({ type: ActionTypes.SET_WELCOME_SCREEN, payload: false });
    },

    addAIResponse: (text, emotion = "calm") => {
      dispatch({ type: ActionTypes.SET_TYPING, payload: false });
      const aiMessage = {
        type: "ai",
        text,
        emotion,
      };
      dispatch({ type: ActionTypes.ADD_MESSAGE, payload: aiMessage });
    },

    startNewConversation: () => {
      dispatch({ type: ActionTypes.CLEAR_MESSAGES });
      dispatch({ type: ActionTypes.SET_WELCOME_SCREEN, payload: true });
      dispatch({
        type: ActionTypes.SET_CURRENT_EMOTION,
        payload: "neutral",
        context: "new conversation",
      });
    },
  };

  // Calculate mood trend based on recent emotions
  useEffect(() => {
    const recentEmotions = state.emotions.history.slice(-5);
    if (recentEmotions.length >= 3) {
      const emotionScores = {
        happy: 5,
        excited: 4,
        calm: 3,
        neutral: 2,
        sad: 1,
        anxious: 1,
        angry: 0,
      };

      const scores = recentEmotions.map((e) => emotionScores[e.emotion] || 2);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const recentAvg = scores.slice(-2).reduce((a, b) => a + b, 0) / 2;

      let trend = "stable";
      if (recentAvg > avgScore + 0.5) trend = "up";
      else if (recentAvg < avgScore - 0.5) trend = "down";

      if (trend !== state.emotions.trend) {
        dispatch({ type: ActionTypes.UPDATE_MOOD_TREND, payload: trend });
      }
    }
  }, [state.emotions.history]);

  return (
    <MyContext.Provider value={{ state, actions }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
