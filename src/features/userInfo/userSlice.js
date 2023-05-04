import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: 0,
  jwt: "",
  currentChat: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.userId = action.payload.userId;
      state.jwt = action.payload.jwt;
    },
    deleteValue: (state) => {
      state.userId = 0;
      state.jwt = "";
      state.currentChat = null;
    },
    setChat: (state, action) => {
      state.currentChat = action.payload;
    },
  },
});

export const { setValue, deleteValue, setChat } = userSlice.actions;

export default userSlice.reducer;
