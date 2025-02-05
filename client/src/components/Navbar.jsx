import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import {fetchUserData} from '../Store/patient/authslice'
const Navbar = ({ isPatientPanel }) => {
  const dispatch=useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserData())
    const handleOutsideClick = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  return (
    <div  
      className={`bg-[#d4e8db] flex justify-between items-center px-6 sm:px-12 
      ${isPatientPanel ? "lg:px-8 w-[calc(100%-256px)] ml-64" : "lg:px-24 w-full"} 
      py-4 fixed top-0 left-0 z-50 pt-8 transition-all duration-300`}
    >     {/* Logo */}
      <div className="text-3xl sm:text-4xl font-bold text-green-700">
        HealCare
      </div>

      {/* Desktop Menu */}
      <div className="hidden m:flex space-x-8 lg:space-x-16 justify-center items-center text-base lg:text-lg font-semibold">
        <ul className="flex space-x-6 lg:space-x-12">
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/services">Services</Link>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <Link to="/login">
          <button className="bg-green-500 text-white py-2 px-4 rounded-full">
            Login/SignUp
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex sm:hidden items-center">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-green-700 text-3xl menu-toggle"
          aria-label="Open Menu"
        >
          ☰ {/* Menu icon */}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full bg-[#ebf8ef] shadow-lg transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-green-700 text-3xl absolute top-4 right-4"
          aria-label="Close Menu"
        >
          ✕ {/* Close icon */}
        </button>

        {/* Menu Items */}
        <div className="flex flex-col items-center space-y-8 pt-12">
          <Link
            to="/"
            className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/about"
            className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link to="/login">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Login/SignUp
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;