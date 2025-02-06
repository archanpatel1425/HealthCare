import axios from 'axios';
import { Calendar, Clock, User,FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const RecentAppointments = () => {
    // const appointments = [
    //     {
    //         appointmentId: "1",
    //         patient_Id: "p1",
    //         doctor_Id: "d1",
    //         date: new Date("2025-02-15"),
    //         time: "10:00 AM",
    //         status: "Completed",
    //         doctor: {
    //             name: "Dr. Sarah Wilson",
    //             specialization: "Cardiologist"
    //         },
    //         patient: {
    //             first_name: "John",
    //             last_name: "Doe"
    //         }
    //     },
    //     {
    //         appointmentId: "2",
    //         patient_Id: "p2",
    //         doctor_Id: "d2",
    //         date: new Date("2025-02-14"),
    //         time: "2:30 PM",
    //         status: "Scheduled",
    //         doctor: {
    //             name: "Dr. Michael Chen",
    //             specialization: "Neurologist"
    //         },
    //         patient: {
    //             first_name: "Emma",
    //             last_name: "Smith"
    //         }
    //     },
    //     {
    //         appointmentId: "3",
    //         patient_Id: "p3",
    //         doctor_Id: "d3",
    //         date: new Date("2025-02-13"),
    //         time: "11:15 AM",
    //         status: "Cancelled",
    //         doctor: {
    //             name: "Dr. James Brown",
    //             specialization: "Dermatologist"
    //         },
    //         patient: {
    //             first_name: "Alice",
    //             last_name: "Johnson"
    //         }
    //     },
    //     {
    //         appointmentId: "4",
    //         patient_Id: "p3",
    //         doctor_Id: "d3",
    //         date: new Date("2025-02-13"),
    //         time: "11:15 AM",
    //         status: "Cancelled",
    //         doctor: {
    //             name: "Dr. James Brown",
    //             specialization: "Dermatologist"
    //         },
    //         patient: {
    //             first_name: "Alice",
    //             last_name: "Johnson"
    //         }
    //     }
    // ];

    const [appointments, setAppointments] = useState()
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = () => {
            axios.get(`${VITE_API_URL}/patient/getAppointments`)
                .then((response) => {
                    console.log(response.data)
                    setAppointments(response.data)
                })
                .catch((error) => console.error(error))
        }

        fetchData()
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return date?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'  
        });
    };

    return (
        <div className="bg-white shadow-lg p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Recent Appointments</h2>

            </div>
            {appointments &&
                <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.appointmentId}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium text-gray-800">
                                            {appointment.patient.first_name} {appointment.patient.last_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-600">
                                            {formatDate(new Date(appointment.date))}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-600">
                                            {appointment.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-600">
                                        {appointment.reason}
                                    </span>
                                </div>
                                </div>

                                <div className="space-y-3 text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                    <p className="text-gray-800 font-medium">
                                        {appointment.doctor.first_name} {appointment.doctor.last_name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {appointment.doctor.specialization}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            }
        </div>
    );
};

export default RecentAppointments;