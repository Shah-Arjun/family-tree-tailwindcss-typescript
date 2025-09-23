import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

//to show the bumber fo mombers in db
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { memberServices } from '@/services/memberServices';

import {
  Trees,
  Users,
  UserPlus,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

// TypeScript interface for props that Navigation will receive
interface NavigationProps {
  activeTab: 'tree' | 'members' | 'add';
  onTabChange: (tab: "tree" | "members" | "add") => void;
  memberCount?: number;
}


// uses the NavigationProps interface for strong typing/validation.
export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  // to fetch member and count its number
  const [memberCount, setMemberCount] = useState<number>(0);
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!user) return;

        const members = await memberServices.getMembersByUser();
        setMemberCount(members.length);
      } catch (err) {
        console.error("Failed  to fetch members:", err)
      }
    };
    fetchMembers();
  }, [user])


  // nav-items / menu as an object
  const navItems = [
    {
      id: 'tree',
      label: 'Family Tree',
      icon: Trees,
      description: 'Interactive family tree visualization'
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      description: 'Browse all family members',
    },
    {
      id: 'add',
      label: 'Add Member',
      icon: UserPlus,
      description: 'Add a new family member'
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* tree logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-family rounded-lg flex items-center justify-center">
              <Trees className="w-10 h-10 text-foreground" />
            </div>
            <div>
              <h1 className="hidden text-xl font-bold text-foreground">FamilyTree</h1>
              <p className="hidden text-sm text-muted-foreground">Manage your heritage</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id as 'tree' | 'members' | 'add')}
                  className="relative flex items-center space-x-2 px-4 py-2 shadow-muted-foreground shadow"
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.id === 'members' && (
                    <Badge variant="secondary" className="ml-0 text-xs">
                      {memberCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-2">
            {/* desktop view */}
            <div className='hidden md:flex items-center space-x-2'>
              <User className="w-4 h-4" />
              <span>{user?.name || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className='w-4 h-4' />
              </Button>
            </div>

            {/* mobile view */}
            <div className='md:hidden'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className='p-2 rounded-full hover:bg-muted-foreground'>
                    <User className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className=' flex flex-col justify-end w-44 bg-white shadow-lg rounded-lg border border-gray-200'>
                  <DropdownMenuItem className='flex items-center space-x-2 px-4 py-2 hover:bg-primary/15 rounded-md transition-colors' onClick={() => console.log("Setting Clicked")}>
                    <Settings className='w-4 h-4 text-primary' />
                    <span className='text-sm'>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex items-center space-x-2 px-4 py-2 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors' onClick={logout}>
                    <LogOut className='w-4 h-4 text-red-500' />
                    <span className='text-sm'>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            </div>


          </div>    {/*user menu ends here */}


        </div>
      </div>
    </div>
  );
};
export default Navigation;