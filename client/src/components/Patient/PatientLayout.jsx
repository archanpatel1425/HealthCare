import React from "react";
import PatientSidebar from "./PatientSidebar";

const PatientLayout = ({ children }) => {
    return (
        <div className="overflow-hidden">
            <div className="bg-gray-100 h-screen flex pt-20 -mt-1 w-screen">
                <PatientSidebar />
                <div className="flex-grow">{children}</div>
            </div>
        </div>
    );
};

export default PatientLayout;