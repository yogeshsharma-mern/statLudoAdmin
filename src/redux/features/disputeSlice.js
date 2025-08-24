import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDisputeReport } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchDisputeReport = createAsyncThunk(
  "users/fetchactivecompltedgames",
  async ({ page = 1, limit = 5, search = "" ,filters={}} = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });
  
console.log("filters",filters);
    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getDisputeReport({ page, limit, search,filters });

      return res.data.games; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ------- Slice -------
const disputeReportSlice = createSlice({
  name: "activeCompltedGamess",
  initialState: {
    disputeReports: [],
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
      .addCase(fetchDisputeReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDisputeReport.fulfilled, (state, action) => {
        console.log("action",action);
        console.log("first",action.payload);
        state.status = "succeeded";
        state.disputeReports = action.payload.reports;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchDisputeReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      
  },
});

export default disputeReportSlice.reducer;
