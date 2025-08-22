import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/redux/features/adminSlice";
import userReducer from "@/redux/features/userSlice";
import transactionReducer from "@/redux/features/transactionSlice";


const store = configureStore({
    reducer:{
admin:adminReducer,
user:userReducer,
transaction:transactionReducer

    }
})

export default store;



