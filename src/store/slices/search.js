import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { reset } from "./articles";
import { getAllArticles } from "./articles";
import axios from "axios";

const localhost = process.env.REACT_APP_LOCALHOST;

// get searched articles
export const getSearched = createAsyncThunk(
  "articles/getSearched",
  async (pageAndlimit, thunkAPI) => {
    const { page, limit, term } = pageAndlimit;
    const { rejectWithValue } = thunkAPI;
    try {
      const getSearched = await axios.get(
        `${localhost}/posts/search?page=${page}&limit=${limit}&term=${term}`
      );
      const data = await getSearched.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const searchArticlesInitialState = {
  articles: [],
  loading: false,
  error: "",
};
//  end get all articles

const searchArticles = createSlice({
  name: "searchArticles",
  initialState: searchArticlesInitialState,
  reducers: {
    restart: (state, action) => searchArticlesInitialState,
  },
  extraReducers:
    // start get all articles
    (builder) => {
      // start search
      builder.addCase(
        getSearched.pending,
        (state, action) => {
          state.loading = true;
        },
        builder.addCase(
          getSearched.fulfilled,
          (state, action) => {
            state.loading = false;
            state.articles = action.payload;
          },

          builder.addCase(getSearched.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
        )
      );
      // end search
    },
});
export const { restart } = searchArticles.actions;
export default searchArticles.reducer;

// {
//   // start get all articles
//   [getAllArticles.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [getAllArticles.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.articles = action.payload;
//   },
//   [getAllArticles.rejected]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
//   // end get all articles
// },
