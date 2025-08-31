// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getTransactiion } from "@/library/apicall";
// import socket from "@/library/socket";
// import { transactionApprove } from "@/library/apicall";
// import { transactionReject } from "@/library/apicall";

// // ------- Thunks (redux-thunk via RTK) -------
// export const fetchSocketTransactions = createAsyncThunk(
//   "users/fetchAllTransactions",
//   async ({ page = 1, limit = 5, search = "", filters = {} } = {}, thunkAPI) => {


//     try {
//       // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
//       const res = await getTransactiion({ page, limit, search });
//       return res.data.payments;
//       // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );
// // export const transactionApproved = createAsyncThunk("transaction/apprvoed", async (id, thunkAPI) => {
// //   try {
// //    const res = await  transactionApprove(id);
// //     return res;
// //   } catch (err) {
// //     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
// //   }
// // });
// // export const transactionRejected = createAsyncThunk("transaction/reject", async (id, thunkAPI) => {
// //   try {
// //    const res = await  transactionReject(id);
// //     return res;
// //   } catch (err) {
// //     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
// //   }
// // });
// // ------- Slice -------
// const fetchtran = createSlice({
//   name: "sockettransactions",
//   initialState: {
//     socketTransactions: [],
//     totalPages: 1,
//     totalDocs: 0,
//     page: 1,
//     limit: 5,          // 👈 default page size
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     // local reducers if you need them
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetch
//       .addCase(fetchSocketTransactions.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchSocketTransactions.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.socketTransactions = action.payload.users;
//         state.totalPages = action.payload.pages;
//         state.totalDocs = action.payload.totalDocs;
//         state.page = action.payload.page;
//         state.limit = action.payload.limit ?? state.limit;
//       })
//       .addCase(fetchSocketTransactions.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || action.error.message;
//       })


//   },
// });

// export default transactionSlice.reducer;
