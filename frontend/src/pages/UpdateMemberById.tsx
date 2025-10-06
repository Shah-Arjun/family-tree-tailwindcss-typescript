import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// icons
import { ArrowLeft, Upload, UserPlus } from "lucide-react";

// types
import type { FamilyMember } from "@/types/family";

// services
import { memberServices } from "@/services/memberServices";
import Navigation from "@/components/Navigation";

interface UpdateMemberFormProps {
  onUpdated?: (updated: FamilyMember) => void;
}

export const UpdateMemberById: React.FC<UpdateMemberFormProps> = ({ onUpdated }) => {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FamilyMember | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);


  const navigate = useNavigate()

  // Fetch current member
  useEffect(() => {
    const fetchMember = async () => {
      try {
        if (!id) return;
        const res = await memberServices.getMemberById(id);
        setFormData(res);
        console.log(res)
        setPreview(res.photo || null);
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return <p className="text-center">Loading member...</p>;
  if (!formData) return <p className="text-center text-red-500">Member not found.</p>;

  const handleInputChange = (
    field: keyof FamilyMember,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData?._id) return;

      let payload: FormData | Partial<FamilyMember>;

      if (photo) {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formDataToSend.append(key, String(value));
          }
        });
        formDataToSend.append("photo", photo);
        payload = formDataToSend;
      } else {
        payload = formData;
      }

      const updatedMember = await memberServices.updateMember(
        formData._id,
        payload
      );

      alert("Member updated successfully!");
      if (onUpdated) onUpdated(updatedMember);
    } catch (err: any) {
      console.error("❌ Error updating member:", err);
      alert(
        "Error updating member: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <>
    <Navigation  />


    <div className="flex flex-col items-start">
    {/* back arrow button */}
      <Button variant="ghost"
        onClick={() => navigate('/family-tree')}
        className="mb-4 text-muted-foreground hover:text-foreground mt-4 mx-auto"
      >
      <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

    <Card className="max-w-4xl mx-auto border-muted-foreground">
      <CardHeader className="items-start text-left">
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <UserPlus className="w-6 h-6" />
          <span>Update Family Member</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-muted-foreground pb-2">Profile</h3>
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={preview || formData.photo} alt={formData.name} />
                  <AvatarFallback>{formData.name ? formData.name[0].toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="photoUpload" />
                <label htmlFor="photoUpload">
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("photoUpload")?.click()}>
                    <Upload className="w-3 h-3" /> Upload Photo
                  </Button>
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={e => handleInputChange("name", e.target.value)} required />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={v => handleInputChange("gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dateOfBirth || ""} onChange={e => handleInputChange("dateOfBirth", e.target.value)} />
                </div>
                <div>
                  <Label>Is Alive</Label>
                  <Switch checked={formData.isAlive} onCheckedChange={checked => handleInputChange("isAlive", checked)} />
                  {!formData.isAlive && (
                    <Input type="date" value={formData.dateOfDeath || ""} onChange={e => handleInputChange("dateOfDeath", e.target.value)} placeholder="Date of Death" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-muted-foreground pb-2">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input value={formData.email || ""} onChange={e => handleInputChange("email", e.target.value)} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={formData.phone || ""} onChange={e => handleInputChange("phone", e.target.value)} />
              </div>
              <div>
                <Label>Occupation</Label>
                <Input value={formData.occupation || ""} onChange={e => handleInputChange("occupation", e.target.value)} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={formData.address || ""} onChange={e => handleInputChange("address", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes || ""} onChange={e => handleInputChange("notes", e.target.value)} rows={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-muted-foreground">
            <Button type="submit" className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" /> Update Member
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
    </>
  );
};

export default UpdateMemberById;
