import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

export const getOneSectionArticles = createAsyncThunk(
  "sections/getOneSectionArticles",
  async (oneSectionDetailes, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { currentParam, page, limit } = oneSectionDetailes;
    try {
      const getOneSectionArticles = await axios.get(
        `${localhost}/posts/sections/${currentParam}?page=${page}&limit=${limit}`
      );
      const data = await getOneSectionArticles.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
const getOneSectionArticlesInitialState = {
  oneSection: [],
  loading: false,
  error: "",
};

const oneSection = createSlice({
  name: "sections",
  initialState: getOneSectionArticlesInitialState,
  extraReducers: (builder) => {
    builder.addCase(
      getOneSectionArticles.pending,
      (state, action) => {
        state.loading = true;
      },

      builder.addCase(
        getOneSectionArticles.fulfilled,
        (state, action) => {
          state.loading = false;
          state.oneSection = action.payload;
        },
        builder.addCase(getOneSectionArticles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
  },
});
// end of get one section articles

export default oneSection.reducer;

// {
//   [getOneSectionArticles.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [getOneSectionArticles.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.oneSection = action.payload;
//   },
//   [getOneSectionArticles.rejected]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
// },
