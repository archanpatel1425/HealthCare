import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import NewAppointments from "./NewAppointments";
import UpComingAppointments from "./UpComingAppointments";
import ConsultedPatients from "./ConsultedPatients";
import Alerts from "./Alerts";
import Profile from "./Profile";
import PrescriptionForm from "./PrescriptionForm";

export default function DoctorPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Alerts />
        {/* Content */}
        <div className="p-6 bg-gray-50 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-appointments" element={<NewAppointments />} />
            <Route path="/upcoming-appointments" element={<UpComingAppointments />} />
            <Route path="/consulted-patients" element={<ConsultedPatients />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/prescription-form" element={<PrescriptionForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
