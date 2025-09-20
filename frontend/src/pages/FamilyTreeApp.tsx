import { useState, useEffect } from 'react';
import type { FamilyMember } from '../types/family';
import { Navigation } from '@/components/Navigation';
import { FamilyTree } from '@/components/FamilyTree';
import { MembersList } from '@/components/MembersList';
import { AddMemberForm } from '@/components/AddMemberForm';
import { memberServices } from '@/services/memberServices';
import { buildFamilyTree } from '@/utils/buildFamilyTree';



const FamilyTreeApp = () => {
  const [activeTab, setActiveTab] = useState<'tree' | 'members' | 'add'>('tree');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true)
  const [treeData, setTreeData] = useState<any>(null)

  
//fetch members from through backend + build tree on mount
  useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await memberServices.getMembers();
          setMembers(data)

                  // Transform members → hierarchical tree
          const tree = buildFamilyTree(data);
          setTreeData(tree.length > 0 ? tree[0] : null)
        } catch (err) {
          console.error("Failed to fetch members", err)
        } finally {
          setLoading(false)
        }
      };
      fetchData();
  }, [])


  // Add member and update tree + members list
  const handleAddMember = async (newMember: Omit<FamilyMember, '_id'>) => {
    try {
      const saved = await memberServices.addMember(newMember);
    setMembers(prev => {
      const updated = [...prev, saved]
      setTreeData(buildFamilyTree(updated)[0] || null)
      return updated
    });
    setActiveTab('members')
    } catch (err) {
      console.error("Failed to add member:", err)
    }
  };

  
  const handleEditMember = (member: FamilyMember) => {
    // TODO: Implement edit functionality--- open edit form
    console.log('Edit member:', member);
  };


// Delete member and and update tree + members list
  const handleDeleteMember = async (memberId: string) => {
    try {
      await memberServices.deleteMember(memberId)
      setMembers(prev => {
        const updated = prev.filter(m => m._id !== memberId)
        setTreeData(buildFamilyTree(updated)[0] || null)
        return updated
      });
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  };



  // render content based on tabs
  const renderContent = () => {
    if(loading) return <p>Loading...</p>;

    switch (activeTab) {
      case 'tree':
        return <FamilyTree treeData={treeData} />;
      case 'members':
        return (
          <MembersList
            members={members}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
            onAddMember={() => setActiveTab('add')}
          />
        );
      case 'add':
        return (
          <AddMemberForm
            // members={members}
            onAddMember={handleAddMember}
            onCancel={() => setActiveTab('members')}
          />
        );
      default:
        return <FamilyTree treeData={treeData} />;
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        memberCount={members.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default FamilyTreeApp;