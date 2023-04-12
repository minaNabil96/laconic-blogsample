import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  imageUrl: "",
  imageView: "",
  publishL: false,
};

const addPostSlice = createSlice({
  name: "addPostSlice",
  initialState,
  reducers: {
    titlea: (state, action) => {
      state.title = action.payload;
    },
    imagee: (state, action) => {
      state.imageUrl = action.payload;
    },
    imagee2: (state, action) => {
      state.imageView = action.payload;
    },
    clearState: (state, action) => {
      state.imageView = "";
      state.title = "";
      state.publishL = false;
    },
    publishSpin: (state, action) => {
      state.publishL = !state.publishL;
    },
  },
});

export const { titlea, imagee, imagee2, clearState, publishSpin } =
  addPostSlice.actions;

export default addPostSlice.reducer;
