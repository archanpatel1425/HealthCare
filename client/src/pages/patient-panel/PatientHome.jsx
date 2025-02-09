import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PatientLayout from "../../components/Patient/PatientLayout";
import BookAppointment from "./BookAppointment";
import Dashboard from "./Dashboard";
import ScheduleAppointment from "./ScheduleAppointment";

export default function PatientHome() {

  return (
    <div className="flex h-screen bg-gray-100 ">
      <PatientLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/book-slot" element={<ScheduleAppointment />} />
        </Routes>
      </PatientLayout>
    </div>
  );
}
