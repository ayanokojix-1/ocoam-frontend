import { useState } from "react";
import { FaBars, FaTimes, FaHome, FaVideo, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBookAtlas } from "react-icons/fa6";
export default function UserMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  const navItems = [
    { icon: FaHome, label: "Application", path: "/form" },
    { icon: FaVideo, label: "Classes", path: "/classes" }, // Removed hardcoded active
    { icon: FaUsers, label: "Moderator", path: "/moderator" },
    { icon: FaBookAtlas, label: "Library", path: "/library" },
    { icon: FaCog, label: "Profile", path: "/profile" },
  ];

  // Function to check if current path matches nav item path
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-green-200 hover:bg-white transition-all duration-300"
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5 text-green-700" />
        ) : (
          <FaBars className="w-5 h-5 text-green-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-green-600 to-emerald-700 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-2xl font-black text-white tracking-wider drop-shadow-lg mb-2">
              O.C.O.Y.A.M
            </h1>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-sm">
              Students
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActiveRoute(item.path) // Use dynamic check instead of hardcoded active
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-green-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={() => handleNavigation('/logout')}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-200 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300"
            >
              <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}