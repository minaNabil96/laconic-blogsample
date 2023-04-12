import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST
export const postAddArticle = createAsyncThunk(
  "addArticle/postAddArticle",
  async (article, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const postArticle = await axios.post(
        `${localhost}/posts/`,
        article
      );
      const data = await postArticle.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const addArticleInitialState = { addedArticle: [], loading: false, error: "" };

const addArticle = createSlice({
  name: "addArticle",
  initialState: addArticleInitialState,
  extraReducers: (builder) => {
    builder.addCase(
      postAddArticle.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        postAddArticle.fulfilled,
        (state, action) => {
          state.loading = false;
          state.addedArticle = action.payload;
        },
        builder.addCase(postAddArticle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
  },
});

export default addArticle.reducer;

// {
//   [postAddArticle.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [postAddArticle.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.addedArticle = action.payload;
//   },
//   [postAddArticle.pending]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
// },
