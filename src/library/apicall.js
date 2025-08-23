import {axiosApiInstance} from "@/library/helper";
import axios from "axios";
export const getUsersData = async ({ page = 1, limit = 5, search="", isBanned, isActive}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/users?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const userBlock = async(id)=>
{
    try {
        const response = await axiosApiInstance.patch(`/users/${id}/ban`,{
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
        const response = await axiosApiInstance.patch(`/users/${id}/ban`,{
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
        const response = await axiosApiInstance.get(`/users/${id}`);
        return response.data;
        
    } catch (error) {
        return null;
    }
}


export const updateUser = async(data,id)=>
{
    try {
        const response = await axiosApiInstance.put(`/users/${id}`,{...data});
        return response.data;
        
    } catch (error) {
        return null;
    }
}
export const getTransactiion = async ({ page = 1, limit = 5, search="", isBanned, isActive}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/users?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 


export const getGameLogs = async ({ page = 1, limit = 5, search="", isBanned, isActive}) => {
  
  try {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await axiosApiInstance.get(`/games?${params.toString()}`);
    return response.data;
// ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 

export const addcredit = async (id, data) => {
    try {
        const response = await axiosApiInstance.put(`/users/${id}/credit`, { ...data });
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
    const response = await axiosApiInstance.get(`/users/${id}/games?${params.toString()}`);
    return response.data; // ✅ returns API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    return null; // or throw error if you want to handle it in component
  }
}; 

  //   if (!creditValue || isNaN(creditValue))
  //     return alert("Enter a valid number");
  //   try {
  //     setLoading(true);
  //     const res = await axiosApiInstance.put(
  //       `/users/${userDetail._id}/credit`,
  //       { credit: Number(creditValue) }
  //     );
  //     alert("Credit updated successfully ✅");
  //     setShowCreditModal(false);
  //     setCreditValue("");
  //     setForm((prev) => ({ ...prev, credit: res.data.credit }));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update credit ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



