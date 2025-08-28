import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { activeComplteGames } from "@/library/apicall";
import {submitWinnderResult} from '@/library/apicall';

// ------- Thunks -------
export const fetchActiveCompltedGames = createAsyncThunk(
  "users/fetchactivecompltedgames",
  async (
    { page = 1, limit = 5, search = "", filters = {} } = {}, 
    thunkAPI
  ) => {
    console.log("hh", { page, limit, search, filters });

    try {
      const res = await activeComplteGames({ page, limit, search, filters });

      // 👇 yahan poora object return karo
      return res.data; 
      // jisme { games: [], pages: 5, totalDocs: 100, page: 1, limit: 10 } hoga
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const gameresult = createAsyncThunk("game/result", async (payload, thunkAPI) => {
  try {
   const res = await  submitWinnderResult(payload);
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// ------- Slice -------
const activeCompltedGameSlice = createSlice({
  name: "activeCompltedGamess",
  initialState: {
    games: [],
    totalPages: 1,
    totalDocs: 0,
    page: 1,
    limit: 5,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCompltedGames.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActiveCompltedGames.fulfilled, (state, action) => {
        console.log("fulfilled payload", action.payload);
        state.status = "succeeded";
        state.games = action.payload.games || [];
        state.totalPages = action.payload.pages || 1;
        state.totalDocs = action.payload.totalDocs || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit ?? state.limit;
      })
      .addCase(fetchActiveCompltedGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default activeCompltedGameSlice.reducer;
