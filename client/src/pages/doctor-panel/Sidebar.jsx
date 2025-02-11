import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const links = [
    { name: "Dashboard", icon: <i className="fa-solid fa-house"></i>, path: "/doctor-panel/" },
    { name: "New Appointments", icon: <i className="fa-solid fa-calendar-check"></i>, path: "/doctor-panel/new-appointments" },
    { name: "UpComing Appointments", icon: <i className="fa-solid fa-calendar-days"></i>, path: "/doctor-panel/upcoming-appointments" },
    { name: "Consulted Patients", icon: <i className="fa-solid fa-hospital-user"></i>, path: "/doctor-panel/consulted-patients" },
    { name: "Chat", icon: <i className="fa-solid fa-comments"></i>, path: "/doctor-panel/chat" },
    { name: "Video Call", icon: <i className="fa-solid fa-video"></i>, path: "/doctor-panel/video-call" },
    { name: "Profile", icon: <i className="fa-solid fa-user"></i>, path: "/doctor-panel/profile" },
    { name: "Prescription", icon: <i className="fa-solid fa-user"></i>, path: "/doctor-panel/prescription-form" },
  ];

  return (
    <div className="flex">
      {/* Sidebar Toggler for Small Screens */}
      <button
        className="fixed z-30 top-4 left-4 text-green-600 md:hidden"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars text-2xl"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-20 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 md:translate-x-0 md:static`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">Doctor Panel</h1>

          {/* Close button only for small screens */}
          <button
            className="text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
        <nav className="mt-4">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={`flex items-center px-4 py-2 ${
                location.pathname === link.path
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-100 hover:text-green-600"
              } transition`}
              onClick={toggleSidebar}
            >
              {link.icon}
              <span className="ml-3">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
