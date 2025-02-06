import React, { useState } from "react";
import PatientSidebar from "../../components/PatientSidebar";
import Profile from "../doctor-panel/Profile";
import BookAppointment from "./BookApointment";
import Dashboard from "./Dashboard";
// import SymptomChecker from "./SymptomChecker";
// import SkinDisease from "./SkinDisease";
// import EHR from "./EHR";
// import Prescriptions from "./Prescriptions";
// import Pharmacy from "./Pharmacy";

export default function PatientPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard"); // Default view

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "BookAppointments":
        return <BookAppointment />;
      // case "SymptomChecker":
      //   return <SymptomChecker />;
      // case "SkinDisease":
      //   return <SkinDisease />;
      // case "EHR":
      //   return <EHR />;
      // case "Prescriptions":
      //   return <Prescriptions />;
      // case "Pharmacy":
      //   return <Pharmacy />;
      case "Profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex pt-20 -mt-1">
      {/* Sidebar with Toggle Support */}
      <PatientSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} setSelectedComponent={setSelectedComponent} />
      {/* Main Content - Adjusted for Sidebar */}
      <div className={`max-h-screen flex-1 p-6 overflow-hidden transition-all duration-300 ${sidebarOpen ? "ml-64 md:ml-0" : "ml-0"}`}>
        {renderComponent()}
      </div>
    </div>
  );
}
