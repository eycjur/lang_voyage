import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

function getOpenAIApiKey() {
  if (localStorage.getItem("openaiApiKey")) {
    return localStorage.getItem("openaiApiKey");
  }
  while (true) {
    const apiKey = prompt("Please enter your OpenAI API key");
    if (apiKey) {
      localStorage.setItem("openaiApiKey", apiKey);
      return apiKey;
    }
  }
}

function getNativeLanguage() {
  if (localStorage.getItem("nativeLanguage")) {
    return localStorage.getItem("nativeLanguage");
  }
  if ("en" in window.navigator.languages) {
    return "en";
  }
  return "ja";
}

const settingSlice = createSlice({
  name: "setting",
  initialState: {
    openaiApiKey: getOpenAIApiKey(),
    nativeLanguage: getNativeLanguage(),
    targetLanguage: localStorage.getItem("targetLanguage") || "english",
    speakingSpeed: localStorage.getItem("speakingSpeed") || 1,
    model: localStorage.getItem("model") || "gpt-4o-mini",
  },
  reducers: {
    // payload: srting
    setOpenAIApiKey: (state, action) => {
      state.openaiApiKey = action.payload;
      localStorage.setItem("openaiApiKey", action.payload);
    },
    // payload: string
    setNativeLanguage: (state, action) => {
      state.nativeLanguage = action.payload;
      localStorage.setItem("nativeLanguage", action.payload);
      i18next.changeLanguage(action.payload);
    },
    // payload: string
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
      localStorage.setItem("targetLanguage", action.payload);
    },
    // payload: number
    setSpeakingSpeed: (state, action) => {
      state.speakingSpeed = action.payload;
      localStorage.setItem("speakingSpeed", action.payload);
    },
    setModel: (state, action) => {
      state.model = action.payload;
      localStorage.setItem("model", action.payload);
    },
  },
});

export const {
  setOpenAIApiKey,
  setNativeLanguage,
  setTargetLanguage,
  setSpeakingSpeed,
  setModel,
} = settingSlice.actions;
export default settingSlice.reducer;
