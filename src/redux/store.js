import { configureStore } from "@reduxjs/toolkit";

import chatHistoryReducer from "./chatHistorySlice";
import connectReducer from "./connectSlice";
import settingReducer from "./settingSlice";

export const store = configureStore({
  reducer: {
    chatHistory: chatHistoryReducer,
    connect: connectReducer,
    setting: settingReducer,
  },
});
