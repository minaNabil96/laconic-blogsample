import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  index: 0,
};

const switchAdminNav = createSlice({
  name: "switchAdminNav",
  initialState: initialState,
  reducers: {
    theClickedIdx: (state, action) => {
      state.index = action.payload;
    },
  },
});

export const { theClickedIdx } = switchAdminNav.actions;
export default switchAdminNav.reducer;
