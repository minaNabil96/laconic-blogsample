import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

export const editArticleThunk = createAsyncThunk(
  "edit/editArticleThunk,",
  async (editDetailes, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { id, ...params } = editDetailes;
    try {
      const edit = await axios.put(`${localhost}/posts/${id}`, params);
      const data = await edit.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const editArticleInitialState = {
  edited: [],
  loading: false,
  error: "",
};

const editArticle = createSlice({
  name: "edit",
  initialState: editArticleInitialState,
  extraReducers: (builder) => {
    builder.addCase(
      editArticleThunk.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        editArticleThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.edited = action.payload;
        },

        builder.addCase(editArticleThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
  },
});

export default editArticle.reducer;
