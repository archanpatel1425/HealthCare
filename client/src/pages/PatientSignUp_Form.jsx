import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import EmailPasswordForm from '../components/auth/EmailPasswordForm';
import PersonalDetailsForm from '../components/auth/PersonalDetailsForm';

const PatientSignUp_Form = () => {
    const [step, setStep] = useState(1);
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        profilepic: '',
        email: '',
        password: ''
    });

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        watch,
        trigger
    } = useForm({
        defaultValues: formData,
        mode: "onChange",
        delayError: 500,
        reValidateMode: "onChange"
    });

    const password = watch('password');

    const handleNext = async () => {
        const isValid = await trigger();
        if (isValid) {
            setStep(prev => Math.min(prev + 1, 2)); // Adjusted for two steps
        }
    };

    const handlePrev = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = (data) => {
        const finalData = { ...formData, ...data };
        formData['userType'] = 'Patient'
        console.log(finalData)
        setloading(true);
        axios.post(`${VITE_API_URL}/auth/patient-signup`, finalData, { withCredentials: true })
            .then((response) => {
                setloading(false);
                console.log('Patient SignUp successful !!');
                navigate('/about');
            })
            .catch((error) => console.error(error));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return <PersonalDetailsForm register={register} errors={errors} />;
            case 2:
                return <EmailPasswordForm register={register} errors={errors} password={password} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= stepNumber ? 'bg-green-500 text-white' : 'bg-gray-300'
                                    }`}>
                                    {stepNumber}
                                </div>
                                {stepNumber < 2 && (
                                    <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {renderCurrentStep()}

                        <div className="mt-6 flex justify-between">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Previous
                                </button>
                            )}

                            {step < 2 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientSignUp_Form;
