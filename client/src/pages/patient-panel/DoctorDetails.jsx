import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const api_url = import.meta.env.VITE_API_URL;

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const getDoctorDetails = async () => {
            try {
                const response = await axios.get(`${api_url}/patient/doctorinfo/${id}`, { withCredentials: true });
                setDoctor(response.data);
            } catch (error) {
                if (error.response.data.message === "Unauthorized: No token provided") {
                    window.location.href = "/login"
                  }              
                console.error('Error fetching doctor details:', error);
            }
        };
        getDoctorDetails();
    }, [id]);

    if (!doctor) return <p>Loading doctor details...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-3">{doctor.first_name} {doctor.last_name}</h2>
            <img src={doctor.profilepic} alt="Doctor Profile" className="w-32 h-32 rounded-full mb-3" />
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone_no}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Gender:</strong> {doctor.gender}</p>
            <p><strong>Availability:</strong> {JSON.stringify(doctor.availability)}</p>
        </div>
    );
};

export default DoctorDetails;
