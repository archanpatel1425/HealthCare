import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import EmailPasswordForm from '../components/auth/EmailPasswordForm';
import PersonalDetailsForm from '../components/auth/PersonalDetailsForm';
import QualificationsForm from '../components/auth/QualificationForm';

const DoctorSignUp_Form = () => {
  const [step, setStep] = useState(1);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [isCustomAvailability, setIsCustomAvailability] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_no: '',
    profilepic: '',
    file: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    qualifications: '',
    availability: 'Weekdays',
    customDays: [],
    timeFrom: '',
    timeTo: ''
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
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data) => {
    const finalData = {
      ...formData,
      ...data,
      customDays: isCustomAvailability ? data.customDays || [] : [],
    };
    console.log(finalData);

    setloading(true);
    formData['userType'] = 'Doctor'
    axios.post(`${VITE_API_URL}/auth/doctor-signup`, finalData, { withCredentials: true })
      .then((response) => {
        setloading(false);
        console.log('Doctor SignUp successful !!');
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
      case 3:
        return (
          <QualificationsForm
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            isCustomAvailability={isCustomAvailability}
            setIsCustomAvailability={setIsCustomAvailability}
          />
        );
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
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= stepNumber ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
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

              {step < 3 ? (
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

export default DoctorSignUp_Form;