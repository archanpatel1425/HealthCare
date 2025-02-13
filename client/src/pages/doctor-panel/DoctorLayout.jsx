import React from "react";
import Alerts from "../../pages/doctor-panel/Alerts";
import Sidebar from '../../pages/doctor-panel/Sidebar';

const DoctorLayout = ({ children }) => {
  return (
    <div className="overflow-hidden" data-aos="zoom-in-up">
      <div className="bg-gray-100 h-screen flex pt-20 w-screen">
        <Sidebar />
        <Alerts />
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;