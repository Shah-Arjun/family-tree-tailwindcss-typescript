import {useState} from 'react'

//components from shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui//avatar';

// lucide react
import { UserPlus } from 'lucide-react'
import type { FamilyMember } from '@/types/family';


const AddMemberForm = () => {

const [formData, setFormData] = useState<FamilyMember>({
  name: "",
  age: 0,
  gender: "unknown",
  fatherId: "",
  motherId: "",
  spouseId: "",
  dateOfBirth: "",
  dateOfDeath: "",
  generation: 0,
  side: "current",
  email: "",
  phone: "",
  address: "",
  photo: "",
  childrenIds: [],
  isAlive: true,
});



// function to get first letter of name and cast
// const getInitials = (name: String) => {
//   name.split(' ').map((n) => n[0]).join('').toUpperCase();
// }

  return (
    <Card className='max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>
          <UserPlus className='w-6 h-6' />
          <span>Add New Family Member</span>
        </CardTitle>
        <p className='text-muted-foreground'>Fill in the details to add a new member to your family tree.</p>
      </CardHeader>


      <CardContent>
        <form className="space-y-6">

          {/* Profile section */}
          <div className="space-y-4">
            <h3 className='text-lg font-semibold border-b pb-2'>Profilr Information</h3>

            <div className="flex items-start space-x-6">
              {/* Avatar + Photo uploads */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className='w-20 h-20' />
                <AvatarImage src={formData.photo} alt={formData.name} />
                <AvatarFallback>
                  {formData?.name?.[0] ?? "?"}
                </AvatarFallback>
              </div>
            </div>
          </div>





        </form>
      </CardContent>




    </Card>
  )
}

export default AddMemberForm
