import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Store/patient/authslice";

const Dashboard = () => {

  const dispatch = useDispatch();
  const { patientData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  return (
    <div>
      <div className="p-6 bg-gray-50 flex-1">
        <div className="p-6 bg-gray-50 flex-1">
          <div className="flex items-center space-x-4">
            <img
              src={patientData?.profilepic}
              alt="Doctor's Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                Welcome, Dr. {patientData?.first_name} {patientData?.last_name}
              </h2>
              {/* <p className="text-gray-500">{patientData.specialization} | {patientData.experience} years of experience</p> */}
            </div>
          </div>
        </div>

        {/* <h2 className="text-2xl font-bold text-gray-700">Welcome to HealWell, Dr. {patientData.first_name} {patientData.last_name}</h2> */}
        {/* <p className="mt-2 text-gray-600">Here's your panel overview.</p> */}
      </div>
    </div>
  )
}

export default Dashboard