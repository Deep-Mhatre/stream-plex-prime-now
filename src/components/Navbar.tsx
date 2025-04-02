
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/90 to-background/60 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-sm font-medium hover:text-primary transition-colors">
              Movies
            </Link>
            <Link to="/tvshows" className="text-sm font-medium hover:text-primary transition-colors">
              TV Shows
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-background/60">
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/login">
            <Button className="rounded-full hidden md:flex">Sign In</Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="rounded-full md:hidden hover:bg-background/60">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
