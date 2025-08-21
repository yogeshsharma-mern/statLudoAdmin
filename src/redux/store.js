import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/redux/features/adminSlice";
import userReducer from "@/redux/features/userSlice";


const store = configureStore({
    reducer:{
admin:adminReducer,
user:userReducer

    }
})

export default store;



