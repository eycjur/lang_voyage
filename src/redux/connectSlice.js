import { createSlice } from "@reduxjs/toolkit";

const connectSlice = createSlice({
  name: "isConnected",
  initialState: { isConnected: false },
  reducers: {
    connect: (state) => {
      state.isConnected = true;
    },
    disconnect: (state) => {
      state.isConnected = false;
    },
  },
});

export const { connect, disconnect } = connectSlice.actions;
export default connectSlice.reducer;
