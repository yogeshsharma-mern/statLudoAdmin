import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {axiosApiInstance} from "@/library/helper";
// import {getUsersData} from "@/library/apicall";
// import {userBlock} from "@/library/apicall";
// import {userUnBlock} from "@/library/apicall";
// import {updateUser} from "@/library/apicall";
// import {UserDetail} from "@/library/apicall";
import { getGameLogs } from "@/library/apicall";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchGameLogs = createAsyncThunk(
  "users/fetchAllTransactions",
  async ({ page = 1, limit = 5, search = "", isBanned, isActive } = {}, thunkAPI) => {
        console.log("hh", { page, limit, search });
  

    try {
      // ✅ object pass karo, getUsersData khud hi URLSearchParams banayega
      const res = await getGameLogs({ page, limit, search, isBanned, isActive });

      return res.data.games; // 👈 res.data nahi likho, kyunki getUsersData already .data return kar raha hai
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);





// export const addUser = createAsyncThunk("users/add", async (payload, thunkAPI) => {
//   try {
//     const res = await api.post("/users", payload);
//     return res.data; // created user
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//   }
// });

// export const updateTransactions = createAsyncThunk("users/update", async ({ id,data }, thunkAPI) => {
//   try {
//     const res = await updateUser(data,id);
//     return res.data; // updated user
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//   }
// });

// export const userBlocked = createAsyncThunk("users/block", async (id, thunkAPI) => {
//   try {
//    const res = await  userBlock(id);
//     return res;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//   }
// });
// export const userUnBlocked = createAsyncThunk("users/unblock", async (id, thunkAPI) => {
//   try {
//    const res = await  userUnBlock(id);
//     return res;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//   }
// });
// export const userDetails = createAsyncThunk("users/details", async (id, thunkAPI) => {
//   try {
//    const res = await  UserDetail(id);
//     return res;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
//   }
// });
// ------- Slice -------
const gameLogSlice = createSlice({
  name: "gamelogs",
  initialState: {
    logs: [],
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
      .addCase(fetchGameLogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGameLogs.fulfilled, (state, action) => {
        console.log("action",action);
        console.log("first",action.payload);
        state.status = "succeeded";
        state.logs = action.payload.games;
        state.totalPages = action.payload.pages;
        state.totalDocs = action.payload.totalDocs;
        state.page = action.payload.page;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchGameLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // add
      // .addCase(addUser.fulfilled, (state, action) => {
      //   state.items.unshift(action.payload);
      // })
      // update
      // .addCase(updateUser.fulfilled, (state, action) => {
      //   const i = state.items.findIndex((u) => u.id === action.payload.id);
      //   if (i !== -1) state.items[i] = action.payload;
      // })
      //block
// .addCase(userBlocked.fulfilled, (state, action) => {
//   console.log("payload", action.payload);
//   const i = state.items.findIndex((u) => u._id === action.payload.data._id);
//   if (i !== -1) {
//     state.items[i] = { ...state.items[i], isBanned: true };
//   }
// })

      // unblock user
//   .addCase(userUnBlocked.fulfilled, (state, action) => {
//   const i = state.items.findIndex((u) => u._id === action.payload.data._id);
//   if (i !== -1) {
//     state.items[i] = { ...state.items[i], isBanned: false };
//   }
// })
      // delete
      // .addCase(deleteUser.fulfilled, (state, action) => {
      //   state.items = state.items.filter((u) => u.id !== action.payload.data.id);
      //   console.log("action",action.payload)
      // });
      
  },
});

export default gameLogSlice.reducer;
