import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

export const deleteArticleAsync = createAsyncThunk(
  "deleteArticle/deleteArticle",
  async (articleId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const deleteArticle = await axios.post(
        `${localhost}/posts/delete-article/${articleId}`
      );
      const data = await deleteArticle.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const deleteArticleInitialState = {
  deletedArticle: [],
  loading: false,
  error: "",
};

const deleteArticle = createSlice({
  name: "deleteArticle",
  initialState: deleteArticleInitialState,
  extraReducers: (builder) => {
    builder.addCase(
      deleteArticleAsync.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        deleteArticleAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          state.addedArticle = action.payload;
        },
        builder.addCase(deleteArticleAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
  },
});

export default deleteArticle.reducer;

// {
//   [deleteArticleAsync.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [deleteArticleAsync.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.addedArticle = action.payload;
//   },
//   [deleteArticleAsync.pending]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
// },
