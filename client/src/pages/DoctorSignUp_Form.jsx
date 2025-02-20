import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailPasswordForm from "../components/auth/EmailPasswordForm";
import PersonalDetailsForm from "../components/auth/PersonalDetailsForm";
import QualificationsForm from "../components/auth/QualificationForm";

const DoctorSignUp_Form = () => {
  const [step, setStep] = useState(1);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [isCustomAvailability, setIsCustomAvailability] = useState(false);
  const [validateQualifications, setValidateQualifications] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
    profilepic: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    experience: "",
    qualifications: "",
    availability: "Weekdays",
    customDays: [],
    timeFrom: "",
    timeTo: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    delayError: 500,
    reValidateMode: "onChange",
  });

  const validateTimeRange = (timeFrom, timeTo) => {

  };
  const password = watch("password");

  const validateStep1 = (fields) => {
    const errors = [];
    if (!fields.first_name) errors.push("First name is required");
    else if (!/^[A-Za-z]+$/.test(fields.first_name))
      errors.push("First name should only contain alphabets");

    if (!fields.last_name) errors.push("Last name is required");
    else if (!/^[A-Za-z]+$/.test(fields.last_name))
      errors.push("Last name should only contain alphabets");

    if (!fields.phone_no) errors.push("Phone number is required");
    else if (!/^[0-9]{10}$/.test(fields.phone_no))
      errors.push("Phone number must be exactly 10 digits");

    if (!fields.gender) errors.push("Gender is required");
    if (!fields.profilepic?.[0]) errors.push("Profile photo is required");
    return errors;
  };

  const validateStep2 = (fields) => {
    const errors = [];
    if (!fields.email) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errors.push("Invalid email format");

    if (!fields.password) errors.push("Password is required");
    else if (fields.password.length < 8)
      errors.push("Password must be at least 8 characters");
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        fields.password
      )
    ) {
      errors.push(
        "Password must contain uppercase, lowercase, number and special character"
      );
    }

    if (!fields.confirmPassword) errors.push("Please confirm your password");
    else if (fields.password !== fields.confirmPassword)
      errors.push("Passwords do not match");

    return errors;
  };

  const validateStep3 = (values) => {
    const errors = [];
    if (!values.specialization) {
      errors.push("Please select a specialization");
    }
    if (!values.experience) {
      errors.push("Please enter your years of experience");
    } else if (values.experience < 0) {
      errors.push("Experience cannot be negative");
    }
    if (!values.qualifications || values.qualifications.length === 0) {
      errors.push("Please upload your qualifications document");
    }
    if (!values.availability) {
      errors.push("Please select your availability");
    }
    if (
      isCustomAvailability &&
      (!values.customDays || values.customDays.length === 0)
    ) {
      errors.push("Please select at least one day for custom availability");
    }

    console.log("Errors in validation: ", errors);
    return errors;
  };

  const handleNext = async () => {
    const currentFields = getValues();
    let validationErrors = [];

    if (step === 1) {
      validationErrors = validateStep1(currentFields);
    } else if (step === 2) {
      validationErrors = validateStep2(currentFields);
    } else {
      validationErrors = validateStep3(currentFields);
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    const fields =
      step === 1
        ? ["first_name", "last_name", "phone_no", "gender", "profilepic"]
        : ["email", "password", "confirmPassword"];

    const isValid = await trigger(fields);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleUpload = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await axios.post(`${VITE_API_URL}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.url;
    } catch (error) {
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const validateFinalStep = (data) => {
    const errors = [];
    if (!data.specialization) errors.push("Specialization is required");
    if (!data.experience) errors.push("Experience is required");
    if (!data.qualifications?.[0])
      errors.push("Qualifications document is required");
    if (!data.timeFrom) errors.push("Start time is required");
    if (!data.timeTo) errors.push("End time is required");
    if (
      isCustomAvailability &&
      (!data.customDays || data.customDays.length === 0)
    ) {
      errors.push("Please select at least one day for custom availability");
    }
    return errors;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let validationErrors = [];
      const data = getValues();
      setValidateQualifications(true); // Trigger valid ation
      validationErrors = validateStep3(data);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error));
        return;
      }
      const values = watch();
      const requiredFields = [
        "specialization",
        "experience",
        "qualifications",
        "timeFrom",
        "timeTo",
      ];
      const emptyFields = requiredFields.filter((field) => !values[field]);

      if (
        emptyFields.length > 0 ||
        (isCustomAvailability &&
          (!values.customDays || values.customDays.length === 0))
      ) {
        return; // Stop submission if there are empty required fields
      }

      setloading(true);

      const profilepic = await handleUpload(data.profilepic[0]);
      const qualifications = await handleUpload(data.qualifications[0]);
      const finalData = {
        ...data,
        profilepic,
        qualifications,
        customDays: isCustomAvailability ? data.customDays || [] : [],
      };

      const response = await axios.post(
        `${VITE_API_URL}/auth/doctor-signup`,
        finalData,
        { withCredentials: true }
      );
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setloading(false);
      setValidateQualifications(false); // Reset validation trigger
    }
  };


  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <PersonalDetailsForm register={register} />;
      case 2:
        return <EmailPasswordForm register={register} password={password} />;
      case 3:
        return (
          <QualificationsForm
            register={register}
            watch={watch}
            isCustomAvailability={isCustomAvailability}
            setIsCustomAvailability={setIsCustomAvailability}
            validateOnSubmit={validateQualifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex justify-center items-center px-4" data-aos="zoom-in-up">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-xl w-full bg-white shadow-xl rounded-lg p-8">
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full transition-all ${step >= stepNumber
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
                  }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${step > stepNumber ? "bg-green-600" : "bg-gray-300"
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div>
          {/* Form Content */}
          <div className="mb-6">{renderCurrentStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-green-700 border border-green-500 rounded-lg transition-all hover:bg-green-100"
              >
                Previous
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-green-600 text-white rounded-lg transition-all hover:bg-green-700 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={onSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg transition-all hover:bg-green-700 ml-auto"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignUp_Form;
