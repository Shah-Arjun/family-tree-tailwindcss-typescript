import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth';

//components from shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';

// lucide react
import { Calendar, Upload, UserPlus, Mail, Phone, Briefcase, MapPin, FileText } from 'lucide-react'

//types
import type { FamilyMember } from '@/types/family';

//services
import { memberServices } from "@/services/memberServices";


//typescript interface for type validation
interface AddMemberFormProps {
  // members: FamilyMember[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  onCancel?: () => void;
}

export const AddMemberForm: React.FC<AddMemberFormProps> = ({
  //members, 
  onAddMember,
  onCancel
}) => {

  const [formData, setFormData] = useState<FamilyMember>({
    name: "",
    _id: "",
    age: 0,
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    fatherId: "",
    motherId: "",
    spouseId: "",
    dateOfBirth: "",
    dateOfDeath: "",
    generation: 0,
    side: 'current' as 'paternal' | 'maternal' | 'current',
    email: "",
    phone: "",
    address: "",
    occupation: "",
    photo: "",
    childrenIds: [],
    isAlive: true,
    notes: "",
  });


  // to handle input change in form input fields when user types
  const handleInputChange = (
    field: keyof FamilyMember,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,                  // keep the old data
      [field]: value,          // update only the changed field 
    }))
  }


  // for photo upload feature
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file));  // preview file
    }
  };


  //to fetch members from backend  
  const [fetchedMembers, setFetchedMembers] = useState<FamilyMember[]>([]);
  const { user } = useAuth()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if(!user){
          console.log("No user found")
          return
        }


        const res = await memberServices.getMembersByUser(); // axios call

        console.log('members fetched:', res)  //for test
        setFetchedMembers(res);

      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };
    fetchMembers();   //calling function immediately
  }, []);

  const availableParents = fetchedMembers.filter(m => {
    const gender = m.gender?.toLowerCase();
    return gender === 'male' || gender === 'female'
  }
  );

  const availableFathers = availableParents.filter((m) => m.gender?.toLowerCase() === "male");
  const availableMothers = availableParents.filter((m) => m.gender?.toLowerCase() === "female");

  const availableSpouses = fetchedMembers.filter(m =>
    
    !m.spouseId &&

    m.gender !== formData.gender
  );


  // when add member button is clicked ie. form submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required!");
      return;
    }


    // Build FormData if photo exists
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("generation", formData.generation.toString());
    formDataToSend.append("isAlive", String(formData.isAlive));
    formDataToSend.append("side", formData.side);
    if (formData.dateOfBirth) formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    if (formData.dateOfDeath) formDataToSend.append("dateOfDeath", formData.dateOfDeath);
    if (formData.fatherId && formData.fatherId !== "none") {
      formDataToSend.append("fatherId", formData.fatherId);
    }
    if (formData.motherId && formData.motherId !== "none") {
      formDataToSend.append("motherId", formData.motherId);
    }
    if (formData.spouseId && formData.spouseId !== "none") {
      formDataToSend.append("spouseId", formData.spouseId);
    }

    if (formData.email) formDataToSend.append("email", formData.email);
    if (formData.phone) formDataToSend.append("phone", formData.phone);
    if (formData.address) formDataToSend.append("address", formData.address);
    if (formData.notes) formDataToSend.append("notes", formData.notes);

    // Append file
    if (photo) formDataToSend.append("photo", photo);

    try {
      const savedMember = await memberServices.addMember(formDataToSend, true);
      alert("Member added successfully!");


      // re-fetch members so dropdown updates
const updatedMembers = await memberServices.getMembersByUser();
setFetchedMembers(updatedMembers);


      if(onAddMember) {
        onAddMember(savedMember)
      }

      //reset form after submission
      setFormData({
        name: "",
        _id: "",
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
        notes: "",
      });
      setPhoto(null);
      setPreview(null);
    } catch (err: any) {
      console.error("❌ Error adding member:", err.response?.data || err.message);
      alert("Error adding member: " + (err.response?.data?.error || err.message));
      return;
    }
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
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-lg text-left font-semibold border-b border-muted-foreground pb-2">Profile Information</h3>

            <div className="flex items-start space-x-6">

              {/* profile section-left */}
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={preview || formData.photo} alt={formData.name} />
                  <AvatarFallback>
                    {formData?.name ? formData.name[0].toUpperCase() : <UserPlus className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                {/* file input- hidden */}
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                  id='photoUpload'
                />
                <label htmlFor="photoUpload">
                  <Button type="button" variant="outline" size="sm" className="flex items-center space-x-1" onClick={() => document.getElementById("photoUpload")?.click()}>
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </Button>
                </label>
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

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor='isAlive'>Is Alive</Label>
                    <Switch
                      className='border-muted-foreground'
                      id="isAlive"
                      checked={formData.isAlive}
                      onCheckedChange={(checked) => handleInputChange('isAlive', checked)}
                    />
                  </div>
                  {!formData.isAlive && (
                    <Input
                      type='date'
                      value={formData.dateOfDeath}
                      onChange={(e) => handleInputChange('dateOfDeath', e.target.value)}
                      placeholder='Date of Death'
                    />
                  )}
                </div>


              </div>   {/* profile section-right */}
            </div>
          </div>   {/*profile section */}


          {/* Contact & Personal info section */}
          <div className="space-y-4">
            <h3 className="text-lg text-left font-semibold border-b border-muted-foreground pb-2">Contact & Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+977 9800000000"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="occupation" className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Occupation</span>
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Job title or profession"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="City, State/Country"
                />
              </div>

            </div>
          </div>   {/*contact section */}


          {/* Family Relationship section */}
          <div className="space-y-2">
            <h3 className='text-lg text-left font-semibold border-b border-muted-foreground pb-2'>Family Relationship</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="text-left space-y-2">
                <Label htmlFor='side'>Family Side</Label>
                <Select value={formData.side} onValueChange={(value) => handleInputChange('side', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='current'>Current Family</SelectItem>
                    <SelectItem value='paternal'>Paternal Family</SelectItem>
                    <SelectItem value='maternal'>Maternal Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-left space-y-2">
                <Label htmlFor="generation">Generation</Label>
                <Select value={formData.generation.toString()} onValueChange={(value) => handleInputChange('generation', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select generation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Grandparents (+2)</SelectItem>
                    <SelectItem value="1">Parents (+1)</SelectItem>
                    <SelectItem value="0">Current (0)</SelectItem>
                    <SelectItem value="-1">Children (-1)</SelectItem>
                    <SelectItem value="-2">Grandchildren (-2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-left space-y-2">
                <Label htmlFor="father">Father</Label>
                <Select value={formData.fatherId} onValueChange={(value) => handleInputChange('fatherId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select father" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No father selected</SelectItem>
                    {availableFathers.map((father) => (
                      <SelectItem key={father._id} value={father._id}>
                        {father.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-left space-y-2">
                <Label htmlFor="mother">Mother</Label>
                <Select value={formData.motherId} onValueChange={(value) => handleInputChange('motherId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mother" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No mother selected</SelectItem>
                    {availableMothers.map((mother) => (
                      <SelectItem key={mother._id} value={mother._id}>
                        {mother.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-left space-y-2">
                <Label htmlFor="spouse">Spouse</Label>
                <Select value={formData.spouseId} onValueChange={(value) => handleInputChange('spouseId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spouse" />
                  </SelectTrigger>
                  <SelectContent>
                  {availableSpouses.length === 0 ? (
                    <SelectItem value='nane'>No available spouses</SelectItem>
                  ) : (
                    availableSpouses.map((spouse) => (
                      <SelectItem key={spouse._id} value={spouse._id}>
                        {spouse.name}
                      </SelectItem>
                    ))
                  )}
                  </SelectContent>
                </Select>
              </div>

            </div>

          </div>  {/*family rel section */}



          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg text-left font-semibold border-b border-muted-foreground pb-2">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information about this family member..."
                rows={3}
                className='border-muted-foreground'
              />
            </div>
          </div>


          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-muted-foreground">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Family Member</span>
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}

export default AddMemberForm;
