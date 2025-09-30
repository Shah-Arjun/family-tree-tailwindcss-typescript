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
  const spousePairs: Record<string, FamilyTreeData> = {};
  const visitedSpouses = new Set<string>();

  // Step 1: Convert FamilyMember → FamilyTreeData (without relations)
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

  // Step 2: Create spouse pairs
  members.forEach((m) => {
    if (
      m.spouseId &&
      memberMap[m.spouseId] &&
      !visitedSpouses.has(m._id) &&
      !visitedSpouses.has(m.spouseId)
    ) {
      const spouse = memberMap[m.spouseId];

      const pairId = `pair-${m._id}-${spouse._id}`;
      const pairNode: FamilyTreeData = {
        _id: pairId,
        name: `${m.name} ❤️ ${spouse.name}`,
        gender: "unknown",
        generation: Math.min(m.generation, spouse.generation),
        side: "current",
        isAlive: true,
        children: [],
        isSpousePair: true,
        spouses: [memberMap[m._id], spouse],
      };

      spousePairs[pairId] = pairNode;
      memberMap[pairId] = pairNode;

      visitedSpouses.add(m._id);
      visitedSpouses.add(m.spouseId);

      // Attach children to pair
      const childrenIds = new Set([...(m.childrenIds || []), ...(members.find(x => x._id === m.spouseId)?.childrenIds || [])]);
      childrenIds.forEach((cid) => {
        if (memberMap[cid]) {
          pairNode.children.push(memberMap[cid]);
        }
      });

      // If no parents for either spouse, treat pair as root
      if (!m.fatherId && !m.motherId) {
        if (!(members.find(x => x._id === m.spouseId)?.fatherId) && !(members.find(x => x._id === m.spouseId)?.motherId)) {
          roots.push(pairNode);
        }
      }
    }
  });

  // Step 3: Link parents/children for non-paired members
  members.forEach((m) => {
    if (visitedSpouses.has(m._id)) return; // skip paired spouses

    let hasParent = false;

    if (m.fatherId && memberMap[m.fatherId]) {
      memberMap[m.fatherId].children.push(memberMap[m._id]);
      hasParent = true;
    }

    if (m.motherId && memberMap[m.motherId]) {
      memberMap[m.motherId].children.push(memberMap[m._id]);
      hasParent = true;
    }

    if (m.childrenIds?.length > 0) {
      m.childrenIds.forEach((cid) => {
        if (memberMap[cid]) {
          memberMap[m._id].children.push(memberMap[cid]);
        }
      });
    }

    if (!hasParent) {
      roots.push(memberMap[m._id]);
    }
  });

  return roots.length > 1
    ? [
        {
          _id: "root",
          name: "Family Roots",
          gender: "unknown",
          generation: 0,
          side: "current",
          isAlive: true,
          children: roots,
        },
      ]
    : roots;
};



