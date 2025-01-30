import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chatbot from "./Bot"; 
import Navbar from '../../components/Navbar';

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
        <div className="p-6 bg-gray-50 flex-1">
          {/* Add your main content here */}
        </div>
      </div>

      {/* Chatbot Component at Bottom Right Corner */}
      <Chatbot />
    </div>
  );
}
