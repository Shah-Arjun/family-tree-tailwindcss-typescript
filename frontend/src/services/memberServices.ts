import axios from "axios";
import type { FamilyMember } from "@/types/family";
import { transformFamilyMember } from "../utils/transform";

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
    let res;
    if (isFormData) {
      //send as FormData (for photo upload)
      res = await axios.post(API_URL, data, {
        headers: { Accept: "application/json" }, //dont set content-type
      });
    } else {
      //send as json
      const payload = cleanMemberPayload(data as Omit<FamilyMember, "_id">);
      res = await axios.post(API_URL, payload);
    }
    return transformFamilyMember(res.data); // normalixe for feontend
  },



  // Get all members
  getMembers: async (): Promise<FamilyMember[]> => {
    const res = await axios.get(API_URL);
    return res.data.map(transformFamilyMember);
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
