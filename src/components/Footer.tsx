import { Link } from "react-router-dom";
import { GraduationCap, FileText } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CampusEvents
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Streamlining campus event management for educational institutions worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => {
                    window.location.href = "/#features";
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors story-link"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    window.location.href = "/#about";
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors story-link"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    window.location.href = "/#contact";
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors story-link"
                >
                  Contact
                </button>
              </li>
              <li>
                <a 
                  href="https://drive.google.com/file/d/1StHYKW51qEOb-ROTiPaw9_bDIk0DEdXU/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors story-link flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  Project Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://drive.google.com/file/d/1StHYKW51qEOb-ROTiPaw9_bDIk0DEdXU/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors story-link"
                >
                  Technical Report
                </a>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Faculty Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors story-link">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} CampusEvents - Symbiosis Institute of Technology, Pune. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Developed by: Gargi Mittal, Meet Golani, Aryan Malkani, Yogita Beniwal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

