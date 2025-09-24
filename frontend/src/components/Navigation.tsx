import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

//to show the bumber fo mombers in db
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

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
  memberCount: number;
}




// uses the NavigationProps interface for strong typing/validation.
export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  memberCount,
}) => {
  // to fetch member and count its number
  const { user, logout } = useAuth()


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
              <h1 className="hidden sm:block text-xl font-bold text-foreground">FamilyTree</h1>
              <p className="hidden sm:block text-sm text-muted-foreground">Manage your heritage</p>
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

                <DropdownMenuContent align='end' sideOffset={5} className=' flex flex-col p-1 justify-end w-40 bg-white shadow-lg rounded-lg border border-gray-200'>
                  <DropdownMenuItem className='flex items-center space-x-2 px-4 py-2 mt-2 hover:bg-primary/20 rounded-md transition-colors' onClick={() => console.log("Setting Clicked")}>
                    <Settings className='w-4 h-4 text-primary' />
                    <span className='text-sm'>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex items-center space-x-2 px-4 py-2 mb-2 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors' onClick={logout}>
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