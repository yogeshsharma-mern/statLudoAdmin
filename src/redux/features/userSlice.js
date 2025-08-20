import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// ------- Thunks (redux-thunk via RTK) -------
export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.get("/users");
    return res.data; // expect an array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addUser = createAsyncThunk("users/add", async (payload, thunkAPI) => {
  try {
    const res = await api.post("/users", payload);
    return res.data; // created user
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateUser = createAsyncThunk("users/update", async ({ id, ...data }, thunkAPI) => {
  try {
    const res = await api.put(`/users/${id}`, data);
    return res.data; // updated user
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ------- Slice -------
const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // local reducers if you need them
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // add
      .addCase(addUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // update
      .addCase(updateUser.fulfilled, (state, action) => {
        const i = state.items.findIndex((u) => u.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      // delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
