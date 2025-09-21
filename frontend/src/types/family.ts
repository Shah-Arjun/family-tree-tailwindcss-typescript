// Represents one person in the family tree.
export type FamilyMember = {
  _id: string;
  name: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  photo?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
  
  // Relationships
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  childrenIds: string[];   // ✅ fix: not []

  // Family tree positioning
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  
  // Additional info
  notes?: string;
  isAlive: boolean;
}

// Represents a node in a tree structure for visualizing the family tree.
export interface TreeNodeData {
  _id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  photo?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  isAlive: boolean;
  children: FamilyTreeData[]; // ✅ always defined
}

// FamilyTreeData: recursive structure for the tree
export interface FamilyTreeData {
  _id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  photo?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  isAlive: boolean;
  children: FamilyTreeData[]; // ✅ not optional
}
