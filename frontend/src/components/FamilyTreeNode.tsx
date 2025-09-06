// this components makes node of each member for tree structure

import type { FamilyTreeData } from '@/types/family';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';


//props for node
interface FamilyTreeNodeProps {
  nodeDatum: FamilyTreeData;          // holds all info about family, required
  onNodeClick?: (nodeData: FamilyTreeData) => void;     //callback when card is clicked, optional
}



export const FamilyTreeNode: React.FC<FamilyTreeNodeProps> = ({
  nodeDatum,
  onNodeClick
}) => {
  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-family-male text-[blue]';
      case 'female': return 'bg-family-female text-[#E75480]';
      default: return 'bg-family-unknown text-white';
    }
  };

  const getSideColor = (side: string) => {
    switch (side) {
      case 'paternal': return 'border-family-paternal';
      case 'maternal': return 'border-family-maternal';
      default: return 'border-primary';
    }
  };


  //fucntion to get initials letter of name
  const getInitials = (name: string) => {
    return name.split(' ')                  // splits into array of words based on spaces -->   ["John", "Doe", "Smith"]
      .map(n => n[0])                         // goes through each word in an array and takes the 1st char---> ["J", "D", "S"]
      .join('')                               // Joins the array of initials into a single string, with no spaces ---> "JDS"
      .toUpperCase();                        // changes into uppercase it in lower case
  };


  // function to extract the year from full date string ,  "1990-05-12" → "1990".
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  };

  return (

    //foreignObject--built-in SVG element
      <foreignObject width="200" height="140" x="-100" y="-70">
        <Card
          className={`w-full h-full cursor-pointer hover:shadow-tree-node transition-all duration-200 border-2 ${getSideColor(nodeDatum.side)}`}
          onClick={() => onNodeClick?.(nodeDatum)}
        >
          <CardContent className="p-3 h-full flex flex-col items-center justify-center space-y-2">
            {/* for avatar */}
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-muted-foreground">   {/*for pic or initials */}
                <AvatarImage src={nodeDatum.photo} alt={nodeDatum.name} />    {/*if photo exist then show photo */}
                <AvatarFallback className={getGenderColor(nodeDatum.gender)}>  {/*else  show initials */}
                  {getInitials(nodeDatum.name)}
                </AvatarFallback>
              </Avatar>

              {/*  shows red dot at top-right if member is deceased */}
              {!nodeDatum.isAlive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-background" />
              )}
            </div>

            {/* for member name and badges */}
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-sm text-foreground truncate w-full">     {/*truncate ---> ensures long names don’t break layout. */}
                {nodeDatum.name}
              </h3>

              {/* shows dob */}
              {nodeDatum.dateOfBirth && (
                <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(nodeDatum.dateOfBirth)}</span>
                  {/* if date of death exist shows in range */}
                  {nodeDatum.dateOfDeath && (
                    <>
                      <span>-</span>
                      <span>{formatDate(nodeDatum.dateOfDeath)}</span>
                    </>
                  )}
                </div>
              )}
              
              {/* for badges */}
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs capitalize">
                  {nodeDatum.side}
                </Badge>
              </div>  
            </div>
          </CardContent>
        </Card>
      </foreignObject>
  );
};