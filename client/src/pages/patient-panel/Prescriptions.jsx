import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Prescriptions = () => {
    const api_url = import.meta.env.VITE_API_URL;
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${api_url}/patient/getpriscription`, { withCredentials: true });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };
        getData();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
            {prescriptions.length > 0 ? (
                prescriptions.map((prescription) => (
                    <div key={prescription.prescriptionId} className="border p-4 rounded shadow mb-4">
                        <p><strong>Doctor:</strong> {prescription.doctor.first_name} {prescription.doctor.last_name}</p>
                        <p><strong>Patient ID:</strong> {prescription.patient_Id}</p>
                        <p><strong>Medicines:</strong> {prescription.medicines || 'No medicines prescribed'}</p>
                        <p><strong>Notes:</strong> {prescription.notes || 'No notes available'}</p>
                        <p><strong>Appointment Date:</strong> {new Date(prescription.appointment.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {prescription.appointment.time}</p>
                    </div>
                ))
            ) : (
                <p>No prescriptions found.</p>
            )}
        </div>
    );
};

export default Prescriptions;
