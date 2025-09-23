import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/redux/features/adminSlice";
import userReducer from "@/redux/features/userSlice";
import transactionReducer from "@/redux/features/transactionSlice";
import gameLogSlice from "./features/gameLogSlice";
import usergameslice from "@/redux/features/userGameSlice";
import activecompltedgames from "@/redux/features/activeCompletedGamesSlice";
import playerreportReducer from "@/redux/features/playerReportSlice";
import disputereportReducer from "@/redux/features/disputeSlice";
import coinReducer from "@/redux/features/coinBalanceSlice";
import widhdrawReducer from "@/redux/features/withdrawSlice";
import usercreditslice from "@/redux/features/userCreditSlice";
import userwithdrawslice from "@/redux/features/userWithdrawSlice";
import userTransactiionReducer from "@/redux/features/userTransactionSlice";
import userReferal from "@/redux/features/referalSlice";
import userReferalSlice from "@/redux/features/userReferalSlice";



const store = configureStore({
    reducer: {
        admin: adminReducer,
        user: userReducer,
        transaction: transactionReducer,
        gameLog: gameLogSlice,
        usergamedetails: usergameslice,
        activecompltedgame: activecompltedgames,
        playerreport:playerreportReducer,
        disputereport:disputereportReducer,
        coin:coinReducer,
        withdraw:widhdrawReducer,
        usercreditdetails:usercreditslice,
        userwithdrawdetails:userwithdrawslice,
        usertransaction:userTransactiionReducer,
        referal:userReferal,
        userReferal:userReferalSlice
    }
})

export default store;


//store



