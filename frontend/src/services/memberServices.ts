// frontend to backend api call logic goes here

import axios from "axios";
import type { FamilyMember } from "@/types/family";
import { transformFamilyMember } from "../utils/buildFamilyTree";

const API_URL = "http://localhost:5000/api/family/";


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

export const memberServices = {
  
  // Add a new member
  addMember: async (
    data: FormData | Omit<FamilyMember, "_id">,
    isFormData = false
  ) => {
    try {
      const token = localStorage.getItem('token')   // fetch the token saved after login

      let res;

      if (isFormData) {
        res = await axios.post(API_URL, data, {
          headers: {
            "auth-token": token,
          }
        });
      } else {
        const payload = cleanMemberPayload(data as Omit<FamilyMember, "_id">);
        res = await axios.post(API_URL, payload, {
          headers: { 
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
      }

      // ✅ Guard against backend errors
      if (res.data?.error) {
        throw new Error(res.data.error);
      }

      return transformFamilyMember(res.data);
    } catch (err: any) {
      console.error("❌ addMember failed:", err.response?.data || err.message);
      throw err; // rethrow so caller can handle in handleSubmit
    }
  },



  // Get all members
  getMembers: async (): Promise<FamilyMember[]> => {
    const token = localStorage.getItem("token");
    if(!token) {
      console.error("No token found in localStorage")
      throw new Error("Unauthorized: No token")
    }
    const res = await axios.get(API_URL, {
      headers: {
        "auth-token": token,       //attach jwt token
      }
    });
    return res.data.members || res.data
  },



  // Get single member by ID
  getMemberById: async (id: string): Promise<FamilyMember> => {
    const res = await axios.get(`${API_URL}${id}`);
    return transformFamilyMember(res.data);
  },

  // Update a member
  updateMember: async (
    id: string,
    member: Partial<FamilyMember>
  ): Promise<FamilyMember> => {
    const payload = cleanMemberPayload(member);
    const res = await axios.put(`${API_URL}${id}`, payload);
    return transformFamilyMember(res.data);
  },

  // Delete a member
  deleteMember: async (id: string): Promise<{ message: string }> => {
    const res = await axios.delete(`${API_URL}${id}`);
    return res.data;
  },
};
