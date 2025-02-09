import { Calendar, Clipboard, Cross, FileText, Heart, Home, Menu, Stethoscope, X, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PatientSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Close sidebar by default on small screens
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
      {/* Mobile Sidebar Toggle Button */}
      <button
        className={`md:hidden fixed top-24 ${sidebarOpen ? "left-48" : "left-4"} bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center gap-2 hover:bg-green-700 transition-all`}
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#d4e8db] shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <nav className={`lg:pt-6 md:pt-6 pt-24 ${sidebarOpen && "mt-12"}`} >
          {links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(`/patient-panel${link.path}`); // Redirect to the specified path
                if (window.innerWidth < 768) toggleSidebar(); // Auto-close sidebar on small screens
              }}
              className={`flex items-center w-full px-6 py-3 text-gray-800 text-left rounded-lg transition-all duration-300 
                ${window.location.pathname === link.path
                  ? "bg-green-500 text-white shadow-md"
                  : "hover:bg-green-200 hover:text-green-700"
                }`}
            >
              {link.icon}
              <span className="ml-4 text-lg font-medium">{link.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default PatientSidebar;
