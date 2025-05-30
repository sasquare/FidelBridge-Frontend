import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-sage shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-white hover:text-cream transition-colors">
            <Link to="/">FidelBridge</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <div
            className={`md:flex items-center space-x-4 ${
              isOpen ? "block" : "hidden"
            } md:block`}
          >
            <Link
              to="/"
              className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/request"
              className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
            >
              Request
            </Link>
            <Link
              to="/messages"
              className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
            >
              Messages
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
                >
                  Profile
                </Link>
              </>
            )}
            {user ? (
              <button
                onClick={logout}
                className="block md:inline-block bg-sageDark text-white px-4 py-2 rounded-md hover:bg-blue-100 hover:scale-105 active:bg-gray-300 transition duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block md:inline-block text-white hover:bg-blue-100 hover:scale-105 active:bg-gray-300 py-2 px-4 md:py-0 rounded-md transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
