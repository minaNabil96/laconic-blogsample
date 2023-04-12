import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const localhost = process.env.REACT_APP_LOCALHOST;

// get all articles
export const getAllArticles = createAsyncThunk(
  "articles/getAllArticles",
  async (pageAndlimit, thunkAPI) => {
    const { page, limit } = pageAndlimit;
    const { rejectWithValue, getState, dispatch } = thunkAPI;
    const search = getState().search.articles;

    try {
      const getArticles = await axios.get(
        `${localhost}/posts?page=${page}&limit=${limit}`
      );
      const data = await getArticles.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getAllArticlesInitialState = {
  articles: [],
  loading: false,
  error: "",
};
//  end get all articles

const articles = createSlice({
  name: "articles",
  initialState: getAllArticlesInitialState,
  reducers: {
    reset: (state, action) => state.articles === [],
  },
  extraReducers:
    // start get all articles
    (builder) => {
      builder.addCase(
        getAllArticles.pending,
        (state, action) => {
          state.loading = true;
        },
        builder.addCase(
          getAllArticles.fulfilled,
          (state, action) => {
            state.loading = false;
            state.articles = action.payload;
          },

          builder.addCase(getAllArticles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
        )
      );
    },
});
export const { reset } = articles.actions;
export default articles.reducer;
