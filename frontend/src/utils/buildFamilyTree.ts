import type { FamilyMember, FamilyTreeData } from "../types/family";

/**
 * Normalize raw API data into a FamilyMember
 */
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
 * Build a nested FamilyTreeData structure from flat FamilyMember[]
 */
export const buildFamilyTree = (members: FamilyMember[]): FamilyTreeData[] => {
  const memberMap: Record<string, FamilyTreeData> = {};

  // Step 1: Convert FamilyMember → FamilyTreeData
  members.forEach((m) => {
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
      children: [],
    };
  });

  const roots: FamilyTreeData[] = [];

  // Step 2: Link children to parents
  members.forEach((m) => {
    let hasParent = false;

    // Attach to father
    if (m.fatherId && memberMap[m.fatherId]) {
      const parent = memberMap[m.fatherId];
      if (!parent.children.some((c) => c._id === m._id)) {
        parent.children.push(memberMap[m._id]);
      }
      hasParent = true;
    }

    // Attach to mother
    if (m.motherId && memberMap[m.motherId]) {
      const parent = memberMap[m.motherId];
      if (!parent.children.some((c) => c._id === m._id)) {
        parent.children.push(memberMap[m._id]);
      }
      hasParent = true;
    }

    // Attach children if explicitly listed
    if (m.childrenIds?.length > 0) {
      m.childrenIds.forEach((cid) => {
        if (memberMap[cid]) {
          const parent = memberMap[m._id];
          if (!parent.children.some((c) => c._id === cid)) {
            parent.children.push(memberMap[cid]);
          }
        }
      });
    }

    // Step 3: If no parents → treat as root
    if (!hasParent) {
      roots.push(memberMap[m._id]);
    }
  });

  // Step 4: Handle multiple roots (wrap in a virtual root if needed)
  if (roots.length > 1) {
    return [
      {
        _id: "root",
        name: "Family Roots",
        gender: "unknown",      // ✅ required by FamilyTreeData
        generation: 0,          // ✅ root level
        side: "current",        // ✅ neutral side
        photo: undefined,
        dateOfBirth: undefined,
        dateOfDeath: undefined,
        isAlive: true,
        children: roots,
      },
    ];
  }

  return roots;
};
