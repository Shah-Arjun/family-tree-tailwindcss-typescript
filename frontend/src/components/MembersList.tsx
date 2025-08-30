//import React from 'react'
import { useNavigate } from "react-router-dom"; // ✅ import


//ui components from shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'


// icons from lucide-react
import { UserCheck, Users, UserX, Search, SortAsc, SortDesc} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'



export const MembersList = () => {

  //for navigation when add member button is clicked
  const navigate = useNavigate() ;    //initializing navigate

  const handleAddMember = () => {
    navigate("/add-member");
  }




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

           
            {handleAddMember && (
              <Button onClick={handleAddMember} className='flex items-center space-x-2'>
                <UserCheck className='w-4 h-4' />
                <span>Add Member</span>
              </Button>
            )
            }
          </div>

          {/* statistic / stats */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant='outline' className='flex items-center space-x-1'>
              <Users className='w-3 h-3' />
              <span>Total: { }</span>
            </Badge>

            <Badge variant='outline' className='bg-family-parental/10 text-family-parental border-family-parental'>
              Parental: {}
            </Badge>

            <Badge variant='outline' className='bg-family-maternal/10 text-family-maternal border-family-maternal'>
              Maternal: {}
            </Badge>

            <Badge variant='outline'>
              Current: {}
            </Badge>

            <Badge variant='outline' className='text-green-600 border-gray-600'>
              <UserX className="w-3 h-3 mr-1" />
              Deceased: {}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      {/* filter and search section */}
      <Card>
        <CardContent className='p-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className='absolute left-3 top-1/2 transform-translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input placeholder='Search members...' className='pl-10'/>
            </div>

            <Select>
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

            <Select>
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

            <Select>
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
              <Select>
                <SelectTrigger className='flex-1'>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='age'>Age</SelectItem>
                  <SelectItem value='generation'>Generation</SelectItem>
                </SelectContent>
              </Select>

              <Button variant='outline' size='sm' className='px-3' >
                {1 ? <SortAsc className='w-4 h-4'/> : <SortDesc className='w-4 h-4'/>}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>


      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {} member {} found
          </h3>
        </div>

        {1? 
        (
          <Card>
            <CardContent className='text-center py-12'>
              <Users className='w-12 h-12 text-muted-foreground mx-auto mg-4' />
              <h3 className='text-lg font-semibold text-muted-foreground mb-2'>
                No member found
              </h3>
              <p className='text-muted-foreground'>
                Try adjusting your search criteria or filters.
              </p>
            </CardContent>
          </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {}
            </div>
          )
        }

      </div>


    </div>
  )
}

export default MembersList
