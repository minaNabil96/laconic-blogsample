import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bigModalStatus: false,
  bigModalMessage: "",
  bigModalColor: "info",
  bigModalName: "",
  bigModalPayload: {},
};

const bigModalSlice = createSlice({
  name: "bigModalSlice",
  initialState: initialState,
  reducers: {
    bigModalStatus: (state, action) => {
      state.bigModalStatus = action.payload;
    },
    bigModalMessage: (state, action) => {
      state.bigModalMessage = action.payload.status;
      state.bigModalColor = action.payload.color;
    },
    closeBigModal: (state, action) => {
      state.bigModalMessage = "";
      state.bigModalStatus = false;
      state.bigModalPayload = {};
      state.bigModalName = "";
    },
    bigModal: (state, action) => {
      state.bigModalStatus = !state.bigModalStatus;
    },
    bigModalType: (state, action) => {
      state.bigModalName = action.payload;
    },
    bigModalPayloadData: (state, action) => {
      state.bigModalPayload = action.payload;
    },
  },
});

export const {
  bigModalStatus,
  bigModalMessage,
  closeBigModal,
  bigModal,
  bigModalType,
  bigModalPayloadData,
} = bigModalSlice.actions;
export default bigModalSlice.reducer;
