import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CampusEvents
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/#about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/#contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
