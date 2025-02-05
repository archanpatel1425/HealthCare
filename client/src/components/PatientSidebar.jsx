import { Calendar, Clipboard, Cross, FileText, Heart, Home, Menu, Stethoscope, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const PatientSidebar = ({ selectedComponent, setSelectedComponent }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on large screens

  // Close sidebar by default on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Close sidebar on small screens
      } else {
        setSidebarOpen(true); // Open sidebar on larger screens
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize); // Listen to resize events
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const links = [
    { name: "Dashboard", icon: <Home size={22} />, component: "Dashboard" },
    { name: "Book Appointment", icon: <Calendar size={22} />, component: "BookAppointments" },
    { name: "Symptom Checker", icon: <Stethoscope size={22} />, component: "SymptomChecker" },
    { name: "Skin Disease Prediction", icon: <Heart size={22} />, component: "SkinDisease" },
    { name: "EHR", icon: <FileText size={22} />, component: "EHR" },
    { name: "Prescriptions", icon: <Clipboard size={22} />, component: "Prescriptions" },
    { name: "Pharmacy", icon: <Cross size={22} />, component: "Pharmacy" },
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
                setSelectedComponent(link.component);
                if (window.innerWidth < 768) toggleSidebar(); // Auto-close sidebar on small screens
              }}
              className={`flex items-center w-full px-6 py-3 text-gray-800 text-left rounded-lg transition-all duration-300 
                ${selectedComponent === link.component
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
