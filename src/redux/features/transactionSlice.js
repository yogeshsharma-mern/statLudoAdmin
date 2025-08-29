import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {axiosApiInstance} from "@/library/helper";
import { getTransactiion } from "@/library/apicall";
import {transactionApprove} from "@/library/apicall";
import {transactionReject} from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchTransactions = createAsyncThunk(
  "users/fetchAllTransactions",
  async ({ page = 1, limit = 5, search = "" ,filters={}} = {}, thunkAPI) => {
  

    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getTransactiion({ page, limit, search,filters });
console.log("paymentssss",res);
      return res.data;
       // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const transactionApproved = createAsyncThunk("transaction/apprvoed", async (id, thunkAPI) => {
  try {
   const res = await  transactionApprove(id);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const transactionRejected = createAsyncThunk("transaction/reject", async (id, thunkAPI) => {
  try {
   const res = await  transactionReject(id);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
// ------- Slice -------
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
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
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        console.log("action",action);
        console.log("first",action.payload)
        state.status = "succeeded";
        state.transactions = action.payload;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
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

export default transactionSlice.reducer;
