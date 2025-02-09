import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Prescriptions = () => {
    const api_url = import.meta.env.VITE_API_URL;
    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${api_url}/patient/getpriscription`, { withCredentials: true });
                setPrescriptions(response.data);
                setFilteredPrescriptions(response.data);
            } catch (error) {
                if (error.response.data.message === "Unauthorized: No token provided") {
                    window.location.href = "/login"
                }
                console.error('Error fetching prescriptions:', error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    // Helper function to format date string to YYYY-MM-DD
    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Filter prescriptions based on search term and selected date
    useEffect(() => {
        let filtered = [...prescriptions];

        // Filter by doctor name
        if (searchTerm) {
            filtered = filtered.filter(prescription => {
                const doctorFullName = `${prescription.doctor.first_name} ${prescription.doctor.last_name}`.toLowerCase();
                return doctorFullName.includes(searchTerm.toLowerCase());
            });
        }

        // Filter by date
        if (selectedDate) {
            filtered = filtered.filter(prescription => {
                // Format the prescription date to YYYY-MM-DD for comparison
                const prescriptionDate = formatDateString(prescription.appointment.date);
                return prescriptionDate === selectedDate;
            });
        }

        setFilteredPrescriptions(filtered);
    }, [searchTerm, selectedDate, prescriptions]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle date filter change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDate('');
        setFilteredPrescriptions(prescriptions);
    };

    // Format date for display
    const formatDisplayDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div className="text-center py-4">Loading prescriptions...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Prescriptions</h2>

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by doctor name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="flex-1">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedDate) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    Showing {filteredPrescriptions.length} of {prescriptions.length} prescriptions
                    {selectedDate && (
                        <span className="ml-2">
                            for date: {formatDisplayDate(selectedDate)}
                        </span>
                    )}
                </div>
            </div>

            {/* Prescriptions List */}
            {filteredPrescriptions.length > 0 ? (
                <div className="space-y-4">
                    {filteredPrescriptions.map((prescription) => (
                        <div
                            key={prescription.prescriptionId}
                            className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-lg text-blue-600">
                                        Dr. {prescription.doctor.first_name} {prescription.doctor.last_name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Date:</span>{' '}
                                        {formatDisplayDate(prescription.appointment.date)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Time:</span>{' '}
                                        {prescription.appointment.time}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium">Medicines:</p>
                                    <p className="text-gray-700">{prescription.medicines || 'No medicines prescribed'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium">Notes:</p>
                                    <p className="text-gray-700">{prescription.notes || 'No notes available'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        {prescriptions.length === 0
                            ? 'No prescriptions found.'
                            : 'No prescriptions match your search criteria.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;