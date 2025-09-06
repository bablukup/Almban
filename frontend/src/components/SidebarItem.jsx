// src/components/SidebarItem.jsx
import React from "react";

const SidebarItem = ({
  icon: Icon,
  label,
  isNew = false,
  isActive = false,
  emotionColor = null,
  className = "",
  onClick = () => {},
}) => {
  const getItemStyles = () => {
    if (isActive) {
      return "bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 shadow-sm";
    }
    if (isNew) {
      return "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border hover:border-blue-200/30";
    }
    return "hover:bg-gray-50/80";
  };

  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${getItemStyles()} ${className}`}
      onClick={onClick}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={`relative ${
            isNew
              ? "text-blue-600"
              : isActive
              ? "text-blue-700"
              : "text-gray-500 group-hover:text-gray-700"
          }`}
        >
          <Icon className="w-5 h-5" />
          {emotionColor && (
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: emotionColor }}
            ></div>
          )}
        </div>
      )}

      {/* Label */}
      <span
        className={`text-sm font-medium transition-colors ${
          isActive
            ? "text-blue-700"
            : isNew
            ? "text-blue-600 group-hover:text-blue-700"
            : "text-gray-700 group-hover:text-gray-900"
        }`}
      >
        {label}
      </span>

      {/* New indicator */}
      {isNew && (
        <div className="ml-auto">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="ml-auto">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
