import React from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md md:py-4">
      {/* Mobile Menu Toggle */}
      <button onClick={toggleSidebar} className="md:hidden text-gray-700">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Title */}
      <h1 className="text-xl font-semibold text-blue-600">Dashboard</h1>
      {/* Search and Profile */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div className="relative">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg hidden">
            <a
              href="#profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="#logout"
              className="block px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
