import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PatientLayout from "../../components/Patient/PatientLayout";
import BookAppointment from "./BookAppointment";
import Dashboard from "./Dashboard";
import ScheduleAppointment from "./ScheduleAppointment";
import SkinCancer from '../../SkinCancer'
import SkinChecker from '../../SkinChecker'
import Profile from '../patient-panel/Profile'
import Prescriptions from '../patient-panel/Prescriptions'
import Bot from './Bot'

export default function PatientHome() {

  return (
    <div className="flex h-screen bg-gray-100 ">
      <PatientLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/book-slot" element={<ScheduleAppointment />} />
          <Route path="/skin-cancer" element={<SkinCancer />} />
          <Route path="/skin-checker" element={<SkinChecker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
        </Routes>
        <Bot/>
      </PatientLayout>
    </div>
  );
}
