import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            Volodymyr Shcherbyna
          </Link>
          <div className="flex gap-8">
            <NavLink 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Blog
            </NavLink>
            <NavLink 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary font-medium"
            >
              Contact
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
