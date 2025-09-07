import { AwardIcon } from "lucide-react";
import React from "react";
import { error } from "winston";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
export const sendMessageToAI = async (message, emotion = "neutral") => {
  try {
    const response = await fetch(`${API_URL}/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        emotion: emotion,
        userId: "bablu", //dynamic User Id
      }),
    });
    if (!response.ok) {
      throw new error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error", error);
    return { error: error.message };
  }
};
