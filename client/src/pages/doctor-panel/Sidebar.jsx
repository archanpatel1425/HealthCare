import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const links = [
    { name: "New Appointments", icon: <i className="fa-solid fa-calendar-check"></i>, path: "/doctor-panel/new-appointments" },
    { name: "UpComing Appointments", icon: <i className="fa-solid fa-calendar-days"></i>, path: "/doctor-panel/upcoming-appointments" },
    { name: "Consulted Patients", icon: <i className="fa-solid fa-hospital-user"></i>, path: "/doctor-panel/consulted-patients" },
    { name: "Profile", icon: <i className="fa-solid fa-user"></i>, path: "/doctor-panel/profile" },
  ];

  return (

    <>

      {/* Sidebar Toggler Button (Only visible on mobile) */}
      <button
        className="fixed top-6 left-4 z-50 text-white md:hidden bg-green-500 px-2 py-1 rounded-lg"
        onClick={toggleSidebar}
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold text-green-600">Doctor Panel</h1>
          {/* Close button for mobile */}
          <button
            className="fixed top-4 right-4 z-50 text-green-600 md:hidden"
            onClick={toggleSidebar}
          >
            <i class="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          {links.map((link, idx) => (
            <Link
            key={idx}
            to={link.path}
            
            className={`flex items-center px-4 py-2 transition ${location.pathname === link.path
              ? "bg-green-600 text-white"
              : "text-gray-700 hover:bg-green-100 hover:text-green-600"
            }`}
            onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when a link is clicked
            >
              {link.icon}
              <span className="ml-3">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>


      {/* Overlay for mobile view (closes sidebar when clicked) */}
      {sidebarOpen && (
        <div
        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        onClick={toggleSidebar}
        ></div>
      )}    </>
  );
};

export default Sidebar;