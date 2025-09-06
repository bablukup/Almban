// src/components/WelcomeScreen.jsx
import React from "react";
import { Heart, MessageCircle, Sparkles, Shield } from "lucide-react";
import EmotionIndicator from "./EmotionIndicator";

const WelcomeScreen = ({ userName = "Friend", onQuickAction = () => {} }) => {
  const quickMoodActions = [
    { emotion: "happy", label: "I'm feeling great!", icon: "😊" },
    { emotion: "calm", label: "I'm peaceful today", icon: "😌" },
    { emotion: "sad", label: "I'm feeling down", icon: "😔" },
    { emotion: "anxious", label: "I'm worried about something", icon: "😰" },
    { emotion: "neutral", label: "Just want to chat", icon: "💭" },
  ];

  const supportFeatures = [
    {
      icon: Heart,
      title: "Emotional Support",
      description: "I'm here to listen without judgment",
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Your thoughts and feelings are completely safe",
    },
    {
      icon: Sparkles,
      title: "Personal Growth",
      description: "Let's explore your emotions together",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      {/* Main Welcome Section */}
      <div className="text-center mb-12 max-w-2xl">
        {/* Āḷmban Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Greeting */}
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
      <div className="mb-12 w-full max-w-3xl">
        <h3 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          How are you feeling right now?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickMoodActions.map((action) => (
            <button
              key={action.emotion}
              onClick={() => onQuickAction(action.emotion, action.label)}
              className="flex items-center gap-3 p-4 bg-white/80 hover:bg-white border border-gray-200/50 hover:border-blue-200 rounded-2xl transition-all hover:shadow-md hover:scale-105 group"
            >
              <EmotionIndicator
                emotion={action.emotion}
                size="md"
                showPulse={false}
              />
              <div className="text-left flex-1">
                <span className="text-sm font-medium text-[#1F2937] group-hover:text-blue-700">
                  {action.label}
                </span>
              </div>
              <span className="text-lg">{action.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Support Features */}
      <div className="w-full max-w-4xl">
        <h3 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
          What I'm here for
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportFeatures.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/30 hover:bg-white/80 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-[#1F2937] mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
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
  );
};

export default WelcomeScreen;
