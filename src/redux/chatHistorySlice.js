import { createSlice } from "@reduxjs/toolkit";

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState: {
    chatHistory: [
      { id: "abc", role: "user", content: "user message" },
      { id: "def", role: "assistant", content: "assistant message" },
    ],
  },
  reducers: {
    // payload: {id: string, role: string, content: string}
    upsertMessage: (state, action) => {
      const index = state.chatHistory.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        // chatHistoryの中に同じidがある場合は、contentを更新する
        state.chatHistory[index].content = action.payload.content;
      } else {
        // stateの中に同じidがない場合は、新しいメッセージを追加する
        state.chatHistory.push({
          id: action.payload.id,
          role: action.payload.role,
          content: action.payload.content,
        });
        // HACK: idは昇順で生成されるっぽいので、昇順にソートする
        state.chatHistory.sort((a, b) => (a.id < b.id ? -1 : 1));
      }
    },
    // payload: {id: string, content: string}
    updateMessage: (state, action) => {
      const index = state.chatHistory.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.chatHistory[index].content = action.payload.content;
      }
    },
    clearMessages: (state) => {
      state.chatHistory = [];
    },
  },
});

export const { upsertMessage, updateMessage, clearMessages } =
  chatHistorySlice.actions;
export default chatHistorySlice.reducer;
