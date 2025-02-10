import axios from 'axios';
import { Calendar, Clock, FileText, User, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const RecentAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const VITE_API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = () => {
            axios.get(`${VITE_API_URL}/patient/getAppointments`, { withCredentials: true })
                .then((response) => {
                    setAppointments(response.data);
                    setFilteredAppointments(response.data);
                })
                .catch((error) => {
                    if (error.response.data.message === "Unauthorized: No token provided") {
                        window.location.href = "/login";
                    }
                    console.log(error);
                });
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [doctorSearch, dateFilter]);

    const filterAppointments = () => {
        let filtered = [...appointments];

        if (doctorSearch) {
            const searchTerm = doctorSearch.toLowerCase();
            filtered = filtered.filter(app => 
                `${app.doctor.first_name} ${app.doctor.last_name}`.toLowerCase().includes(searchTerm)
            );
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter).toDateString();
            filtered = filtered.filter(app => 
                new Date(app.date).toDateString() === filterDate
            );
        }

        setFilteredAppointments(filtered);
    };

    const clearFilters = () => {
        setDoctorSearch('');
        setDateFilter('');
        setFilteredAppointments(appointments);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const AppointmentCard = ({ appointment }) => (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow mb-4 bg-white">
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
                            {formatDate(appointment.date)}
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
                       DR. {appointment.doctor.first_name} {appointment.doctor.last_name}
                    </p>
                    <p className="text-gray-600 font-medium">
                       Specicalization : {appointment.doctor.specialization}
                    </p>
                </div>
            </div>
        </div>
    );

    const StatusSection = ({ title, appointments, status, bgColor }) => {
        const filteredAppointments = appointments.filter(app => 
            app.status.toLowerCase() === status.toLowerCase()
        );
        
        return (
            <div className={`p-6 rounded-lg ${bgColor}`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {title} ({filteredAppointments.length})
                </h3>
                <div className="h-[calc(30vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-4">
                    {filteredAppointments.map(appointment => (
                        <AppointmentCard 
                            key={appointment.appointmentId} 
                            appointment={appointment}
                        />
                    ))}
                    {filteredAppointments.length === 0 && (
                        <div className="text-gray-500 text-center py-4">
                            No {status} appointments
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow-lg p-6 w-full">
            <div className="flex flex-col space-y-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Appointments Dashboard</h2>
                
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={doctorSearch}
                            onChange={(e) => setDoctorSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={clearFilters}
                        className="flex items-center px-4 py-2 bg-red-300 hover:bg-red-400 rounded-lg text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                    </button>
                </div>
            </div>
            
            {filteredAppointments && (
                <div className="grid grid-rows-1 lg:grid-rows-3 gap-6">
                    <StatusSection 
                        title="Pending Appointments" 
                        appointments={filteredAppointments}
                        status="pending"
                        bgColor="bg-yellow-50"
                    />
                    
                    <StatusSection 
                        title="Scheduled Appointments" 
                        appointments={filteredAppointments}
                        status="scheduled"
                        bgColor="bg-blue-50"
                    />
                    
                    <StatusSection 
                        title="Rejected Appointments" 
                        appointments={filteredAppointments}
                        status="rejected"
                        bgColor="bg-red-50"
                    />
                </div>
            )}
        </div>
    );
};

export default RecentAppointments;