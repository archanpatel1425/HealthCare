import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const api_url = import.meta.env.VITE_API_URL;

const DoctorDetails = ({ doctor1 }) => {
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const getDoctorDetails = async () => {
            try {
                setDoctor(doctor1);
            } catch (error) {
                if (error.response.data.message === "Unauthorized: No token provided") {
                    window.location.href = "/login";
                }
                console.error('Error fetching doctor details:', error);
            }
        };
        getDoctorDetails();
    }, []);

    if (!doctor) return <p>Loading doctor details...</p>;

    const { days, time } = doctor.availability || {};

    return (
        <div className="p-6">
            <h2 className="text-2xl  text-green-600 font-bold mb-3">{doctor.first_name} {doctor.last_name}</h2>
            <img src={doctor.profilepic} alt="Doctor Profile" className="w-32 h-32 rounded-full mb-3 border-4 border-green-500" />
            <p className='text-green-600'><strong>Email:</strong> {doctor?.email}</p>
            <p className='text-green-600'><strong>Phone:</strong> {doctor?.phone_no}</p>
            <p className='text-green-600'><strong>Specialization:</strong> {doctor.specialization}</p>
            <p className='text-green-600'><strong>Experience:</strong> {doctor.experience} years</p>
            <p className='text-green-600'><strong>Gender:</strong> {doctor.gender}</p>
            
            <div className="mt-4">
                <strong className='text-green-600'>Availability:</strong>
                <div className="mt-2">
                    {days ? (
                        <ul className="list-disc pl-6">
                            {days.map((day, index) => (
                                <li key={index} className="text-green-600">{day}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No availability listed</p>
                    )}
                </div>
                <div className="mt-2">
                    {time ? (
                        <p className="text-green-600">
                            <strong>Working Hours:</strong> {time.from} - {time.to}
                        </p>
                    ) : (
                        <p>No working hours available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;