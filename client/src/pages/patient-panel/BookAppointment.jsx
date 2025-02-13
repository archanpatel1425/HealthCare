import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBriefcaseMedical, FaFilter, FaUserMd } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DoctorDetails from './DoctorDetails';

const BookAppointment = () => {
    const [search, setSearch] = useState('');
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/patient/doctors-by-category`, { withCredentials: true });
                setDoctors(response.data.doctors);
                const specs = [...new Set(response.data.doctors.map(doc => doc.specialization))];
                setSpecializations(specs);
            } catch (error) {
                if (error.response.data.message === "Unauthorized: No token provided") {
                    window.location.href = "/login"
                  }              
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleSpecializationChange = (specialization) => {
        setSelectedSpecializations(prev =>
            prev.includes(specialization)
                ? prev.filter(spec => spec !== specialization)
                : [...prev, specialization]
        );
    };

    const filteredDoctors = doctors.filter(doctor =>
        (`${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(search.toLowerCase())) &&
        (selectedSpecializations.length === 0 || selectedSpecializations.includes(doctor.specialization))
    );

    const handleBookAppointment = (doctorId) => {
        navigate(`/patient-panel/book-slot`, {
            state: {
                doctorId,
            }
        });
    }
    const openModal = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const closeModal = () => {
        setSelectedDoctor(null);
    };

    return (
        <div className="p-6 w-full bg-white shadow-lg rounded-lg h-full flex flex-col" data-aos="zoom-in-up">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Book an Appointment</h2>
            
            <div className="flex gap-4 items-center mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by doctor name..."
                    className="flex-1 p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-3 flex items-center gap-2 border border-green-600 rounded-lg bg-green-100 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        <FaFilter /> Filter
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-green-200 shadow-lg rounded-lg p-3 z-10">
                            <h3 className="font-semibold text-green-800 mb-2">Filter by Specialization</h3>
                            <div className="max-h-48 overflow-auto">
                                {specializations.map((spec) => (
                                    <label key={spec} className="flex items-center space-x-2 p-1 cursor-pointer hover:bg-green-50 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecializations.includes(spec)}
                                            onChange={() => handleSpecializationChange(spec)}
                                            className="accent-green-500"
                                        />
                                        <span className="text-green-900">{spec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="font-semibold mb-3 text-green-800">Available Doctors:</h3>
            <div className="bg-green-100 p-4 rounded-lg shadow-md flex-grow overflow-y-auto">
                {filteredDoctors.length > 0 ? (
                    <ul className="list-none overflow-y-auto">
                        {filteredDoctors.map((doctor, index) => (
                            <li key={index} className="p-4 bg-white border border-green-600 rounded-lg mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:border-green-700 transition-colors duration-200">
                                <div className="flex items-center space-x-4">
                                    <img src={doctor.profilepic} alt={doctor.first_name} className="w-16 h-16 rounded-full border-2 border-green-600" />
                                    <div>
                                        <p className="font-medium text-green-600 flex items-center gap-2">
                                            {doctor.first_name} {doctor.last_name}
                                        </p>
                                        <p className="text-green-800 flex items-center gap-2">
                                            <FaBriefcaseMedical className="text-teal-500" /> {doctor.specialization}
                                        </p>
                                        <p className="text-green-600">Experience: {doctor.experience} years</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-2 sm:mt-0">
                                    <button 
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200" 
                                        onClick={() => openModal(doctor)}
                                    >
                                        More Info
                                    </button>
                                    <button 
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200" 
                                        onClick={() => handleBookAppointment(doctor.doctorId)}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-red-500 text-center font-medium">No doctors found.</p>
                )}
            </div>
            
            {selectedDoctor && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        {/* Changed w-96 to w-[600px] for a wider modal */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative">
            <button 
                onClick={closeModal} 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
                &times;
            </button>
            <DoctorDetails doctor1={selectedDoctor} />
        </div>
    </div>
)}
        </div>
    );
};

export default BookAppointment;
