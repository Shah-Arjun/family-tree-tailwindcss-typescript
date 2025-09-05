import { useEffect, useMemo, useState } from "react";

//ui components from shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'


// icons from lucide-react
import { UserCheck, Users, UserX, Search, SortAsc, SortDesc, UserPlus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { FamilyMember } from "@/types/family";
import { memberServices } from "@/services/memberServices";
import { MemberCard } from '@/components/MemberCard'

//member cars props
interface MembersListProps {
  members: FamilyMember[];
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void;
  onAddMember?: () => void;
}



export const MembersList: React.FC<MembersListProps> = ({
  members: initialMembers,
  onEdit,
  onDelete,
  onAddMember
}) => {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [loading, setLoading] = useState(true);

  //hook for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  //for search member functionality
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
        (member.occupation || '').toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
        (member.address || '').toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());

      const matchesSide = sideFilter === 'all' || member.side === sideFilter;
      const matchesGender = genderFilter === 'all' || member.gender === genderFilter;
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'alive' && member.isAlive) ||
        (statusFilter === 'deceased' && !member.isAlive);

      return matchesSearch && matchesSide && matchesGender && matchesStatus;
    });

    // sort members functionality
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLocaleLowerCase();
          bValue = b.name.toLocaleLowerCase();
          break;
        case 'age':
          aValue = a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0;
          bValue = b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0;
          break;
        case 'generation':
          aValue = a.generation;
          bValue = b.generation;
          break;
        default:
          aValue = a.name.toLocaleLowerCase();
          bValue = b.name.toLocaleLowerCase();
      }
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;   // -1 ==> means a comes befor b,    1 ==> means b comes before a,   0 ==> equal
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;   //
      }
    });
    return filtered;

  }, [members, searchTerm, sideFilter, genderFilter, statusFilter, sortBy, sortOrder]);

  //to change the sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };




  //to fetch members from backend  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await memberServices.getMembers(); // axios service
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);


  //for showing the count 
  const stats = useMemo(() => {
    return {
      total: members.length,
      paternal: members.filter(m => m.side === 'paternal').length,
      maternal: members.filter(m => m.side === 'maternal').length,
      current: members.filter(m => m.side === 'current').length,
      alive: members.filter(m => m.isAlive).length,
      deceased: members.filter(m => !m.isAlive).length,
      male: members.filter(m => m.gender === 'male').length,
      female: members.filter(m => m.gender === 'female').length,
    };
  }, [members]);




  return (
    <div className='space-y-6'>

      {/* header with statistic/stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className='text-2xl font-bold flex items-center space-x-2'>
                <Users className='w-6 h-6' />
                <span>Family Members</span>
              </CardTitle>
              <p className='text-muted-foreground mt-1'>
                Manage and browse your family tree members
              </p>
            </div>
            {onAddMember && (
              <Button onClick={onAddMember} className='flex items-center space-x-2'>
                <UserCheck className='w-4 h-4' />
                <span>Add Member</span>
              </Button>
            )}
          </div>

          {/* statistic / stats */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant='outline' className='flex items-center space-x-1'>
              <Users className='w-3 h-3' />
              <span>Total: {stats.total}</span>
            </Badge>

            <Badge variant='outline' className='bg-family-paternal/10 text-family-paternal border-family-paternal'>
              Paternal: {stats.paternal}
            </Badge>

            <Badge variant='outline' className='bg-family-maternal/10 text-family-maternal border-family-maternal'>
              Maternal: {stats.maternal}
            </Badge>

            <Badge variant='outline'>
              Current: {stats.current}
            </Badge>

            <Badge variant='outline' className='text-green-600 border-gray-600'>
              <UserPlus className="w-3 h-3 mr-1" />
              Avtive: {stats.alive}
            </Badge>

            <Badge variant='outline' className='text-red-600 border-gray-600'>
              <UserX className="w-3 h-3 mr-1" />
              Deceased: {stats.deceased}
            </Badge>
          </div>
        </CardHeader>
      </Card>



      {/* filter and search section */}
      <Card>
        <CardContent className='p-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input placeholder='Search members...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10' />
            </div>

            <Select value={sideFilter} onValueChange={setSideFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Family Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Sides</SelectItem>
                <SelectItem value='paternal'>Paternal</SelectItem>
                <SelectItem value='maternal'>Maternal</SelectItem>
                <SelectItem value='current'>Current</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Gender</SelectItem>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='unknown'>Unknown</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='alive'>Alive</SelectItem>
                <SelectItem value='deceased'>Deceased</SelectItem>
              </SelectContent>
            </Select>


            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='flex-1'>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='age'>Age</SelectItem>
                  <SelectItem value='generation'>Generation</SelectItem>
                </SelectContent>
              </Select>

              {/* toggle button for sort by date in ascending or descending order  */}
              <Button variant='outline' size='sm' className='px-3' onClick={toggleSortOrder} >
                {sortOrder === 'asc' ? <SortAsc className='w-4 h-4' /> : <SortDesc className='w-4 h-4' />}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>


      {/*Search Results--- data from db */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredAndSortedMembers.length} member{filteredAndSortedMembers.length !== 1 ? 's' : ''} found
          </h3>
        </div>

        {filteredAndSortedMembers.length === 0 ?
          (
            <Card>
              <CardContent className='text-center py-12'>
                <Users className='w-12 h-12 text-muted-foreground mx-auto mg-4' />
                <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
                  No members found
                </h3>
                <p className='text-muted-foreground'>
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAndSortedMembers.map((member) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  compact                     //or compact={true}
                ></MemberCard>
              ))}
            </div>
          )
        }

      </div>



      {/* backend members------------------for debug------------- */}
      {/* <div className="space-y-6">
      <Card>
        <CardContent>
          {loading ? (
            <p>Loading members...</p>
          ) : members.length === 0 ? (
            <p>No members exist.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m._id}
                  className="p-3 border rounded-lg flex justify-between"
                >
                  <span>
                    <strong>{m.name}</strong> – {m.gender} / {m.side}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {m.isAlive}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div> */}


    </div>
  )
}

export default MembersList
