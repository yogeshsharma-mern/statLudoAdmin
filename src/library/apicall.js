import {axiosApiInstance} from "@/library/helper";
import axios from "axios";
export const getUsersData = async ({ page = 1, limit = 5, search="", isBanned, isActive,filters={}}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
      if (filters.status === "banned") params.append("isBanned", true);
      if (filters.status === "unbanned") params.append("isBanned", false);
      if (filters.status === "active") params.append("isActive", true);
      if (filters.status === "inactive") params.append("isActive", false);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/users?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const userBlock = async(id)=>
{
    try {
        const response = await axiosApiInstance.patch(`/admin/users/${id}/ban`,{
            isBanned:true
        });
        return response.data;
        
    } catch (error) {
        return null;
    }
}




export const userUnBlock = async(id)=>
{
    try {
        const response = await axiosApiInstance.patch(`/admin/users/${id}/ban`,{
            isBanned:false
        });
        return response.data;
        
    } catch (error) {
        return null;
    }
}

export const UserDetail = async(id)=>
{
    try {
        const response = await axiosApiInstance.get(`/admin/users/${id}`);
        return response.data;
        
    } catch (error) {
        return null;
    }
}


export const updateUser = async(data,id)=>
{
    try {
        const response = await axiosApiInstance.put(`/admin/users/${id}`,{...data});
        return response.data;
        
    } catch (error) {
        return null;
    }
}
export const getTransactiion = async ({ page = 1, limit = 5, search="", filters}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
        params.append("status",filters.status);
    params.append("betAmountMin",filters.betAmountMin);
    params.append("betAmountMax",filters.betAmountMax);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/users?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const getGameLogs = async ({ page = 1, limit = 5, search="", isBanned, isActive,filters={}}) => {
  console.log("getlogfilter",filters);
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("status",filters.status);
    params.append("betAmountMin",filters.betAmountMin);
    params.append("betAmountMax",filters.betAmountMax);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/games?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 

export const addcredit = async (id, data) => {
    try {
        const response = await axiosApiInstance.put(`/admin/users/${id}/credit`, { ...data });
        return response.data;
    } catch (error) {
        console.error('Error adding credit:', error);
        return null;
    }
};


export const getUsergameData = async ({ page = 1, limit = 5, search="",id}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/users/${id}/games?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 

export const getscanner = async () => {
  
  try {
 

  
    const response = await axiosApiInstance.get(`/admin/users/${id}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const activeComplteGames = async ({ page = 1, limit = 5, search="",filters={}}) => {
  console.log("getlogfilter",filters);
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("status",filters.status);
    params.append("betAmountMin",filters.betAmountMin);
    params.append("betAmountMax",filters.betAmountMax);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/games?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 



export const playerReport = async ({ page = 1, limit = 5, search="",filters={}}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
      if (filters.status === "banned") params.append("isBanned", true);
      if (filters.status === "unbanned") params.append("isBanned", false);
      if (filters.status === "active") params.append("isActive", true);
      if (filters.status === "inactive") params.append("isActive", false);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/games?${params.toString()}`);

    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 





export const getDisputeReport = async ({ page = 1, limit = 5, search="",filters={}}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
      if (filters.status === "banned") params.append("isBanned", true);
      if (filters.status === "unbanned") params.append("isBanned", false);
      if (filters.status === "active") params.append("isActive", true);
      if (filters.status === "inactive") params.append("isActive", false);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/users?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 





export const getCoinsData = async ({ page = 1, limit = 5, search="",filters={}}) => {
  console.log("getlogfilter",filters);
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("status",filters.status);
    params.append("betAmountMin",filters.betAmountMin);
    params.append("betAmountMax",filters.betAmountMax);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/games?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const getwithdrawdet = async ({ page = 1, limit = 5, search="",filters={}}) => {
  console.log("getlogfilter",filters);
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);
    params.append("status",filters.status);
    params.append("betAmountMin",filters.betAmountMin);
    params.append("betAmountMax",filters.betAmountMax);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/admin/games?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const getScanner = async () => {
  // console.log("getlogfilter",filters);
  try {
    const params = new URLSearchParams();

    // params.append("page", page);
    // params.append("limit", limit);
// params.append("isActive",true);

    // if (search && search.trim() !== "") {
    //   params.append("search", search.trim());
    // }
    const response = await axiosApiInstance.get(`/assets/scanners?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 