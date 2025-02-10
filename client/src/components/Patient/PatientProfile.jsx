import React from 'react';
import {useSelector} from 'react-redux'

const PatientProfile = () => {

    const {first_name,last_name,phone_no,profilepic,email,gender}=useSelector((state)=>state.auth.patientData)

    return (
        <div className="bg-white shadow-xl rounded-2xl p-12 max-w-5xl w-full">
            <div className="flex justify-between items-start gap-16">
                {/* Left Side - Patient Information */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h2 className="text-4xl font-semibold text-blue-700">
                            {first_name} {last_name}
                        </h2>
                        <p className="text-gray-500 mt-2 text-xl">{email}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center">
                            <span className="w-32 text-blue-600 font-medium text-xl">Gender</span>
                            <span className="text-gray-700 text-xl">{gender}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 text-blue-600 font-medium text-xl">Contact</span>
                            <span className="text-gray-700 text-xl">{phone_no}</span>
                        </div>
                    </div>

                    <button className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition">
                        Edit Profile
                    </button>
                </div>

                {/* Right Side - Profile Picture */}
                <div className="flex flex-col items-center">
                    <div className="w-64 h-64 rounded-full border-6 border-blue-500 shadow-xl overflow-hidden">
                        <img
                            src={profilepic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientProfile;