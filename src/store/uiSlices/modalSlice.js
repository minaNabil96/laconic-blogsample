import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalstatus: false,
  modalMessage: "",
  modalColor: "info",
  formModalStatus: false,
  modalName: "",
  showOrHide: true,
  modalPayload: {},
};

const modalSlice = createSlice({
  name: "modalSlice",
  initialState: initialState,
  reducers: {
    modalStatus: (state, action) => {
      state.modalStatus = action.payload;
    },
    modalMessage: (state, action) => {
      state.modalMessage = action.payload.status;
      state.modalColor = action.payload.color;
    },
    closeModal: (state, action) => {
      state.modalMessage = "";
      state.modalStatus = false;
      state.showOrHide = true;
    },
    formModal: (state, action) => {
      state.formModalStatus = !state.formModalStatus;
    },
    modalType: (state, action) => {
      state.modalName = action.payload;
    },
    modalPayloadData: (state, action) => {
      state.modalPayload = action.payload;
    },
    showModal: (state, action) => {
      state.showOrHide = false;
    },
  },
});

export const {
  modalStatus,
  modalMessage,
  closeModal,
  formModal,
  modalType,
  showModal,
  modalPayloadData,
} = modalSlice.actions;
export default modalSlice.reducer;
