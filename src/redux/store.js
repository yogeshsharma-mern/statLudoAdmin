import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/redux/features/adminSlice";
import userReducer from "@/redux/features/userSlice";
import transactionReducer from "@/redux/features/transactionSlice";
import gameLogSlice from "./features/gameLogSlice";
import usergameslice from "@/redux/features/userGameSlice";



const store = configureStore({
    reducer:{
admin:adminReducer,
user:userReducer,
transaction:transactionReducer,
gameLog:gameLogSlice,
usergamedetails:usergameslice

    }
})

export default store;



