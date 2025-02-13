import React from "react";
import Alerts from "../../pages/doctor-panel/Alerts";
import Sidebar from '../../pages/doctor-panel/Sidebar';
const DoctorLayout = ({ children }) => {

    return (
        <div className="overflow-hidden" >
            <div className="bg-gray-100 h-screen flex pt-20 w-screen">
                <Sidebar />
                <Alerts />
                <div className="flex-grow p-4">{children}</div>
            </div>
        </div>
    );
};

export default DoctorLayout;
