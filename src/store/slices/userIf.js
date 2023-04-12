import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true;
const localhost = process.env.REACT_APP_LOCALHOST;

export const getUserArticles = createAsyncThunk(
  "userIf/getUserArticles",
  async (accessToken, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const getUserArticles = await axios.get(
        `${localhost}/posts/user-articles/`,
        accessToken
      );
      const data = await getUserArticles.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const AdminGetUserArticles = createAsyncThunk(
  "userIf/AdminGetUserArticles",
  async (userId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const AdminGetUserArticles = await axios.post(
        `${localhost}/posts/all-user-articles/`,
        userId
      );
      const data = await AdminGetUserArticles.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const getUserArticlesInitialState = {
  userArticles: [],
  loading: false,
  error: "",
  username: "",
};

const userArticles = createSlice({
  name: "userIf",
  initialState: getUserArticlesInitialState,
  reducers: {
    clearUserArticles: (state, action) => {
      state.userArticles = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getUserArticles.pending,
      (state, action) => {
        state.loading = true;
      },

      builder.addCase(
        getUserArticles.fulfilled,
        (state, action) => {
          state.loading = false;
          state.userArticles = action.payload;
          state.username = action.payload.author;
        },
        builder.addCase(getUserArticles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // start AdminGetUserArticles
    builder.addCase(
      AdminGetUserArticles.pending,
      (state, action) => {
        state.loading = true;
      },

      builder.addCase(
        AdminGetUserArticles.fulfilled,
        (state, action) => {
          state.loading = false;
          state.userArticles = action.payload;
          state.username = action.payload.author;
        },
        builder.addCase(AdminGetUserArticles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    //  end AdminGetUserArticles
  },
});
// end of get one section articles
export const { clearUserArticles } = userArticles.actions;
export default userArticles.reducer;

// {
//   [getUserArticles.pending]: (state, action) => {
//     state.loading = true;
//   },
//   [getUserArticles.fulfilled]: (state, action) => {
//     state.loading = false;
//     state.userArticles = action.payload;
//   },
//   [getUserArticles.rejected]: (state, action) => {
//     state.loading = false;
//     state.error = action.payload;
//   },
// },
