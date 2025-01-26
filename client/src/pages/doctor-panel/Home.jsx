import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DoctorPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Content */}
        <div className="p-6 bg-gray-50 flex-1">
          <h2 className="text-2xl font-bold text-gray-700">Welcome, Doctor!</h2>
          <p className="mt-2 text-gray-600">Here's your panel overview.</p>
        </div>
      </div>
    </div>
  );
}
