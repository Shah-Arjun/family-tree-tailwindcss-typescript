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

// 🔑 New helper: convert FamilyMember[] → FamilyTreeData
export function buildFamilyTree(members: FamilyMember[]): FamilyTreeData[] {
  const map: Record<string, FamilyTreeData> = {};

  // Step 1: make a map of _id -> FamilyTreeData
  members.forEach((m) => {
    map[m._id] = {
      _id: m._id,
      name: m.name,
      gender: m.gender,
      generation: m.generation,
      side: m.side,
      photo: m.photo,
      dateOfBirth: m.dateOfBirth,
      dateOfDeath: m.dateOfDeath,
      isAlive: m.isAlive,
      children: [],
    };
  });

  const roots: FamilyTreeData[] = [];

  // Step 2: connect children to their parents
  members.forEach((m) => {
    const node = map[m._id];
    if (m.fatherId && map[m.fatherId]) {
      map[m.fatherId].children!.push(node);
    } else if (m.motherId && map[m.motherId]) {
      map[m.motherId].children!.push(node);
    } else {
      // No parent → treat as root
      roots.push(node);
    }
  });

  return roots; // could be one root or multiple
}
