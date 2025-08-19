import axios from "axios";


const axiosApiInstance = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
})




module.exports={axiosApiInstance};