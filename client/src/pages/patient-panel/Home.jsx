import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chatbot from "./Bot"; 
import Navbar from '../../components/Navbar';
import Dashboard from "./Dashboard";
import Appointment from "./Appointment";
import {  Outlet } from "react-router-dom";

export default function PatientPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} isPatientPanel={true} />
        
        {/* Content */}
        <div  className={`p-6 bg-gray-50 flex-1 transition-all duration-300 ml-50 mt-20 w-[calc(100%)] }`}>
          {/* Add your main content here */}
          <Outlet />
        </div>
      </div>

      {/* Chatbot Component at Bottom Right Corner */}
      <Chatbot />
    </div>
  );
}
 