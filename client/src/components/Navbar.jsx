import React, { useState } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

  return (
    <div className="bg-[#ebf8ef] flex justify-between items-center px-8 sm:px-16 md:px-32 pt-4 fixed top-0 left-0 w-full z-50 ">
      {/* Logo */}
      <div className="text-5xl font-bold text-green-700">
        HealCare
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-16 justify-center items-center text-lg font-semibold">
        <ul className="flex space-x-16">
          <li className="hover:text-green-800 transition duration-300">
            <a href="#home">Home</a>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <a href="#services">Services</a>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <a href="#about">About</a>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button className="bg-green-500 text-white p-2 rounded-full">
          Login/SignUp
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-green-700 text-3xl"
        >
          {isMenuOpen ? 'X' : '☰'} {/* Toggle between menu icon and close icon */}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden absolute top-0 right-0 bg-white w-64 h-full shadow-lg flex flex-col items-center space-y-8 pt-12`}
      >
        <a href="#home" className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300">
          Home
        </a>
        <a href="#services" className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300">
          Services
        </a>
        <a href="#about" className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300">
          About
        </a>
        <a href="#contact" className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300">
          Contact
        </a>
        <button className="bg-green-500 text-white p-2 rounded-full mt-4">Login/SignUp</button>
      </div>
    </div>
  );
};

export default Navbar;
