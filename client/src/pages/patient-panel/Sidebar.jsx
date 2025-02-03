import React from "react";
import { Home, Calendar, Stethoscope, Heart, FileText, Clipboard,Cross,  LogOut } from "lucide-react";
import { useSelector } from "react-redux";

const PatientSidebar = ({ sidebarOpen }) => {
  const links = [
    { name: "Dashboard", icon: <Home />, path: "#" },
    { name: "Appointment", icon: <Calendar />, path: "#" },
    { name: "Symptom Checker", icon: <Stethoscope />, path: "#" },
    { name: "Skin Disease Prediction", icon: <Heart />, path: "#" },
    { name: "Electronic Health Records (EHR)", icon: <FileText />, path: "#" },
    { name: "Prescription Management", icon: <Clipboard />, path: "#" },
    { name: "Pharmacy Integration", icon: <Cross />, path: "#" },
  ];
  const { patientData, loading, error } = useSelector((state) => ({
    patientData: state.auth?.patientData || null,
    loading: state.auth?.loading || false,
    error: state.auth?.error || null
  }));
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
          <a
            key={idx}
            href={link.path}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-600 transition"
          >
            {link.icon}
            <span className="ml-3">{link.name}</span>
          </a>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <a
          href="#logout"
          className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-100 transition px-4 py-2"
        >
          <LogOut />
          <span className="ml-3">Logout</span>
        </a>
        {
        patientData?.first_name ||"jappa "
      }
      </div>
    </div>
  );
};

export default PatientSidebar;
