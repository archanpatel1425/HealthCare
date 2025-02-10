import React from "react";
import PatientSidebar from "./PatientSidebar";

const PatientLayout = ({ children }) => {
    return (
        <div className="overflow-hidden">
            <div className="bg-gray-100 h-screen flex pt-20 w-screen">
                <PatientSidebar />
                <div className="flex-grow p-4">{children}</div>
            </div>
        </div>
    );
};

export default PatientLayout;