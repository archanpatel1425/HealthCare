import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const api_url = import.meta.env.VITE_API_URL;

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${api_url}/patient/doctorlist`, { withCredentials: true });
                setDoctors(response.data);
            } catch (error) {
                if (error.response.data.message === "Unauthorized: No token provided") {
                    window.location.href = "/login"
                  }              
                console.error('Error fetching doctor list:', error);
            }
        };
        getData();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Doctor List</h2>
            <div className="space-y-3">
                {doctors.map((doctor) => (
                    <div key={doctor.doctorId} className="p-3 border rounded-lg shadow-md flex justify-between items-center">
                        <p className="text-lg">{doctor.first_name} {doctor.last_name}</p>
                        <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                            onClick={() => navigate(`/doctor/${doctor.doctorId}`)}
                        >
                            View More
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorList;
