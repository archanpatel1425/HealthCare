import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../Store/patient/authslice';
import { showToast } from "./Alerts";

const PrescriptionForm = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const appointmentId = location.state?.appointmentId;
    const dispatch = useDispatch();

    const { patientData } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserData())
    }, []);

    const [prescriptions, setPrescriptions] = useState([
        { drugName: '', breakfast: false, lunch: false, dinner: false, mealTiming: '' }
    ]);

    const [note, setNote] = useState('');

    const handleChange = (index, field, value) => {
        const updatedPrescriptions = [...prescriptions];

        if (field === 'mealTiming') {
            updatedPrescriptions[index].mealTiming = value;
        } else {
            updatedPrescriptions[index][field] = value;
        }

        setPrescriptions(updatedPrescriptions);

        if (index === prescriptions.length - 1 && field === 'drugName' && value.trim() !== '') {
            setPrescriptions([...updatedPrescriptions, { drugName: '', breakfast: false, lunch: false, dinner: false, mealTiming: '' }]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/doctor/getId`, { appointmentId }, { withCredentials: true })

            const patientId = res.data?.patientId

            let data = prescriptions.filter(p => p.drugName.trim() !== '');

            axios.post(`${import.meta.env.VITE_API_URL}/doctor/submit-prescription`, { data: data, notes: note, appointmentId: appointmentId, patientId: patientId, doctorId: patientData?.doctorId },{withCredentials:true}).then((res) => {
                showToast("Prescription Filled Up SuccessFully!.", "success");
                navigate('/doctor-panel')
            });
        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg overflow-auto  max-h-[80vh] overflow-y-auto" data-aos="zoom-in-up">
            <h2 className="text-green-500 text-2xl font-semibold text-center mb-4">Prescription Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {prescriptions.map((prescription, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-4 mb-2 border-b pb-2">
                        {/* Drug Name */}
                        <input
                            type="text"
                            placeholder="Drug Name"
                            value={prescription.drugName}
                            onChange={(e) => handleChange(index, 'drugName', e.target.value)}
                            className="border p-2 rounded flex-[0.5] min-w-[150px]"
                        />
                        {/* Meal Time Checkboxes */}
                        <div className="flex gap-2 border p-2 rounded flex-[0.5]">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={prescription.breakfast} onChange={(e) => handleChange(index, 'breakfast', e.target.checked)} className="accent-blue-500" /> Breakfast
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={prescription.lunch} onChange={(e) => handleChange(index, 'lunch', e.target.checked)} className="accent-blue-500" /> Lunch
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={prescription.dinner} onChange={(e) => handleChange(index, 'dinner', e.target.checked)} className="accent-blue-500" /> Dinner
                            </label>
                        </div>
                        {/* Meal Timing */}
                        <div className="flex gap-2 border p-2 rounded flex-[0.5]">
                            <label className="flex items-center gap-2">
                                <input type="radio" name={`meal-${index}`} value="after" checked={prescription.mealTiming === 'after'} onChange={(e) => handleChange(index, 'mealTiming', e.target.value)} className="accent-blue-500" /> After Meal
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name={`meal-${index}`} value="before" checked={prescription.mealTiming === 'before'} onChange={(e) => handleChange(index, 'mealTiming', e.target.value)} className="accent-blue-500" /> Before Meal
                            </label>
                        </div>
                    </div>
                ))}
                <textarea
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                    placeholder="Note"
                    onChange={(e) => { setNote(e.target.value) }}
                ></textarea>
    
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Submit</button>
            </form>
        </div>
    );
    
};

export default PrescriptionForm;
