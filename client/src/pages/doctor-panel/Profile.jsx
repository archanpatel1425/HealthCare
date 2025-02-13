import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData } from "../../Store/patient/authslice";
import { showToast } from "./Alerts";
import { Camera, X, Upload, Check, Edit2 } from 'lucide-react';


const Profile = () => {

    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);


    const inputImgRef = useRef(null);
    const inputImgRef1 = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedImageFile1, setSelectedImageFile1] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        phone_no: "",
        profilepic: "",
        email: "",
        specialization: "",
        experience: "",
        qualifications: "",
        availability: { days: [], time: { from: "", to: "" } },
    });

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    useEffect(() => {
        if (patientData) {
            axios
                .post(`${import.meta.env.VITE_API_URL}/doctor/getprofile`, {
                    doctorId: patientData?.doctorId,
                }, { withCredentials: true })
                .then((res) => {
                    setFormData(res.data);
                })
                .catch((error) => {
                    if (error.response?.data?.message === "Unauthorized: No token provided") {
                        window.location.href = "/login";
                    }
                });
        }
    }, [patientData]);


    const triggerFileInput = () => {
        inputImgRef.current?.click();
    };

    const triggerFileInput1 = () => {
        inputImgRef1.current?.click();
    };

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
        const { name, value } = e.target;

        if (name === "from" || name === "to") {
            // Update the nested availability.time object
            setFormData((prev) => ({
                ...prev,
                availability: {
                    ...prev.availability,
                    time: {
                        ...prev.availability.time,
                        [name]: value,  // Dynamically update 'from' or 'to'
                    },
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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

    const handleImageChange1 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!acceptedTypes.includes(file.type)) {
                toast.error('Only JPG, JPEG, and PNG files are allowed', 'error');
                e.target.value = '';
                return;
            }

            const imageURL = URL.createObjectURL(file);
            setSelectedImage1(imageURL);
            setSelectedImageFile1(file);
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

            if (selectedImageFile1) {
                const imageUrl = await handleUpload(selectedImageFile1);
                updatedFormData = {
                    ...updatedFormData,
                    qualifications: imageUrl
                };
            }

            // Dispatch action to update profile with new data
            await axios.post(`${import.meta.env.VITE_API_URL}/doctor/updateprofile`, {
                doctorId: patientData?.doctorId,
                formData: updatedFormData
            }, {
                withCredentials: true
            });

            await dispatch(fetchUserData()); // Refresh data

            showToast("Profile updated successfully", "success");
            setIsSubmitting(false);
            setIsEditing(false);
            setSelectedImage(null);
            setSelectedImageFile(null);
            if (inputImgRef.current) {
                inputImgRef.current.value = null;
            }
            if (inputImgRef1.current) {
                inputImgRef1.current.value = null;
            }
        } catch (error) {
            setIsSubmitting(false);
            showToast("Failed to update profile", "error");
            console.error("Error updating profile:", error);
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }
        }
    };


    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleCheckboxChange = (day) => {
        setFormData((prev) => ({
            ...prev,
            availability: {
                ...prev.availability,
                days: prev.availability.days.includes(day)
                    ? prev.availability.days.filter((d) => d !== day) // Remove if already selected
                    : [...prev.availability.days, day], // Add if not selected
            },
        }));
    };

    return (
        <div className="bg-white shadow-xl rounded-2xl w-full overflow-auto border border-green-100 max-h-[80vh] overflow-y-auto" data-aos="zoom-in-up">
            <div className="min-h-[80%] bg-green-50/50 p-4">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between items-start gap-6 md:gap-12">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center space-y-4 w-full md:w-auto order-1 md:order-2">
                            <h1 className="text-center font-bold mb-2">Profile Photo</h1>
                            <div className="relative group">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 border-green-500 shadow-xl overflow-hidden bg-gradient-to-b from-green-50 to-green-100">
                                    <img
                                        src={selectedImage || formData.profilepic || "/default-profile.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {isEditing && (
                                    <div
                                        onClick={triggerFileInput}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 transform group-hover:scale-105"
                                    >
                                        <div className="text-white flex flex-col items-center">
                                            <Camera className="w-8 h-8 mb-2" />
                                            <span className="text-sm font-medium">Change Photo</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={inputImgRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {isEditing && selectedImage && (
                                <button
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setSelectedImageFile(null);
                                        if (inputImgRef.current) {
                                            inputImgRef.current.value = null;
                                        }
                                    }}
                                    className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove Photo
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col items-center space-y-4 w-full md:w-auto order-1 md:order-2">
                            <h1 className="text-center font-bold mb-2">Qualification</h1>
                            <div className="relative group">
                                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 border-green-500 shadow-xl overflow-hidden bg-gradient-to-b from-green-50 to-green-100">
                                    <img
                                        src={selectedImage1 || formData.qualifications || "/default-profile.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {isEditing && (
                                    <div
                                        onClick={triggerFileInput1}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 transform group-hover:scale-105"
                                    >
                                        <div className="text-white flex flex-col items-center">
                                            <Camera className="w-8 h-8 mb-2" />
                                            <span className="text-sm font-medium">Change Photo</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={inputImgRef1}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange1}
                                className="hidden"
                            />

                            {isEditing && selectedImage1 && (
                                <button
                                    onClick={() => {
                                        setSelectedImage1(null);
                                        setSelectedImageFile1(null);
                                        if (inputImgRef1.current) {
                                            inputImgRef1.current.value = null;
                                        }
                                    }}
                                    className="flex items-center px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove Photo
                                </button>
                            )}
                        </div>

                        {/* Profile Details Section */}
                        <div className="flex-1 space-y-6 order-2 md:order-1 w-full">
                            <div>
                                {isEditing ? (
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                                placeholder="First Name"
                                            />
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            placeholder="Email"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 tracking-tight">
                                            {patientData?.first_name} {patientData?.last_name}
                                        </h2>
                                        <p className="text-gray-600 mt-2 text-base sm:text-lg">{patientData?.email}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">Gender</span>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.gender}</span>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">Contact: </span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="phone_no"
                                            value={formData.phone_no}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            placeholder="Phone Number"
                                        />
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.phone_no}</span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">Specialization: </span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            placeholder="Specialization"
                                        />
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.specialization}</span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">Experience: </span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                            placeholder="Experience"
                                        />
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.experience} {patientData?.experience > 1 ? "Years" : "Year"}</span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">Availability Days: </span>
                                    {isEditing ? (
                                        <div className="flex flex-wrap gap-2">
                                            {weekDays.map((day) => (
                                                <label key={day} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.availability.days?.includes(day)}
                                                        onChange={() => handleCheckboxChange(day)}
                                                        className="accent-green-500"
                                                    />
                                                    <span className="text-gray-700">{day}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">
                                            {patientData?.availability?.days?.length > 0
                                                ? patientData.availability.days.join(", ")
                                                : "No days selected"}
                                        </span>
                                    )}
                                </div>


                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">From: </span>
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            name="from"
                                            value={formData.availability.time?.from}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.availability?.time?.from}</span>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <span className="text-green-600 font-semibold text-base sm:text-lg">To: </span>
                                    {isEditing ? (
                                        <input
                                            type="time"
                                            name="to"
                                            value={formData.availability.time?.to}
                                            onChange={handleChange}
                                            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                                        />
                                    ) : (
                                        <span className="text-gray-700 text-base sm:text-lg font-medium">{patientData?.availability?.time?.to}</span>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`flex items-center px-6 py-3 ${isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                            } text-white text-base font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300`}
                                    >
                                        <Check className="w-5 h-5 mr-2" />
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setSelectedImage(null);
                                            setSelectedImageFile(null);
                                            setSelectedImage1(null);
                                            setSelectedImageFile1(null);
                                            if (inputImgRef.current) {
                                                inputImgRef.current.value = null;
                                            }
                                            if (inputImgRef1.current) {
                                                inputImgRef1.current.value = null;
                                            }
                                        }}
                                        className="flex items-center px-6 py-3 bg-gray-600 text-white text-base font-medium rounded-full shadow-md hover:bg-gray-700 hover:shadow-lg transition-all duration-300"
                                    >
                                        <X className="w-5 h-5 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center mt-6 px-6 py-3 bg-green-600 text-white text-base font-medium rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
                                >
                                    <Edit2 className="w-5 h-5 mr-2" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </div>

    );
};

export default Profile;
