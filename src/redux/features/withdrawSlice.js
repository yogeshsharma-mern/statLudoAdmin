import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getwithdrawdet } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchWithdrawDet = createAsyncThunk(
  "users/fetchwithdraw",
  async ({ page = 1, limit = 5, search = "" ,filters={}} = {}, thunkAPI) => {
  

    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getwithdrawdet({ page, limit, search,filters });

      return res.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ------- Slice -------
const withdrawSlice = createSlice({
  name: "widhdraw",
  initialState: {
    withdrawbalance: [],
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
      .addCase(fetchWithdrawDet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWithdrawDet.fulfilled, (state, action) => {
        console.log("action",action);
        console.log("first",action.payload)
        state.status = "succeeded";
        state.withdrawbalance = action.payload.withdrawbalance;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchWithdrawDet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      
  },
});

export default withdrawSlice.reducer;
