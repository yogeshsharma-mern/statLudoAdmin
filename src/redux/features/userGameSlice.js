import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApiInstance } from "@/library/helper";
import { getUsergameData } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------


export const fetchuserGameData = createAsyncThunk(
    "users/gamedata",
    async ({ page = 1, limit = 5, search = "", id,filters={}} = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });

        try {
            // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
            const res = await getUsergameData({ page, limit, search, id ,filters});
            console.log("resofactions",res)

            return res.data; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);


// export const updateUsers = createAsyncThunk("users/update", async ({ id, data }, thunkAPI) => {
//     try {
//         const res = await updateUser(data, id);
//         return res.data; // updated user
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
// });

// export const addcredits = createAsyncThunk("credit/add", async ({ id, data }, thunkAPI) => {
//     try {
//         const res = await addcredit(id, data);
//         return res;
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
// });
// export const userBlocked = createAsyncThunk("users/block", async (id, thunkAPI) => {
//     try {
//         const res = await userBlock(id);
//         return res;
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
// });
// export const userUnBlocked = createAsyncThunk("users/unblock", async (id, thunkAPI) => {
//     try {
//         const res = await userUnBlock(id);
//         return res;
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
// });
// export const userDetails = createAsyncThunk("users/details", async (id, thunkAPI) => {
//     try {
//         const res = await UserDetail(id);
//         return res;
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//     }
// });
// ------- Slice -------
const usergameslice = createSlice({
    name: "gameData",
    initialState: {
        usergamedata: [],
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
            .addCase(fetchuserGameData.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchuserGameData.fulfilled, (state, action) => {
                console.log("action", action);
                console.log("first", action.payload)
                state.status = "succeeded";
                state.usergamedata = action.payload.users;
                state.totalPages = action.payload.pages;
                state.totalDocs = action.payload.totalDocs;
                state.page = action.payload.page;
                state.limit = action.payload.limit ?? state.limit;
            })
            .addCase(fetchuserGameData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })

    },
});

export default usergameslice.reducer;
