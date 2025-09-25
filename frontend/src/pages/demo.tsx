// import { useState } from 'react';
// import type { FamilyMember } from '../types/family';
// import { mockFamilyMembers, mockTreeData } from '@/components/data/mockFamily';
// import { Navigation } from '@/components/Navigation';
// import { FamilyTree } from '@/components/FamilyTree';
// import { MembersList } from '@/components/MembersList';
// import { AddMemberForm } from '@/components/AddMemberForm';



// const FamilyTreeApp = () => {
//   const [activeTab, setActiveTab] = useState('tree');
//   const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);

//   const handleAddMember = (newMember: Omit<FamilyMember, 'id'>) => {
//     const id = `member-${Date.now()}`;
//     setMembers(prev => [...prev, { ...newMember, id }]);
//   };

//   const handleEditMember = (member: FamilyMember) => {
//     // TODO: Implement edit functionality
//     console.log('Edit member:', member);
//   };

//   const handleDeleteMember = (memberId: string) => {
//     setMembers(prev => prev.filter(m => m._id !== memberId));
//   };


//   const renderContent = () => {
//     switch (activeTab) {
//       case 'tree':
//         return <FamilyTree treeData={mockTreeData} />;
//       case 'members':
//         return (
//           <MembersList
//             members={members}
//             onEdit={handleEditMember}
//             onDelete={handleDeleteMember}
//             onAddMember={() => setActiveTab('add')}
//           />
//         );
//       case 'add':
//         return (
//           <AddMemberForm
//             // members={members}
//             // onAddMember={handleAddMember}
//             onCancel={() => setActiveTab('members')}
//           />
//         );
//       default:
//         return <FamilyTree treeData={mockTreeData} />;
//     }
//   };



//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         // memberCount={members.length}
//       />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// export default FamilyTreeApp;



import { Trees } from 'lucide-react'

export default function Demo() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-background text-foreground gap-5 animate-pulse '>
            <Trees className='w-20 h-20 text-foreground' />
            <h1 className='text-5xl'>Comming Soon...</h1>
        </div>
    )
}

 