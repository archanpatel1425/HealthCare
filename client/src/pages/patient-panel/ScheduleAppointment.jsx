import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchUserData } from '../../Store/patient/authslice';

const ScheduleAppointment = () => {
    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);
    const [slots, setSlots] = useState({});
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isOtherReason, setIsOtherReason] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const { doctorId } = location.state;

    useEffect(() => {
        dispatch(fetchUserData());
        const fetchData = async () => {
            try {
                const response = await axios.post(`${VITE_API_URL}/patient/get-schedule`, { doctorId }, { withCredentials: true });
                setSlots(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [doctorId]);

    const handleSlotClick = (date, slot) => {
        setSelectedSlot({ date, slot });
        setIsModalOpen(true);
    };

    const handleReasonChange = (event) => {
        const value = event.target.value;
        setReason(value);
        setIsOtherReason(value === 'Other');
        if (value !== 'Other') {
            setCustomReason('');
        }
    };

    const handleCustomReasonChange = (event) => {
        setCustomReason(event.target.value);
    };

    const handleBookAppointment = async () => {
        if (!selectedSlot || (!reason && !customReason)) return;

        const appointmentData = {
            patient_Id: patientData?.patientId,
            doctor_Id: doctorId,
            date: new Date(selectedSlot.date),
            time: selectedSlot.slot.to,
            reason: isOtherReason ? customReason : reason,
            status: 'Pending'
        };

        await axios.post(`${VITE_API_URL}/patient/book-appointment`, appointmentData, { withCredentials: true });

        setSelectedSlot(null);
        setReason('');
        setCustomReason('');
        setIsOtherReason(false);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 font-sans">
            <h2 className="text-2xl font-semibold text-center mb-6">Schedule Your Appointment</h2>
            <div className="space-y-6 overflow-y-scroll max-h-[54vh]">
                {Object.keys(slots).map(date => {
                    const slotList = slots[date];
                    return (
                        <div key={date} className="border p-4 rounded-lg bg-gray-100">
                            <h3 className="text-xl font-medium">{date}</h3>
                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {slotList.length === 0 ? (
                                    <p className="col-span-full text-gray-500">No available slots for today.</p>
                                ) : (
                                    slotList.map(slot => {
                                        const isBooked = !slot.available;
                                        const isSelected = selectedSlot && selectedSlot.date === date && selectedSlot.slot === slot;

                                        return (
                                            <button
                                                key={`${date}-${slot.from}`}
                                                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-300 
                                                    ${isBooked ? 'bg-gray-300 cursor-not-allowed' : isSelected ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                                                onClick={() => !isBooked && handleSlotClick(date, slot)}
                                                disabled={isBooked}
                                            >
                                                {slot.from} - {slot.to}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-medium mb-4">Select Reason for Appointment</h3>

                        <div className="mt-4">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Appointment</label>
                            <select
                                id="reason"
                                value={reason}
                                onChange={handleReasonChange}
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">Select a reason</option>
                                <option value="Regular Check-up">Regular Check-up</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Other">Other</option>
                            </select>

                            {isOtherReason && (
                                <div className="mt-2">
                                    <label htmlFor="custom-reason" className="block text-sm font-medium text-gray-700">Please specify the reason</label>
                                    <input
                                        type="text"
                                        id="custom-reason"
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                                        value={customReason}
                                        onChange={handleCustomReasonChange}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleBookAppointment}
                            className="mt-4 w-full py-2 text-white bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none"
                        >
                            Book Appointment
                        </button>

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-2 w-full py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleAppointment;
