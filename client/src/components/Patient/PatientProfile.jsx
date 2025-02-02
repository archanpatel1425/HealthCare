import React from 'react'

const PatientProfile = () => {
    const patient = {
        name: "John Doe",
        age: 30,
        gender: "Male",
        email: "johndoe@example.com",
        contact: "+1 123-456-7890",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 min-h-screen flex justify-center items-center">
            <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    <img
                        src={patient.image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
                    />
                    <h2 className="text-2xl font-semibold text-blue-700 mt-3">
                        {patient.name}
                    </h2>
                    <p className="text-gray-500">{patient.email}</p>
                </div>

                {/* Patient Details */}
                <div className="mt-6 space-y-3">
                    <p className="text-gray-700 flex items-center">
                        <strong className="w-24 text-blue-600">Age:</strong> {patient.age}
                    </p>
                    <p className="text-gray-700 flex items-center">
                        <strong className="w-24 text-blue-600">Gender:</strong> {patient.gender}
                    </p>
                    <p className="text-gray-700 flex items-center">
                        <strong className="w-24 text-blue-600">Contact:</strong> {patient.contact}
                    </p>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-6 text-center">
                    <button
                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientProfile