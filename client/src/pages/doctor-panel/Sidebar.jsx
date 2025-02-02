import React from "react";
import { Home, Calendar, User, FileText, Settings, LogOut } from "lucide-react";

const Sidebar = ({ sidebarOpen }) => {
  const links = [
    { name: "Dashboard", icon: <Home />, path: "#" },
    { name: "Patients", icon: <User />, path: "#" },
    { name: "Appointments", icon: <Calendar />, path: "#" },
    { name: "Reports", icon: <FileText />, path: "/reports" },
    { name: "Settings", icon: <Settings />, path: "#" },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed z-20 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 md:translate-x-0 md:static`}
    >
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">Doctor Panel</h1>
      </div>
      <nav className="mt-4">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.path}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
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
      </div>
    </div>
  );
};

export default Sidebar;
