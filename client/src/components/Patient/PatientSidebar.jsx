import { Calendar, Clipboard, Cross, FileText, Heart, Home, Menu, Stethoscope, X, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    { name: "Symptom Checker", icon: <Stethoscope size={22} />, path: "/symptom-checker" },
    { name: "Skin Disease Prediction", icon: <Heart size={22} />, path: "/skin-disease" },
    { name: "EHR", icon: <FileText size={22} />, path: "/ehr" },
    { name: "Prescriptions", icon: <Clipboard size={22} />, path: "/prescriptions" },
    { name: "Pharmacy", icon: <Cross size={22} />, path: "/pharmacy" },
    { name: "Profile", icon: <User size={22} />, path: "/profile" },
  ];

  return (
    <>
      <button
        className={`md:hidden fixed top-24 ${sidebarOpen ? "left-20" : "left-4"} bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center hover:bg-green-700 transition-all`}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-16 bg-gradient-to-b from-green-800 to-green-500 shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <nav className="lg:pt-6 md:pt-6 pt-24 flex flex-col items-center space-y-4">
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(`/patient-panel${link.path}`);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className="relative flex items-center justify-center w-12 h-12 text-white rounded-lg transition-all duration-300 hover:bg-white hover:text-green-800 group"
            >
              {link.icon}
              <span className="absolute left-14 bg-white text-green-800 text-sm px-2 py-1 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 shadow-lg">
                {link.name}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default PatientSidebar;