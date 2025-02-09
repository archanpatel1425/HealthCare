import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';

import { fetchUserData, updateUserData } from "../../Store/patient/authslice";
import axios from "axios";

const Profile = () => {
    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);
    const inputImgRef = useRef(null);

    // Local state for form fields, edit mode, and loading
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        phone_no: "",
        profilepic: "",
    });

    // Fetch user data on mount
    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    // Update local state when patientData is available
    useEffect(() => {
        if (patientData) {
            setFormData({
                first_name: patientData.first_name || "",
                last_name: patientData.last_name || "",
                email: patientData.email || "",
                gender: patientData.gender || "",
                phone_no: patientData.phone_no || "",
                profilepic: patientData.profilepic || "",
            });
        }
    }, [patientData]);

    const handleUpload = async (image) => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploads`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.url;
        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
              }          
            toast.error('Failed to upload image', 'error');
            throw error;
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            
            if (!acceptedTypes.includes(file.type)) {
                toast.error('Only JPG, JPEG, and PNG files are allowed', 'error');
                e.target.value = '';
                return;
            }

            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
            setSelectedImageFile(file);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            let updatedFormData = { ...formData };

            // If there's a new image selected, upload it first
            if (selectedImageFile) {
                const imageUrl = await handleUpload(selectedImageFile);
                updatedFormData = {
                    ...updatedFormData,
                    profilepic: imageUrl
                };
            }

            // Dispatch action to update profile with new data
            await dispatch(updateUserData(updatedFormData));
            await dispatch(fetchUserData()); // Refresh data
            
            toast.success("Profile updated successfully", "success");
            setIsSubmitting(false);
            setIsEditing(false);
            setSelectedImage(null);
            setSelectedImageFile(null);
            if (inputImgRef.current) {
                inputImgRef.current.value = null;
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.error("Failed to update profile", "error");
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl p-12 max-w-5xl w-full">
            <div className="flex justify-between items-start gap-16">
                <div className="flex-1 space-y-8">
                    <div>
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="border px-4 py-2 w-full rounded-md"
                                    placeholder="First Name"
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="border px-4 py-2 w-full rounded-md"
                                    placeholder="Last Name"
                                />
                            </div>
                        ) : (
                            <h2 className="text-4xl font-semibold text-blue-700">
                                {patientData?.first_name} {patientData?.last_name}
                            </h2>
                        )}
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border px-4 py-2 w-full rounded-md mt-2"
                                placeholder="Email"
                            />
                        ) : (
                            <p className="text-gray-500 mt-2 text-xl">{patientData?.email}</p>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center">
                            <span className="w-32 text-blue-600 font-medium text-xl">Gender</span>
                            {isEditing ? (
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="border px-4 py-2 rounded-md"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <span className="text-gray-700 text-xl">{patientData?.gender}</span>
                            )}
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 text-blue-600 font-medium text-xl">Contact</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone_no"
                                    value={formData.phone_no}
                                    onChange={handleChange}
                                    className="border px-4 py-2 rounded-md"
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <span className="text-gray-700 text-xl">{patientData?.phone_no}</span>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-x-4">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-8 py-3 ${isSubmitting ? "bg-gray-400" : "bg-green-600"} text-white text-lg font-medium rounded-lg shadow-lg transition`}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedImage(null);
                                    setSelectedImageFile(null);
                                    if (inputImgRef.current) {
                                        inputImgRef.current.value = null;
                                    }
                                }}
                                className="px-8 py-3 bg-gray-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <div className="w-64 h-64 rounded-full border-6 border-blue-500 shadow-xl overflow-hidden">
                        <img
                            src={selectedImage || formData.profilepic || "/default-profile.png"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isEditing && (
                        <div className="w-full">
                            <input
                                ref={inputImgRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {selectedImage && (
                                <button
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setSelectedImageFile(null);
                                        if (inputImgRef.current) {
                                            inputImgRef.current.value = null;
                                        }
                                    }}
                                    className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                >
                                    Remove Selected Image
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;