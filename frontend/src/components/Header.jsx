import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Leaf className="h-7 w-7 text-green-600" />
          <span className="text-2xl font-bold text-brown-700">KisanMitra</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-green-600 transition-colors text-lg"
            >
                Home
              
            </button>
          <button
            onClick={() => navigate("/features")}
            className="text-gray-700 hover:text-green-600 transition-colors text-lg"
          >
            Features
          </button>
          <button
            onClick={() => navigate("/about")}
            className="text-gray-700 hover:text-green-600 transition-colors text-lg"
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="text-gray-700 hover:text-green-600 transition-colors text-lg"
          >
            Contact
          </button>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
            >
              Register
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700">
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-5 bg-white border-t animate-fade-in">
          <nav className="flex flex-col space-y-5">
            <button
              onClick={() => { navigate("/features"); toggleMobileMenu(); }}
              className="text-gray-700 hover:text-green-600 transition-colors text-lg"
            >
              Features
            </button>
            <button
              onClick={() => { navigate("/about"); toggleMobileMenu(); }}
              className="text-gray-700 hover:text-green-600 transition-colors text-lg"
            >
              About Us
            </button>
            <button
              onClick={() => { navigate("/testimonials"); toggleMobileMenu(); }}
              className="text-gray-700 hover:text-green-600 transition-colors text-lg"
            >
              Success Stories
            </button>
            <button
              onClick={() => { navigate("/contact"); toggleMobileMenu(); }}
              className="text-gray-700 hover:text-green-600 transition-colors text-lg"
            >
              Contact
            </button>
            <button
              onClick={() => { navigate("/login"); toggleMobileMenu(); }}
              className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-50 transition w-full"
            >
              Login
            </button>
            <button
              onClick={() => { navigate("/register"); toggleMobileMenu(); }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition w-full"
            >
              Register
            </button>
            {/* <button
              onClick={() => { navigate("/get-started"); toggleMobileMenu(); }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 transition w-full"
            >
              Get Started
            </button> */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
