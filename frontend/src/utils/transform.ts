// src/utils/transform.ts
import type { FamilyMember, FamilyTreeData } from "../types/family";

// your existing function stays the same
export const transformFamilyMember = (data: any): FamilyMember => ({
  _id: data._id,
  name: data.name,
  dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
  dateOfDeath: data.dateOfDeath ? new Date(data.dateOfDeath).toISOString() : undefined,
  age: data.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(data.dateOfBirth).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25)
      )
    : 0,
  gender: data.gender,
  photo: data.photo,
  email: data.email,
  phone: data.phone,
  occupation: data.occupation,
  address: data.address,
  fatherId: data.fatherId,
  motherId: data.motherId,
  spouseId: data.spouseId,
  childrenIds: data.childrenIds || [],
  generation: data.generation,
  side: data.side,
  notes: data.notes,
  isAlive: data.isAlive,
});



/**
 * Builds a nested FamilyTreeData structure from flat FamilyMember[]
 */
export const buildFamilyTree = (members: FamilyMember[]): FamilyTreeData[] => {
  const memberMap: Record<string, FamilyTreeData> = {};

  // Step 1: Create a map of all members
  members.forEach(m => {
    memberMap[m._id] = {
      _id: m._id,
      name: m.name,
      gender: m.gender,
      generation: m.generation,
      side: m.side,
      photo: m.photo,
      dateOfBirth: m.dateOfBirth,
      dateOfDeath: m.dateOfDeath,
      isAlive: m.isAlive,
      children: []
    };
  });

  const roots: FamilyTreeData[] = [];

  // Step 2: Link children to parents
  members.forEach(m => {
    if (m.fatherId && memberMap[m.fatherId]) {
      memberMap[m.fatherId].children!.push(memberMap[m._id]);
    } else if (m.motherId && memberMap[m.motherId]) {
      memberMap[m.motherId].children!.push(memberMap[m._id]);
    } else {
      // No parent → treat as root
      roots.push(memberMap[m._id]);
    }
  });

  return roots;
};
