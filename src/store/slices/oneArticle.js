import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

export const getNextAndPrevId = createAsyncThunk(
  "oneArticle/nextAndPrev",
  async (articleId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const getNextAndPrevId = await axios.get(
        `${localhost}/posts/nppost/${articleId}`
      );
      const data = await getNextAndPrevId.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const getArticleById = createAsyncThunk(
  "oneArticle/getArticleById",
  async (articleId, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;

    try {
      const getArticleById = await axios.get(`${localhost}/posts/${articleId}`);
      const data = await getArticleById.data;
      dispatch(getNextAndPrevId(articleId));
      return data;
    } catch (error) {
      dispatch(getNextAndPrevId(articleId));
      rejectWithValue(error.message);
    }
  }
);
const getArticleByIdInitialState = {
  oneArticle: [],
  loading: false,
  error: "",
  nextAndPrevId: [],
  isVisible: null,
};

const oneArticle = createSlice({
  name: "oneArticle",
  initialState: getArticleByIdInitialState,
  extraReducers: (builder) => {
    // start of get one article
    builder.addCase(
      getArticleById.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        getArticleById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.oneArticle = action.payload;
          state.isVisible = action.payload.matched.visible;
        },

        builder.addCase(
          getArticleById.rejected,
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          // end of get one article
          // start of get next and articles
          builder.addCase(getNextAndPrevId.pending, (state, action) => {
            state.loading = true;
          }),
          builder.addCase(getNextAndPrevId.fulfilled, (state, action) => {
            state.loading = false;
            state.nextAndPrevId = action.payload;
          }),
          builder.addCase(getNextAndPrevId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          // start of get next and articles
        )
      )
    );
  },
});

export default oneArticle.reducer;

// {
//   [getArticleById.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [getArticleById.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.oneArticle = action.payload;
//   },
//   [getArticleById.rejected]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
// },
