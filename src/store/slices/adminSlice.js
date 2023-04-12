import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const api = process.env.REACT_APP_LOCALHOST;

export const fullUserEdit = createAsyncThunk(
  "adminSlice/fullUserEdit",
  async (payload, thunkAPI) => {
    const { adminId } = payload;
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.post(`${api}/users/${adminId}`, payload);
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "adminSlice/getAllUsers",
  async (adminId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const res = await axios.get(`${api}/users/allusers/${adminId}`);
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminSlice/deleteUser",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { adminId, userIdForDelete } = payload;

    try {
      const res = await axios.post(
        `${api}/users/deleteuser/${adminId}`,
        payload
      );
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const deleteAllUserArticles = createAsyncThunk(
  "adminSlice/deleteAllUserArticles",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { adminId, userIdForDelete } = payload;
    try {
      const res = await axios.post(
        `${api}/posts/deleteall/${adminId}`,
        payload
      );
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const editUser = createAsyncThunk(
  "adminSlice/editUser",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { adminId, superOrNot, userId } = payload;
    console.log(superOrNot, userId);
    try {
      const res = await axios.post(`${api}/users/${adminId}`, {
        superOrNot,
        userId,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const hideArticle = createAsyncThunk(
  "adminSlice/hideArticle",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { adminId, paramMatch: postId } = payload;
    try {
      const res = await axios.post(`${api}/posts/deleteforadmin/${adminId}`, {
        postId,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const retrieveArticle = createAsyncThunk(
  "adminSlice/retrieveArticle",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { adminId, paramMatch: postId } = payload;
    try {
      const res = await axios.post(`${api}/posts/retrieveforadmin/${adminId}`, {
        postId,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

export const addSection = createAsyncThunk(
  "adminSlice/addSection",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { sectionName, desc, image } = payload;
    try {
      const res = await axios.post(`${api}/sections`, {
        sectionName,
        desc,
        image,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

// delete section
export const deleteSection = createAsyncThunk(
  "adminSlice/deleteSection",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { _id } = payload;
    const sectionId = _id;
    try {
      const res = await axios.post(`${api}/sections/delete`, {
        sectionId,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

//  retrive section
export const retrieveSection = createAsyncThunk(
  "adminSlice/retriveSection",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { _id } = payload;
    const sectionId = _id;
    try {
      const res = await axios.post(`${api}/sections/retrieve-section`, {
        sectionId,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

// edit section
export const editSection = createAsyncThunk(
  "adminSlice/editSection",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axios.post(`${api}/sections/edit`, {
        payload,
      });
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: false,
  editedUser: [],
  allUsersData: [],
  deletedUser: "",
  deletedAllArticles: "",
  hideArticle: "",
  deletedSection: {},
  addedSection: {},
  editedSection: {},
  retrievedArticle: {},
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(
      fullUserEdit.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        fullUserEdit.fulfilled,
        (state, action) => {
          state.loading = false;
          state.editedUser = action.payload;
        },
        builder.addCase(fullUserEdit.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // start get all users
    builder.addCase(
      getAllUsers.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        getAllUsers.fulfilled,
        (state, action) => {
          state.loading = false;
          state.allUsersData = action.payload;
        },
        builder.addCase(getAllUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end get all users
    // start delete user
    builder.addCase(
      deleteUser.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        deleteUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.deletedUser = action.payload;
        },
        builder.addCase(deleteUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end delete user
    // start delete all user aricles
    builder.addCase(
      deleteAllUserArticles.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        deleteAllUserArticles.fulfilled,
        (state, action) => {
          state.loading = false;
          state.deletedAllArticles = action.payload;
        },
        builder.addCase(deleteAllUserArticles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end delete all user articles
    // start delete user
    builder.addCase(
      editUser.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        editUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.editedUser = action.payload;
        },
        builder.addCase(editUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end delete user
    // start hide article
    builder.addCase(
      hideArticle.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        hideArticle.fulfilled,
        (state, action) => {
          state.loading = false;
          state.hideArticle = action.payload;
        },
        builder.addCase(hideArticle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end hide article
    // start retrieve article
    builder.addCase(
      retrieveArticle.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        retrieveArticle.fulfilled,
        (state, action) => {
          state.loading = false;
          state.retrievedArticle = action.payload;
        },
        builder.addCase(retrieveArticle.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end retrieve article
    // start add section
    builder.addCase(
      addSection.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        addSection.fulfilled,
        (state, action) => {
          state.loading = false;
          state.addedSection = action.payload;
        },
        builder.addCase(addSection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end add section
    // start delete section
    builder.addCase(
      deleteSection.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        deleteSection.fulfilled,
        (state, action) => {
          state.loading = false;
          state.deletedSection = action.payload;
        },
        builder.addCase(deleteSection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end delete section
    // start retrieve section
    builder.addCase(
      retrieveSection.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        retrieveSection.fulfilled,
        (state, action) => {
          state.loading = false;
          state.editedSection = action.payload;
        },
        builder.addCase(retrieveSection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end retrieve section
    // start edit section
    builder.addCase(
      editSection.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        editSection.fulfilled,
        (state, action) => {
          state.loading = false;
          state.editedSection = action.payload;
        },
        builder.addCase(editSection.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );

    // end edit section
  },
});

export default adminSlice.reducer;
