import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { playerReport } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchplayerReport = createAsyncThunk(
  "users/fetchactivecompltedgames",
  async ({ page = 1, limit = 5, search = "" ,filters={}} = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });
  
console.log("filters",filters);
    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await playerReport({ page, limit, search,filters });

      return res.data.games; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ------- Slice -------
const playerreportSlice = createSlice({
  name: "activeCompltedGamess",
  initialState: {
    reports: [],
totalPages: 1,
    totalDocs: 0,
    page: 1,
    limit: 5,          // 👈 default page size
    status: "idle",
    error: null,
  },
  reducers: {
    // local reducers if you need them
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchplayerReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchplayerReport.fulfilled, (state, action) => {
        console.log("action",action);
        console.log("first",action.payload);
        state.status = "succeeded";
        state.reports = action.payload.reports;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchplayerReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      
  },
});

export default playerreportSlice.reducer;
