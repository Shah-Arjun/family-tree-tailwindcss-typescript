// frontend to backend api call logic goes here

import axios from "axios";
import type { FamilyMember } from "@/types/family";
import { transformFamilyMember } from "../utils/buildFamilyTree";

const API_URL = `${import.meta.env.VITE_API_URL}/api/family`;

// Helper: removes empty strings and _id before sending to backend
const cleanMemberPayload = (member: Partial<FamilyMember>) => {
  const payload: any = { ...member };

  // Remove _id (backend generates it)
  delete payload._id;

  // Remove empty strings for ObjectId fields
  ["spouseId", "fatherId", "motherId"].forEach((key) => {
    if (payload[key] === "" || payload[key] === null) delete payload[key];
  });

  // Remove empty string childrenIds (if any)
  if (Array.isArray(payload.childrenIds)) {
    payload.childrenIds = payload.childrenIds.filter(
      (id: any) => id && id !== ""
    );
  }

  return payload;
};




//to handle error
const handleError = (err: any) => {
  const message =
    err.response?.data?.error ||
    err.response?.data?.message ||
    err.message ||
    "Unknown error";
  return new Error(message);
};





export const memberServices = {
  // Add a new member
  addMember: async (
    data: FormData | Omit<FamilyMember, "_id">,
    isFormData = false
  ) => {
    try {
      const token = localStorage.getItem("token"); // fetch the token saved after login

      let res;

      if (isFormData) {
        res = await axios.post(API_URL, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const payload = cleanMemberPayload(data as Omit<FamilyMember, "_id">);
        res = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      // ✅ Guard against backend errors
      if (res.data?.error) {
        throw new Error(res.data.error);
      }

      return transformFamilyMember(res.data);
    } catch (err) {
      throw handleError(err);
    }
  },

  // // Get all members
  // getMembers: async (): Promise<FamilyMember[]> => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No token found in localStorage");
  //     throw new Error("Unauthorized: No token");
  //   }
  //   const res = await axios.get(API_URL, {
  //     headers: {
  //       "auth-token": token, //attach jwt token
  //     },
  //   });
  //   return res.data.members || res.data;
  // },




  // Get single member by ID
  getMemberById: async (id: string): Promise<FamilyMember> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Unauthorized: No token");

      const res = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformFamilyMember(res.data);
    } catch (err) {
      throw handleError(err)
    }
  },





  // Update a member
  updateMember: async (
    id: string,
    member: Partial<FamilyMember>
  ): Promise<FamilyMember> => {
    try {
      const token = localStorage.getItem("token")
      if(!token) throw new Error("Unauthorized: No token")

      const payload = cleanMemberPayload(member);

      const res = await axios.put(`${API_URL}/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data?.error) throw new Error(res.data.error);

      return transformFamilyMember(res.data);
    } catch (err) {
      throw handleError(err);
    }
  },







  // Delete a member
  deleteMember: async (id: string): Promise<{ message: string }> => {
    try {
          const token = localStorage.getItem("token")
      if(!token) throw new Error("Unauthorized: No token")

      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data?.error) throw new Error(res.data.error);

      return res.data;
    } catch (err) {
      throw handleError(err);
    }
  },






  // fetch members for logged user
  getMembersByUser: async (): Promise<FamilyMember[]> => {
    const token = localStorage.getItem("token"); //jwt from login
    console.log(token);
    if (!token) throw new Error("No token found");

    // const userId = localStorage.getItem("userId");
    // if (!token || !userId) throw new Error("Unauthorized");

    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = res.data;

    // normalize response
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.members)) return data.members;

    return []; // fallback
  },
};
