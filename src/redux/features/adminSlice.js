import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
    name:"admin",
    initialState:{
        data:"123",
        loginAt :"456"
    },
    reducers:{
        setAdmin:(state,action)=>
        {
console.log("hello",state);
        },
        removeAdmin:(state)=>
        {
            console.log("hello",state);
        }

    }
})

export const {setAdmin,removeAdmin} =adminSlice.actions;
export default adminSlice.reducer;