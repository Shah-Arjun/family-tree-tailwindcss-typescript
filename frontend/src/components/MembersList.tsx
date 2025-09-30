import { useMemo, useState } from "react";

// ui components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// icons
import { Users, UserX, Search, SortAsc, SortDesc, UserPlus, UserCheck } from 'lucide-react'

import type { FamilyMember } from "@/types/family";
import { MemberCard } from '@/components/MemberCard'

// props
interface MembersListProps {
  members?: FamilyMember[];
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void | Promise<void>;
  onAddMember?: () => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members: initialMembers = [],
  onEdit,
  onDelete,
  onAddMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // filter + sort members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = initialMembers.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.occupation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.address || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSide = sideFilter === 'all' || member.side === sideFilter;
      const matchesGender =
        genderFilter === 'all' ||
        (genderFilter === 'unknown' && !member.gender) ||
        member.gender === genderFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'alive' && member.isAlive) ||
        (statusFilter === 'deceased' && !member.isAlive);

      return matchesSearch && matchesSide && matchesGender && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [initialMembers, searchTerm, sideFilter, genderFilter, statusFilter, sortBy, sortOrder]);

  // stats
  const stats = useMemo(() => ({
    total: initialMembers.length,
    paternal: initialMembers.filter(m => m.side === 'paternal').length,
    maternal: initialMembers.filter(m => m.side === 'maternal').length,
    current: initialMembers.filter(m => m.side === 'current').length,
    alive: initialMembers.filter(m => m.isAlive).length,
    deceased: initialMembers.filter(m => !m.isAlive).length,
    male: initialMembers.filter(m => m.gender === 'male').length,
    female: initialMembers.filter(m => m.gender === 'female').length,
  }), [initialMembers]);

  return (
    <div className='space-y-6'>
      {/* header with stats */}
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

          {/* stats badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant='outline'><Users className='w-3 h-3' /> Total: {stats.total}</Badge>
            <Badge variant='outline' className='bg-family-paternal/10 text-[#870082] border-family-paternal'>Paternal: {stats.paternal}</Badge>
            <Badge variant='outline' className='bg-family-maternal/10 text-[#2e0da6] border-family-maternal'>Maternal: {stats.maternal}</Badge>
            <Badge variant='outline'>Current: {stats.current}</Badge>
            <Badge variant='outline' className='text-green-600 border-gray-600'><UserPlus className="w-3 h-3 mr-1" /> Alive: {stats.alive}</Badge>
            <Badge variant='outline' className='text-red-600 border-gray-600'><UserX className="w-3 h-3 mr-1" /> Deceased: {stats.deceased}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* filters */}
      <Card>
        <CardContent className='p-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input placeholder='Search members...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='pl-10' />
            </div>
            <Select value={sideFilter} onValueChange={setSideFilter}>
              <SelectTrigger><SelectValue placeholder="Family Side" /></SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Sides</SelectItem>
                <SelectItem value='paternal'>Paternal</SelectItem>
                <SelectItem value='maternal'>Maternal</SelectItem>
                <SelectItem value='current'>Current</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='unknown'>Unknown</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='alive'>Alive</SelectItem>
                <SelectItem value='deceased'>Deceased</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='flex-1'><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='age'>Age</SelectItem>
                  <SelectItem value='generation'>Generation</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm' className='px-3' onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? <SortAsc className='w-4 h-4' /> : <SortDesc className='w-4 h-4' />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {filteredAndSortedMembers.length} member{filteredAndSortedMembers.length !== 1 ? 's' : ''} found
        </h3>

        {filteredAndSortedMembers.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <Users className='w-12 h-12 text-muted-foreground mx-auto mg-4' />
              <h3 className='text-lg font-semibold text-muted-foreground mb-2'>No members found</h3>
              <p className='text-muted-foreground'>Try adjusting your search criteria or filters.</p>
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
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;
