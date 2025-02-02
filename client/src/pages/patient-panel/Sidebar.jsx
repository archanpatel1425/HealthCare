import React from "react";
import { Home, Calendar, Stethoscope, Heart, FileText, Clipboard, Cross, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const PatientSidebar = ({ sidebarOpen }) => {
  const links = [
    { name: "Dashboard", icon: <Home />, path: "dashboard" },
    { name: "Appointment", icon: <Calendar />, path: "appointments" },
    { name: "Symptom Checker", icon: <Stethoscope />, path: "symptom-checker" },
    { name: "Skin Disease Prediction", icon: <Heart />, path: "skin-disease" },
    { name: "Electronic Health Records (EHR)", icon: <FileText />, path: "ehr" },
    { name: "Prescription Management", icon: <Clipboard />, path: "prescriptions" },
    { name: "Pharmacy Integration", icon: <Cross />, path: "pharmacy" },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed z-20 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 md:translate-x-0 md:static`}
    >
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-green-600">Patient Panel</h1>
      </div>
      <nav className="mt-4">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={`/patient-panel/${link.path}`}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-600 transition"
          >
            {link.icon}
            <span className="ml-3">{link.name}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <Link
          to="/logout"
          className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-100 transition px-4 py-2"
        >
          <LogOut />
          <span className="ml-3">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default PatientSidebar;
