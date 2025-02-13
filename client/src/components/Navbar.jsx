import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { checkUser, fetchUserData, logOutUser } from '../Store/patient/authslice';

const Navbar = () => {
  const dispatch = useDispatch();
  const isloggedIN = useSelector((state) => state.auth.isAuthenticated); // Ensure your reducer stores this correctly
  const patientData = useSelector((state) => state.auth.patientData);
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkUser());
    if (isloggedIN) {
      dispatch(fetchUserData());
    }
  }, [dispatch, isloggedIN]);

  const handleLogout = async () => {
    await dispatch(logOutUser());
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  const nevigateToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const navbarHeight = 80; // Height of your navbar (20 * 4 = 80px)
      const topOffset = aboutSection.offsetTop - navbarHeight;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      setIsMenuOpen(false); // Close mobile menu if open
    }
  };
  return (
    <div className="bg-[#d4e8db] flex justify-between items-center px-6 sm:px-12 lg:px-24 w-full h-20 fixed top-0 left-0 z-30" data-aos="zoom-in-up">
      {/* Logo */}
      <div className="text-2xl sm:text-3xl font-bold text-green-700 w-full text-center md:text-left md:w-auto">
        HealWell
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 lg:space-x-12 items-center text-base font-semibold">
        <ul className="flex space-x-4 lg:space-x-8">
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <Link to='#about' onClick={nevigateToAbout}>About</Link>
          </li>
          <li className="hover:text-green-800 transition duration-300">
            <Link to="/contact">Contact</Link>
          </li>
          {isloggedIN && <li className="hover:text-green-800 transition duration-300">
            {
              patientData?.doctorId ? (
                <Link to="/doctor-panel">Dashboard</Link>
              ) : (
                <Link to="/patient-panel">Dashboard</Link>
              )
            }
          </li>}
        </ul>
        {isloggedIN ? (
          <button
            onClick={handleLogout}
            className="bg-green-500 text-white py-2 px-4 rounded-full"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-green-500 text-white py-2 px-4 rounded-full">
              Login/SignUp
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-green-700 text-3xl"
          aria-label="Open Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full bg-[#ebf8ef] shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-green-700 text-3xl absolute top-4 right-4"
          aria-label="Close Menu"
        >
          ✕
        </button>

        {/* Menu Items */}
        <div className="flex flex-col items-center space-y-6 pt-16">
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
            to="#about"
            className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300"
            onClick={() => { setIsMenuOpen(false), scrollToAbout() }}
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
          {isloggedIN && <li className="text-lg font-semibold text-green-700 hover:text-green-800 transition duration-300">
            {
              patientData?.doctorId ? (
                <Link to="/doctor-panel">Dashboard</Link>
              ) : (
                <Link to="/patient-panel">Dashboard</Link>
              )
            }
          </li>}
          {isloggedIN ? (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full mt-4"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-full mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Login/SignUp
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;