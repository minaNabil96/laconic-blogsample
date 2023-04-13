import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const login = await axios.post(`${localhost}/users/`, user, {
      withCredentials: true,
    });
    const data = await login.data;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const logOut = createAsyncThunk("auth/logOut", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const logout = await axios.post(`${localhost}/users/logOut/`, {
      withCredentials: true,
    });
    const data = await logout.data;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const getUserInfo = createAsyncThunk(
  "auth/getUserInfo",
  async (user, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const login = await axios.post(`${localhost}/users/info`, {
        withCredentials: true,
      });
      const data = await login.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authInitialState = {
  status: "",
  username: "",
  accessToken: {},
  loading: false,
  error: "",
  userInfo: {},
  isLogout: {},
};

const auth = createSlice({
  name: "auth",
  initialState: authInitialState,
  extraReducers: (builder) => {
    builder.addCase(
      login.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;
          state.status = action.payload.status;
          state.username = action.payload.username;
          state.accessToken = action.payload.accessToken;
        },
        builder.addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // start logout
    builder.addCase(
      logOut.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        logOut.fulfilled,
        (state, action) => {
          state.loading = false;
          state.isLogout = action.payload;
        },
        builder.addCase(logOut.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // end logout

    // start userInfo
    builder.addCase(
      getUserInfo.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        getUserInfo.fulfilled,
        (state, action) => {
          state.loading = false;
          state.userInfo = action.payload;
        },
        builder.addCase(getUserInfo.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // end userInfo
  },
});

export default auth.reducer;
