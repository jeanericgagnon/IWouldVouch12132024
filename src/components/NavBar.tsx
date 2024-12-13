import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Menu, Settings, LogOut, Star, Briefcase, X } from 'lucide-react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from '../hooks/useAuth';
import { useAuthNavigation } from '../context/AuthNavigationContext';
import { mockUsers } from '../data/mockData';
import { useDebounce } from '../hooks/common/useDebounce';

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { isAuthenticated, signOut, user } = useAuth();
  const { navigateToAuth } = useAuthNavigation();
  const navigate = useNavigate();

  const handleWriteRecommendation = () => {
    if (!isAuthenticated) {
      navigateToAuth('sign-in', '/write-recommendation');
    } else {
      navigate('/write-recommendation');
    }
    setIsMobileMenuOpen(false);
  };

  const searchResults = debouncedQuery
    ? mockUsers.filter(user => 
        user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.currentCompany?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.location?.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  const handleUserSelect = (userId: string) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Star className="h-4 w-4" />
              <Briefcase className="h-4 w-4 -ml-2" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:inline">
              IWouldVouch
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, title, company, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="pl-10 pr-10 bg-muted/50 focus:bg-background"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => {
                    setSearchQuery('');
                    setShowResults(false);
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur from closing before click
              >
                <ScrollArea className="max-h-[400px]">
                  <div className="p-2 space-y-2">
                    {searchResults.map((user) => (
                      <Card
                        key={user.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleUserSelect(user.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              {user.title && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {searchQuery && searchResults.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No users found matching "{searchQuery}"
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost"
              onClick={handleWriteRecommendation}
              className="font-medium"
            >
              Write Recommendation
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={() => navigateToAuth('sign-in')}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigateToAuth('sign-up')}
                  className="bg-[#52789e] hover:bg-[#6b9cc3]"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </nav>
      </div>

      {/* Click outside handler for search results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="ghost"
              onClick={handleWriteRecommendation}
              className="w-full justify-start"
            >
              Write Recommendation
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate(`/profile/${user?.id}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/settings');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigateToAuth('sign-in');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    navigateToAuth('sign-up');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#52789e] hover:bg-[#6b9cc3]"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}