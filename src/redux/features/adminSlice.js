// import { createSlice } from "@reduxjs/toolkit";


// const adminSlice = createSlice({
//     name:"admin",
//     initialState:{
//         data:"123",
//         loginAt :"456"
//     },
//     reducers:{
//         setAdmin:(state,action)=>
//         {
// console.log("hello",state);
//         },
//         removeAdmin:(state)=>
//         {
//             console.log("hello",state);
//         }

//     }
// })

// export const {setAdmin,removeAdmin} =adminSlice.actions;
// export default adminSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/lib/api";
import {axiosApiInstance} from "@/library/helper";
import axios from "axios";
import Cookies from "js-cookie";
import socket from "@/library/socket";
// --- Thunks ---

 
  const handleLogin = (id) => {
    console.log("helo",id);
        if (!socket.connected) socket.connect();

    socket.emit("register_user", { id });


    // remove only the approved payment from local sta
  };

// Login: send credentials, receive { token, user }
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axiosApiInstance.post("/admin/login", { email, password });
     const adminid=res.data.data.id;
      handleLogin(adminid);
      // console.log("yuyuyu",res.data);
      // Expecting { token, user }
      const { token } = res.data.data;
      const {id} = res.data.data.id;
      console.log("IDDDD",id);

      // Persist (keep side-effects inside thunk, not reducers)
      if (typeof window !== "undefined") {
            Cookies.set("adminToken", res.data.data.token, { expires: 1 });
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user));
    
      }

      return { token };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Restore session from localStorage on app start
export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return { token, user };
});

// Logout
export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async (_, thunkAPI) => {
  try {
    Cookies.remove("adminToken");
    // Optionally tell the server
    // await api.post("/auth/logout");
  } catch (e) {
    // ignore
  } finally {
    if (typeof window !== "undefined") {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    }
    return true;
  }
});

// --- Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    status: "idle",   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginAdmin.pending, (s) => {
        s.status = "loading"; s.error = null;
      })
      .addCase(loginAdmin.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.token = a.payload.token;
        s.user = a.payload.user;
      })
      .addCase(loginAdmin.rejected, (s, a) => {
        s.status = "failed"; s.error = a.payload || "Login failed";
      })

      // restore
    //   .addCase(restoreSession.fulfilled, (s, a) => {
    //     s.token = a.payload.token;
    //     s.user = a.payload.user;
    //   })

      // logout
      .addCase(logoutAdmin.fulfilled, (s) => {
        s.token = null; s.user = null; s.status = "idle"; s.error = null;
      });
  },
});

export default authSlice.reducer;
