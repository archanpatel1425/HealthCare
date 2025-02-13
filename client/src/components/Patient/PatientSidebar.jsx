import { Calendar, Clipboard, Cross, FileText, Heart, Home, Menu, Stethoscope, X, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(""); // Track the active link
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const links = [
    { name: "Dashboard", icon: <Home size={22} />, path: "" },
    { name: "Book Appointment", icon: <Calendar size={22} />, path: "/book-appointment" },
    { name: "Skin Checker", icon: <Stethoscope size={22} />, path: "/skin-checker" },
    { name: "Skin Cancer", icon: <Heart size={22} />, path: "/skin-cancer" },
    { name: "Prescriptions", icon: <Clipboard size={22} />, path: "/prescriptions" },
    { name: "Profile", icon: <User size={22} />, path: "/profile" },
  ];

  return (
    < >
    <div data-aos="zoom-in-up">

      {/* Toggle Button */}
      <button
        className={`md:hidden absolute top-4 ${sidebarOpen ? "left-20" : "left-4"} bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center hover:bg-green-700 transition-all`}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-16 bg-gradient-to-b z-40 from-green-800 to-green-500 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <nav className="lg:pt-6 md:pt-6 pt-24 flex flex-col items-center space-y-4">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(`/patient-panel${link.path}`);
                setActiveLink(link.path); // Set active link on click
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`relative flex items-center justify-center w-12 h-12 text-white rounded-lg transition-all duration-300 hover:bg-white hover:text-green-800 group
                ${activeLink === link.path ? "bg-green-400 text-green-800" : "bg-transparent"}`} // Apply active class
            >
              {link.icon}
            </button>
          ))}
        </nav>
      </div>
          </div>
    </>
  );
};

export default PatientSidebar;