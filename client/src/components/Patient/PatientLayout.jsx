import React from "react";
import { useLocation } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const patientSidebar = location.pathname.includes("/patient-panel");
    const doctorSidebar = location.pathname.includes("/doctor-panel");

    return (
        <div className="overflow-hidden">
            {patientSidebar ? (
                <div className="bg-gray-100 h-screen flex pt-20 -mt-1">
                    <PatientSidebar />
                    <div className="flex-grow">{children}</div>
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default Layout;