import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserTransactionData } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------


export const fetchuserTransactionData = createAsyncThunk(
    "users/transactions",
    async ({ page = 1, limit = 5, search = "", id,filters={}} = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });

        try {
            // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
            const res = await getUserTransactionData({ page, limit, search, id ,filters});

            return res.data.items; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// ------- Slice -------
const usertransactionSlice = createSlice({
    name: "transactiondata",
    initialState: {
        usertransactiondata: [],
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
            .addCase(fetchuserTransactionData.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchuserTransactionData.fulfilled, (state, action) => {
                console.log("action", action);
                console.log("first", action.payload)
                state.status = "succeeded";
                state.usertransactiondata = action.payload.users;
                state.totalPages = action.payload.pages;
                state.totalDocs = action.payload.totalDocs;
                state.page = action.payload.page;
                state.limit = action.payload.limit ?? state.limit;
            })
            .addCase(fetchuserTransactionData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

    },
});

export default usertransactionSlice.reducer;
