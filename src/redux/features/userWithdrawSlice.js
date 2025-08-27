import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserWithdrawData } from "@/library/apicall";
import {getuserWithdraw} from "@/library/apicall";
import {getuserReject} from "@/library/apicall";


// ------- Thunks (redux-thunk via RTK) -------


export const fetchUserWithdrawData = createAsyncThunk(
    "users/gamedata",
    async ({ page = 1, limit = 5, search = "", id,filters={}} = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });

        try {
            // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
            const res = await getUserWithdrawData({ page, limit, search, id ,filters});
            console.log("resofactions",res)

            return res.data.items; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
export const userWithdrawApproved = createAsyncThunk("withdraw/approve", async (id, thunkAPI) => {
  try {
   const res = await  getuserWithdraw(id);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const userWithdrawReject = createAsyncThunk("withdraw/reject", async (id, thunkAPI) => {
  try {
   const res = await  getuserReject(id);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ------- Slice -------
const userWithdrawSlice = createSlice({
    name: "withdrawdata",
    initialState: {
        userwithdrawdata: [],
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
            .addCase(fetchUserWithdrawData.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUserWithdrawData.fulfilled, (state, action) => {
                console.log("action", action);
                console.log("first", action.payload)
                state.status = "succeeded";
                state.usergamedata = action.payload.users;
                state.totalPages = action.payload.pages;
                state.totalDocs = action.payload.totalDocs;
                state.page = action.payload.page;
                state.limit = action.payload.limit ?? state.limit;
            })
            .addCase(fetchUserWithdrawData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

    },
});

export default userWithdrawSlice.reducer;
