import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookAppointment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm();

    const handleNext = async () => {
        const isValid = await trigger();
        if (isValid) setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', data.image[0]);
            formData.append('document', data.document[0]);
            formData.append('full_name', data.full_name);
            formData.append('email', data.email);
            formData.append('age', data.age);
            formData.append('gender', data.gender);
            formData.append('disease_description', data.disease_description);

            const response = await axios.post('YOUR_API_URL/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success('Registration successful!');
            }
        } catch (error) {
            toast.error('Error registering user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <div>
                            <label className="block mb-2">Full Name</label>
                            <input {...register('full_name', { required: 'Full name is required' })} className="w-full p-2 border rounded" />
                            {errors.full_name && <p className="text-red-500">{errors.full_name.message}</p>}

                            <label className="block mt-4">Email</label>
                            <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} className="w-full p-2 border rounded" />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            <button type="button" className="mt-4 w-full bg-blue-500 text-white p-2 rounded" onClick={handleNext}>Next</button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <label className="block mb-2">Age</label>
                            <input type="number" {...register('age', { required: 'Age is required', min: { value: 1, message: 'Age must be at least 1' } })} className="w-full p-2 border rounded" />
                            {errors.age && <p className="text-red-500">{errors.age.message}</p>}

                            <label className="block mt-4">Gender</label>
                            <select {...register('gender', { required: 'Gender is required' })} className="w-full p-2 border rounded">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

                            <div className="flex justify-between mt-4">
                                <button type="button" className="bg-gray-500 text-white p-2 rounded" onClick={handlePrev}>Previous</button>
                                <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <label className="block mb-2">Disease Description</label>
                            <textarea {...register('disease_description', { required: 'Description is required' })} className="w-full p-2 border rounded"></textarea>
                            {errors.disease_description && <p className="text-red-500">{errors.disease_description.message}</p>}

                            <label className="block mt-4">Upload Image</label>
                            <input type="file" {...register('image', { required: 'Image is required' })} className="w-full p-2 border rounded" />
                            {errors.image && <p className="text-red-500">{errors.image.message}</p>}

                            <label className="block mt-4">Upload Document</label>
                            <input type="file" {...register('document', { required: 'Document is required' })} className="w-full p-2 border rounded" />
                            {errors.document && <p className="text-red-500">{errors.document.message}</p>}

                            <div className="flex justify-between mt-4">
                                <button type="button" className="bg-gray-500 text-white p-2 rounded" onClick={handlePrev}>Previous</button>
                                <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;