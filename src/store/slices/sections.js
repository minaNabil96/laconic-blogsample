import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const localhost = process.env.REACT_APP_LOCALHOST;

// get all sections
export const getAllSections = createAsyncThunk(
  "sections/getAllSections",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const getAllSections = await axios.get(`${localhost}/sections/`);
      const data = await getAllSections.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

// get all sections for admin
export const getAllSectionsForAdmin = createAsyncThunk(
  "sections/getAllSectionsForAdmin",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const getAllSections = await axios.get(
        `${localhost}/sections/sections-admin/`
      );
      const data = await getAllSections.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

// one section by id
export const oneSectionDetails = createAsyncThunk(
  "sections/oneSectionDetails",
  async (sectionId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await axios.get(`${localhost}/sections/${sectionId}`);
      const data = await res.data;
      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);

const getAllSectionsInitialState = {
  sections: [],
  loading: false,
  error: "",
  sectionsDetails: {},
  isSectionVisible: {},
};

const sections = createSlice({
  name: "sections",
  initialState: getAllSectionsInitialState,
  extraReducers: (builder) => {
    // start get all sections
    builder.addCase(
      getAllSections.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        getAllSections.fulfilled,
        (state, action) => {
          state.loading = false;
          state.sections = action.payload;
        },

        builder.addCase(getAllSections.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // end get all sections
    // start get all sections for admin
    builder.addCase(
      getAllSectionsForAdmin.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        getAllSectionsForAdmin.fulfilled,
        (state, action) => {
          state.loading = false;
          state.sections = action.payload;
        },

        builder.addCase(getAllSectionsForAdmin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // end get all sections for admin
    // start get one section
    builder.addCase(
      oneSectionDetails.pending,
      (state, action) => {
        state.loading = true;
      },
      builder.addCase(
        oneSectionDetails.fulfilled,
        (state, action) => {
          state.loading = false;
          state.sectionsDetails = action.payload;
        },

        builder.addCase(oneSectionDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
      )
    );
    // end get one section
  },
});

export default sections.reducer;
