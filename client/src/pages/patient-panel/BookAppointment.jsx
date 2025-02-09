import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBriefcaseMedical, FaFilter, FaUserMd } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const [search, setSearch] = useState('');
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/patient/doctors-by-category`, { withCredentials: true });
                setDoctors(response.data.doctors);
                const specs = [...new Set(response.data.doctors.map(doc => doc.specialization))];
                setSpecializations(specs);
            } catch (error) {
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
    return (
        <div className="p-6 w-[85vw] mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Book an Appointment</h2>

            <div className="flex gap-4 items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by doctor name..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="p-3 flex items-center gap-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <FaFilter /> Filter
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-10">
                            <h3 className="font-semibold text-gray-700 mb-2">Filter by Specialization</h3>
                            <div className="max-h-48 overflow-auto">
                                {specializations.map((spec) => (
                                    <label key={spec} className="flex items-center space-x-2 p-1 cursor-pointer hover:bg-gray-100 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecializations.includes(spec)}
                                            onChange={() => handleSpecializationChange(spec)}
                                            className="accent-green-500"
                                        />
                                        <span className="text-gray-700">{spec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold mb-3 text-gray-800">Available Doctors:</h3>
                {filteredDoctors.length > 0 ? (
                    <ul className="list-none">
                        {filteredDoctors.map((doctor, index) => (
                            <li key={index} className="p-4 border-b border-gray-200 last:border-b-0 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <img src={doctor.profilepic} alt={doctor.first_name} className="w-16 h-16 rounded-full border" />
                                    <div>
                                        <p className="font-medium text-green-600 flex items-center gap-2"><FaUserMd /> {doctor.first_name} {doctor.last_name}</p>
                                        <p className="text-gray-700 flex items-center gap-2"><FaBriefcaseMedical /> {doctor.specialization}</p>
                                        <p className="text-gray-700">Experience: {doctor.experience} years</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={() => handleBookAppointment(doctor.doctorId)}>Book Appointment</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-red-500">No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;