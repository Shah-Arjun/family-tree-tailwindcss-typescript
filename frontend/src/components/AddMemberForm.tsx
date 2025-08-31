import { useState } from 'react'

//components from shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui//avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

// lucide react
import { Calendar, Upload, UserPlus } from 'lucide-react'

//types
import type { FamilyMember } from '@/types/family';


export const AddMemberForm = () => {

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


  // to handle input change in form input fields when user types
  const handleInputChange = (field:keyof FamilyMember, value: string | number) => {
    setFormData((prev) => ({
      ...prev,                  // keep the old data
       [field]: value,          // update only the changed field 
      }))
  }


  // function to get first letter of name and cast
  // const getInitials = (name: String) => {
  //   name.split(' ').map((n) => n[0]).join('').toUpperCase();
  // }

  return (
    <Card className="max-w-4xl mx-auto border-muted-foreground">

      <CardHeader className="items-start text-left">
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <UserPlus className="w-6 h-6" />
          <span>Add New Family Member</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Fill in the details to add a new member to your family tree.
        </p>
      </CardHeader>

      <CardContent>
        <form  className="space-y-6">

          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg text-left font-semibold border-b border-muted-foreground pb-2">Profile Information</h3>
            
            <div className="flex items-start space-x-6">

              {/* profile section-left */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.photo} alt={formData.name} />
                  <AvatarFallback>
                    {formData?.name[0] ?? <UserPlus className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm" className="flex items-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                </Button>
              </div>

              {/* profile section-right */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-start w-auto space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="flex flex-col items-start w-auto space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Date of Birth</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>   {/* profile section-right */}
            </div>
          </div>   {/*profile section */}


          {/* Contact & Personal info section */}
          <div className="space-y-4">
            <h3 className="text-lg text-left font-semibold border-b border-muted-foreground pb-2">Contact & Personal Information</h3>
            
          </div>   {/*contact section */}


        </form>
      </CardContent>
    </Card>
  );
}

export default AddMemberForm;
