import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import EmailPasswordForm from "../components/auth/EmailPasswordForm";
import PersonalDetailsForm from "../components/auth/PersonalDetailsForm";
import {
  PatientSignup,
  uploadProfilePic
} from "../Store/patient/authslice";

const PatientSignUp_Form = () => {
  const [step, setStep] = useState(1);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
    gender: "",
    profilepic: "",
    email: "",
    password: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    trigger,
    getValues,
  } = useForm({
    defaultValues: formData,
    mode: "onChange",
    delayError: 500,
    reValidateMode: "onChange",
  });

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

  const handleNext = async (formdata) => {
    const currentFields = getValues();
    let validationErrors =
      step === 1 ? validateStep1(currentFields) : validateStep2(currentFields);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) =>
        toast.error(error, { position: "top-right" })
      );
      return;
    }

    const isValid = await trigger();
    if (isValid) setStep((prev) => Math.min(prev + 1, 2));
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
      console.log("Failed not axios");
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const finalData = getValues();
    let validationErrors = validateStep2(finalData);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) =>
        toast.error(error, { position: "top-right" })
      );
      return;
    } else {
      setloading(true);
      try {
        const profilepicResponse = await dispatch(
          uploadProfilePic(finalData.profilepic[0])
        );

        if (uploadProfilePic.fulfilled.match(profilepicResponse)) {
          finalData.profilepic = profilepicResponse.payload; // Get uploaded image URL
        } else {
          toast.error("Failed to upload profile picture");
          setloading(false);
          return;
        }
        const email = finalData.email;
        const response = await axios.post(`${VITE_API_URL}/auth/check-email`, {
          email,
        });
        if (response.data.exists) {
          alert("Email already registered");
          return;
        }
        dispatch(PatientSignup(finalData));
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        toast.error(error);
      } finally {
        setloading(false);
      }
    }
  };


  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <PersonalDetailsForm register={register} errors={errors} />;
      case 2:
        return (
          <EmailPasswordForm
            register={register}
            errors={errors}
            password={password}
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
          {[1, 2].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-full transition-all ${step >= stepNumber
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                  }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 2 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${step > stepNumber ? "bg-green-600" : "bg-gray-300"
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

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

          {step < 2 ? (
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
  );
};

export default PatientSignUp_Form;
