// This TypeScript types/definitions file is to define the shape of our data
//  in a strongly typed way, so our React components, services, and functions 
// know exactly what a family member object looks Linke


// Represents one person in the family tree.
// Helps TypeScript check that any object used as a family member has these properties.
// Optional properties (?) may or may not exist (like email, photo).

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
  childrenIds: string[];
  
  // Family tree positioning
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  
  // Additional info
  notes?: string;
  isAlive: boolean;
}



// Represents a node in a tree structure for visualizing the family tree.
// Adds children?: TreeNodeData[] → each node can have multiple children.
// Used when you build a hierarchical tree view.
export interface TreeNodeData {
  name: string;
  _id: string;
  gender: 'male' | 'female' | 'unknown';
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  photo?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  isAlive: boolean;
  children?: TreeNodeData[];
}


// Essentially the same as TreeNodeData but semantically used to represent the entire family tree starting from a root person.
// Each child in children is also FamilyTreeData, so the structure is recursive.
export interface FamilyTreeData {
  name: string;
  _id: string;
  gender: 'male' | 'female' | 'unknown';
  generation: number;
  side: 'paternal' | 'maternal' | 'current';
  photo?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  isAlive: boolean;
  children?: FamilyTreeData[];
}


// Render each member → then render their children → then their grandchildren, etc.