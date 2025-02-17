import axios from 'axios';
import { Calendar, CheckCircle, Clock, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { fetchUserData } from '../../Store/patient/authslice';

const ScheduleAppointment = () => {
    const navigate = useNavigate()
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

    const handleBookAppointment = async () => {
        if (!selectedSlot || (!reason && !customReason)) return;

        const appointmentData = {
            patient_Id: patientData?.patientId,
            doctor_Id: doctorId,
            date: new Date(selectedSlot.date),
            time: selectedSlot.slot.from,
            reason: isOtherReason ? customReason : reason,
            status: 'Pending'
        };
        try {

            await axios.post(`${VITE_API_URL}/patient/book-appointment`, appointmentData, { withCredentials: true });
            console.log("toast ")
            toast.success("Appointment Booked SuccessFully!")
            setTimeout(() => {
                navigate('/patient-panel')
            }, 1000)
            console.log("toast finish")
            setSelectedSlot(null);
            setReason('');
            setCustomReason('');
            setIsOtherReason(false);
            setIsModalOpen(false);
        }
        catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col sm:flex-row h-full w-full shadow-lg rounded-lg">
            {/* Main Content Area */}
            <div className="flex-grow sm:w-3/4 p-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 flex items-center justify-center gap-2 text-gray-700">
                    <Calendar size={28} className="text-blue-600" /> Schedule Your Appointment
                </h2>

                {/* Slots List with scroll functionality */}
                <div className="space-y-6 h-[calc(100vh-200px)] overflow-y-auto p-4">
                    {Object.keys(slots).map(date => {
                        const slotList = slots[date];
                        return (
                            <div key={date} className="border p-4 rounded-lg bg-white shadow-md">
                                <h3 className="text-lg sm:text-xl font-medium flex items-center gap-2 text-gray-800">
                                    <Clock size={20} className="text-blue-500" /> {date}
                                </h3>
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {slotList.length === 0 ? (
                                        <p className="col-span-full text-gray-500">No available slots for today.</p>
                                    ) : (
                                        slotList.map(slot => {
                                            const isBooked = !slot.available;
                                            const isSelected = selectedSlot && selectedSlot.date === date && selectedSlot.slot === slot;

                                            return (
                                                <button
                                                    key={`${date}-${slot.from}`}
                                                    className={`px-3 py-2 text-sm rounded-lg transition duration-300 w-full border-2
                                                    ${isBooked ? 'bg-red-300 cursor-not-allowed border-red-500 ' :
                                                            isSelected ? 'bg-green-300  border-green-500' :
                                                                'bg-white  hover:bg-gray-100 border-green-500'}`}
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
            </div>

            {/* Modal for selecting appointment reason */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-medium mb-4 text-gray-700">Select Reason for Appointment</h3>
                        <div className="mt-4">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Appointment</label>
                            <select
                                id="reason"
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setIsOtherReason(e.target.value === 'Other');
                                }}
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                            >
                                <option value="">Select a reason</option>
                                <option value="Regular Check-up">Regular Check-up</option>
                                <option value="Follow-up">Follow-up</option>
                                {/* <option value="Emergency">Emergency</option> */}
                                <option value="Other">Other</option>
                            </select>
                            {isOtherReason && (
                                <input
                                    type="text"
                                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                                    placeholder="Enter reason"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            )}
                        </div>
                        <button
                            onClick={handleBookAppointment}
                            className="mt-4 w-full py-2 text-white bg-green-500 rounded-lg flex items-center justify-center gap-2 hover:bg-green-400"
                        >
                            <CheckCircle size={18} /> Book Appointment
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ScheduleAppointment;
