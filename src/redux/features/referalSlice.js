import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApiInstance } from "@/library/helper";
import { getReferals } from "@/library/apicall";
import { transactionApprove } from "@/library/apicall";
import { transactionReject } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchReferals = createAsyncThunk(
  "users/fetchAllTransactions",
  async ({ page = 1, limit = 5, search = "", filters = {} } = {}, thunkAPI) => {


    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getReferals({ page, limit, search, filters });
            // console.log("res.data",res.data);
      return res.data;

      // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ------- Slice -------
const referalSlice = createSlice({
  name: "referal",
  initialState: {
    referals: [],
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
      .addCase(fetchReferals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReferals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.referals = action.payload;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchReferals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

    // .addCase(transactionApproved.fulfilled, (state, action) => {
    //   const updated = action.payload;
    //   state.transactions = state.transactions.map((t) =>
    //     t._id === updated._id ? updated : t
    //   );
    // })

    // reject
    // .addCase(transactionRejected.fulfilled, (state, action) => {
    //   const updated = action.payload;
    //   state.transactions = state.transactions.map((t) =>
    //     t._id === updated._id ? updated : t
    //   );
    // });
  },
});

export default referalSlice.reducer;
