import axios from 'axios';
import { Calendar, Clock, FileText, MessageCircle, Search, User, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [isfiltered, setfilter] = useState(false)
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

    const handleVideoCall = (appointmentId) => {
        navigate(`/meet/${appointmentId}`);
    };

    const handleChat = (appointmentId) => {
        navigate(`/chat`);
    };

    const isVideoCallButtonEnabled = (appointmentDate, appointmentTime) => {
        const now = new Date();
        const appointmentDateTime = new Date(appointmentDate);

        if (appointmentDateTime.toDateString() !== now.toDateString()) {
            return false;
        }

        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const appointmentHour = hours;
        const appointmentMinute = minutes;

        const windowStart = new Date(appointmentDateTime);
        windowStart.setHours(appointmentHour, appointmentMinute, 0);

        const windowEnd = new Date(appointmentDateTime);
        windowEnd.setHours(appointmentHour, appointmentMinute + 45, 0);
        return now >= windowStart && now <= windowEnd;
    };

    const isChatButtonEnabled = (appointmentDate, appointmentTime) => {
        const now = new Date();
        const appointmentDateTime = new Date(appointmentDate);

        // Check if the appointment is today
        if (appointmentDateTime.toDateString() !== now.toDateString()) {
            return false;
        }

        // Convert appointment time (assuming format is "17:00" for 5 PM)
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const appointmentHour = hours;
        const appointmentMinute = minutes;

        // Calculate window start (30 minutes before) and end (45 minutes after)
        const windowStart = new Date(appointmentDateTime);
        windowStart.setHours(appointmentHour, appointmentMinute, 0);

        const windowEnd = new Date(appointmentDateTime);
        windowEnd.setHours(appointmentHour, appointmentMinute + 45, 0);

        // Check if current time is within the window
        return now >= windowStart && now <= windowEnd;
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
            <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                <div className="space-y-3 w-full md:w-2/3">
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

                    {appointment.status.toLowerCase() === 'scheduled' && (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-3">
                            <button
                                onClick={() => handleVideoCall(appointment.appointmentId)}
                                disabled={!isVideoCallButtonEnabled(appointment.date, appointment.time)}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${isVideoCallButtonEnabled(appointment.date, appointment.time)
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Video Call
                            </button>
                            <button
                                onClick={() => handleChat(appointment.appointmentId)}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors w-full sm:w-auto ${'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-3 text-right w-full md:w-1/3 md:pl-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                    </span>
                    <p className="text-gray-800 font-medium">
                        DR. {appointment.doctor.first_name} {appointment.doctor.last_name}
                    </p>
                    <p className="text-gray-600 font-medium">
                        Specialization: {appointment.doctor.specialization}
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
            <div className={`p-6 rounded-lg ${bgColor}`} >
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {title} ({filteredAppointments.length})
                </h3>
                <div className="h-[calc(40vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 pr-4">
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
        )
    }

    return (
        <div className="bg-white shadow-lg p-6 w-full" data-aos="zoom-in-up">
            <div className="flex flex-col space-y-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Appointments Dashboard</h2>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={doctorSearch}
                            onChange={(e) => {
                                setDoctorSearch(e.target.value)
                                e.target.value ? setfilter(true) : setfilter(false)
                            }
                            }
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value)
                                e.target.value ? setfilter(true) : setfilter(false)
                            }
                            }
                            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={() => { setDateFilter(""); setDoctorSearch(""); setfilter(false) }}
                        className={`flex items-center px-4 py-2 text-white bg-red-500 rounded-lg  ${isfiltered ? '' : 'hidden'}  text-gray-600 transition-colors`}
                    >
                        <i className="fa-solid fa-filter-circle-xmark me-2"></i><span>Clear Filter</span>
                    </button>
                </div>
            </div>

            {filteredAppointments && (
                <div className="grid grid-cols-1 lg:grid-rows-3 gap-6">

                    <StatusSection
                        title="Scheduled Appointments"
                        appointments={filteredAppointments}
                        status="scheduled"
                        bgColor="bg-blue-50"
                    />
                    <StatusSection
                        title="Pending Appointments"
                        appointments={filteredAppointments}
                        status="pending"
                        bgColor="bg-yellow-50"
                    />

                    <StatusSection
                        title="Completed Appointments"
                        appointments={filteredAppointments}
                        status="completed"
                        bgColor="bg-green-50"
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