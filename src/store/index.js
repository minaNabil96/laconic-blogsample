import { configureStore } from "@reduxjs/toolkit";
import articles from "./slices/articles";
import sections from "./slices/sections";
import oneSection from "./slices/oneSection";
import oneArticle from "./slices/oneArticle";
import addArticle from "./slices/addArticle";
import deleteArticle from "./slices/deleteArticle";
import auth from "./slices/auth";
import userIf from "./slices/userIf";
import editArticle from "./slices/editArticle";
import search from "./slices/search";
import addPostSlice from "../store/uiSlices/addPostSlice";
import modalSlice from "./uiSlices/modalSlice";
import adminSlice from "./slices/adminSlice";
import bigModalSlice from "./uiSlices/bigModalSlice";
import switchAdminNav from "./uiSlices/switchAdminNav";
export default configureStore({
  reducer: {
    switchAdminNav,
    adminSlice,
    addPostSlice,
    modalSlice,
    articles,
    sections,
    oneSection,
    oneArticle,
    addArticle,
    deleteArticle,
    auth,
    userIf,
    editArticle,
    search,
    bigModalSlice,
  },
  devTools: false,
});
