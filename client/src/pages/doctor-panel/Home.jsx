import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorLayout from "./DoctorLayout";
import ConsultedPatients from "./ConsultedPatients";
import Dashboard from "./Dashboard";
import NewAppointments from "./NewAppointments";
import PrescriptionForm from "./PrescriptionForm";
import Profile from "./Profile";
import UpComingAppointments from "./UpComingAppointments";

export default function DoctorPanel() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorLayout >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-appointments" element={<NewAppointments />} />
          <Route path="/upcoming-appointments" element={<UpComingAppointments />} />
          <Route path="/consulted-patients" element={<ConsultedPatients />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/prescription-form" element={<PrescriptionForm />} />
        </Routes>
      </DoctorLayout>
    </div >
  );
}