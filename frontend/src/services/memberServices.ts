import axios from "axios";
import type { FamilyMember } from "@/types/family";

const API_URL = "http://localhost:5000/api/family/";

export const memberServices = {
  // Add a new member
  addMember: async (member: Partial<FamilyMember>): Promise<FamilyMember> => {
    const res = await axios.post(API_URL, member);
    return res.data;
  },

  // Get all members
  getMembers: async (): Promise<FamilyMember[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  // Get single member by ID
  getMemberById: async (id: string): Promise<FamilyMember> => {
    const res = await axios.get(`${API_URL}${id}`);
    return res.data;
  },

  // Update a member
  updateMember: async (
    id: string,
    member: Partial<FamilyMember>
  ): Promise<FamilyMember> => {
    const res = await axios.put(`${API_URL}${id}`, member);
    return res.data;
  },

  // Delete a member
  deleteMember: async (id: string): Promise<{ message: string }> => {
    const res = await axios.delete(`${API_URL}${id}`);
    return res.data;
  },
};
