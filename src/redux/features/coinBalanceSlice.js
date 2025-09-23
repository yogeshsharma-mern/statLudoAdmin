import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCoinsData } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchCoins = createAsyncThunk(
  "users/fetchcoins",
  async ({ page = 1, limit = 5, search = "" ,filters={}} = {}, thunkAPI) => {
  

    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getCoinsData({ page, limit, search,filters });

      return res.data; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ------- Slice -------
const transactionSlice = createSlice({
  name: "coins",
  initialState: {
    coinbalance: [],
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
      .addCase(fetchCoins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        // console.log("action",action);
        // console.log("first",action.payload)
        state.status = "succeeded";
        state.coinbalance = action.payload.coins;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      
  },
});

export default transactionSlice.reducer;
//hello