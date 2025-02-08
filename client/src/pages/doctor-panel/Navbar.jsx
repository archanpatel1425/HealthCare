import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../Store/patient/authslice';

const Navbar = ({ sidebarOpen, toggleSidebar }) => {

  const dispatch = useDispatch();

  const { patientData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserData())
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md md:py-3">
      <button onClick={toggleSidebar} className="md:hidden text-gray-700">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <h1 className="text-xl font-semibold text-green-600">Dashboard</h1>
      <div className="relative">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <img
            src={patientData?.profilepic}
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-green-500 shadow-md rounded-lg z-10">
            <Link
              to="/doctor-panel/profile"
              className="flex px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => { setDropdownOpen(false) }}
            >
              <span className="mx-4"><i class="fa-solid fa-user"></i></span><span>Profile</span>
            </Link>
            <button
              className="flex w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
              onClick={() => { setDropdownOpen(false) }}
            >
              <span className="mx-4"><i class="fa-solid fa-right-from-bracket"></i></span><span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
