import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './a.css'
import { showToast } from './Alerts'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Store/patient/authslice";

const Profile = () => {
    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedImageFile1, setSelectedImageFile1] = useState(null);
    const inputImgRef = useRef(null);

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
        availability: "",
    });

    useEffect(() => {
        dispatch(fetchUserData());
    }, []);

    useEffect(() => {
        if (patientData) {
            axios
                .post(`${import.meta.env.VITE_API_URL}/doctor/getprofile`, {
                    doctorId: patientData?.doctorId,
                })
                .then((res) => {
                    setFormData({
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        gender: res.data.gender,
                        phone_no: res.data.phone_no,
                        profilepic: res.data.profilepic,
                        email: res.data.email,
                        specialization: res.data.specialization,
                        experience: res.data.experience,
                        qualifications: res.data.qualifications,
                        availability: res.data.availability,
                    });
                });
        }
    }, [patientData]);


    const handleAvailabilityChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            availability: {
                ...prevData.availability,
                days: checked
                    ? [...(prevData.availability?.days || []), name] // Add the day
                    : (prevData.availability?.days || []).filter(day => day !== name) // Remove the day
            }
        }));
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            availability: {
                ...prevData.availability,
                time: {
                    ...prevData.availability?.time,
                    [name]: value
                }
            }
        }));
    };



    const handleUpload = async (image) => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploads`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newResponse = await axios.post(`${import.meta.env.VITE_API_URL}/doctor/uploadprofile-photo`, { doctorId: patientData?.doctorId, photoUrl: response.data.url })
            if (newResponse.data.message == 'success') {
                showToast('Profile photo uploaded successfully', 'success');
                window.location.reload()
            }

        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }
            showToast('Failed to upload image', 'error');
            throw error;
        }
    };


    const handleUpload1 = async (image) => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/uploads`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const newResponse = await axios.post(`${import.meta.env.VITE_API_URL}/doctor/uploadqualification-photo`, { doctorId: patientData?.doctorId, photoUrl: response.data.url })

            if (newResponse.data.message == 'success') {
                showToast('Profile photo uploaded successfully', 'success');
                window.location.reload()
            }

        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }
            showToast('Failed to upload image', 'error');
            throw error;
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let updatedFormData = { ...formData };

            // If there's a new image selected, upload it first
            // if (selectedImageFile) {
            //     const imageUrl = await handleUpload(selectedImageFile);
            //     updatedFormData = {
            //         ...updatedFormData,
            //         profilepic: imageUrl
            //     };
            // }

            // Update the profile with all data including new image URL if uploaded
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/doctor/updateprofile`, {
                doctorId: patientData?.doctorId,
                formData: updatedFormData
            });

            if (response.data) {
                showToast("Profile updated successfully", "success");
                // navigate("/doctor-panel");
                setUpdate(false);
                changeDisabled1()
            }
        } catch (error) {
            if (error.response.data.message === "Unauthorized: No token provided") {
                window.location.href = "/login"
            }

            showToast("Failed to update profile", "error");
            console.error("Error updating profile:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!acceptedTypes.includes(file.type)) {
                showToast('Only JPG, JPEG, and PNG files are allowed', 'error');
                e.target.value = '';
                return;
            }

            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
            setSelectedImageFile(file);
        }
    };


    const [selectedImage1, setSelectedImage1] = useState(null);
    const inputImgRef1 = useRef(null)

    const handleImageChange1 = (e) => {
        const file = e.target.files[0];
        if (file) {
            const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if (!acceptedTypes.includes(file.type)) {
                showToast('Only JPG, JPEG, and PNG files are allowed', 'error');
                e.target.value = '';
                return;
            }

            const imageURL = URL.createObjectURL(file);
            setSelectedImage1(imageURL);
            setSelectedImageFile1(file);
        }
    };

    const changeDisabled = () => {
        document.querySelectorAll('.input-field').forEach((input) => {
            input.disabled = false;
        });
    };

    const changeDisabled1 = () => {
        document.querySelectorAll('.input-field').forEach((input) => {
            input.disabled = true;
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6 h-[80vh] overflow-x-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Doctor Profile</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                        <span>First Name</span>
                        <input disabled={true} type="text" name="first_name" placeholder="First Name" className="input-field disabled:border-green-600 disabled:border-2" value={formData.first_name} onChange={handleChange} autoComplete="off" />
                    </label>
                    <label className="flex flex-col">
                        <span>Last Name</span>
                        <input disabled={true} type="text" name="last_name" placeholder="Last Name" className="input-field disabled:border-green-600 disabled:border-2" value={formData.last_name} onChange={handleChange} autoComplete="off" />
                    </label>
                    <label className="flex flex-col">
                        <span>Gender</span>
                        <select disabled={true} name="gender" className="input-field disabled:border-green-600 disabled:border-2" value={formData.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

                    <label className="flex flex-col">
                        <span>Phone No.</span>
                        <input disabled={true} type="text" name="phone_no" placeholder="Phone Number" className="input-field disabled:border-green-600 disabled:border-2" value={formData.phone_no} onChange={handleChange} autoComplete="off" />
                    </label>

                    <label className="flex flex-col">
                        <span>Email</span>
                        <input disabled={true} type="email" name="email" placeholder="Email" className="input-field disabled:border-green-600 disabled:border-2" value={formData.email} onChange={handleChange} autoComplete="off" />
                    </label>

                    <label className="flex flex-col">
                        <span>Specialization</span>
                        <input disabled={true} type="text" name="specialization" placeholder="Specialization" className="input-field disabled:border-green-600 disabled:border-2" value={formData.specialization} onChange={handleChange} autoComplete="off" />
                    </label>

                    <label className="flex flex-col">
                        <span>Experience</span>
                        <input disabled={true} type="text" name="experience" placeholder="Experience (e.g., 10 years)" className="input-field disabled:border-green-600 disabled:border-2" value={formData.experience} onChange={handleChange} autoComplete="off" />
                    </label>

                    <br />
                    <div className="w-full flex items-center gap-2 mb-[-30px]">
                        <h4 className="">Available Days</h4>
                    </div>
                    <br />
                    <div className="w-[213%] flex flex-wrap items-center gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div className="border px-2 border-gray-800 rounded-lg" key={day}>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name={day}
                                        className="me-2 input-field"
                                        checked={formData?.availability?.days?.includes(day) || false}
                                        onChange={handleAvailabilityChange}
                                        disabled={true}
                                    />
                                    <span>{day}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <br />
                    <div className="w-full flex items-center gap-2 mb-[-30px]">
                        <h4 className="">Available Time</h4>
                    </div>
                    <br />
                    <div className="flex items-center gap-2">
                        <input
                            type="time"
                            className="input-field disabled:border-green-600 disabled:border-2"
                            name="from"
                            value={formData?.availability?.time?.from || ""}
                            onChange={handleTimeChange}
                            disabled={true}
                        />
                        <input
                            type="time"
                            className="input-field disabled:border-green-600 disabled:border-2"
                            name="to"
                            value={formData?.availability?.time?.to || ""}
                            onChange={handleTimeChange}
                            disabled={true}
                        />
                    </div>
                    {update == false ?
                        <span type="button" onClick={() => { setUpdate(true); changeDisabled() }} className="text-center md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Update</span> :
                        <button type="submit" className="md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Update Profile</button>
                    }
                </form>
            </div>

            <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center h-[80vh] overflow-x-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile Picture</h2>
                <div className="relative group">
                    {/* Show selected image preview if available */}
                    <img
                        src={selectedImage || formData.profilepic || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-48 h-48 rounded-full border-4 border-green-600 object-cover mb-4"
                    />

                    {update &&
                        <div
                            className="rounded-full w-48 h-48 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => inputImgRef.current.click()}
                        >
                            <i className="fa-solid fa-camera text-white text-2xl"></i>
                        </div>
                    }

                    {/* Hidden Input for File Selection */}
                    <input
                        ref={inputImgRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Show Remove Image Button if a new image is selected */}
                {selectedImage && (
                    <button
                        onClick={() => {
                            setSelectedImage(null);
                            setSelectedImageFile(null);
                            inputImgRef.current.value = null;
                        }}
                        className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Remove Image
                    </button>
                )}

                {/* Upload Image Button (Visible only if update mode is active) */}
                {update && selectedImage && (
                    <button
                        onClick={() => handleUpload(selectedImageFile)}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Upload Photo
                    </button>
                )}
                <hr className="border w-full mt-3" />
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center mt-2">Qualification</h2>
                <div className="relative group">
                    {/* Show selected image preview if available */}
                    <img
                        src={selectedImage1 || formData.qualifications || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-48 h-48 rounded-full border-4 border-green-600 object-cover mb-4"
                    />
                    {update &&
                        <div
                            className="rounded-full w-48 h-48 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => inputImgRef1.current.click()}
                        >
                            <i className="fa-solid fa-camera text-white text-2xl"></i>
                        </div>
                    }
                    {/* Hidden Input for File Selection */}
                    <input
                        ref={inputImgRef1}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange1}
                    />
                </div>

                {/* Show Remove Image Button if a new image is selected */}
                {selectedImage1 && (
                    <button
                        onClick={() => {
                            setSelectedImage1(null);
                            setSelectedImageFile1(null);
                            inputImgRef1.current.value = null;
                        }}
                        className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Remove Image
                    </button>
                )}

                {/* Upload Image Button (Visible only if update mode is active) */}
                {selectedImage1 && (
                    <button
                        onClick={() => handleUpload1(selectedImageFile1)}
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Upload Photo
                    </button>
                )}
                {/* <div className="flex items-center gap-5 justify-center">
                    <img src={formData.qualifications || "https://via.placeholder.com/150"} alt="Profile" className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover mb-4" />
                    {selectedImage1 && (
                        <>
                            <i className="fa-solid fa-arrow-right"></i>
                            <div className="relative">
                                <img src={selectedImage1} alt="" className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover mb-4" />
                                <button onClick={() => { setSelectedImage1(null); inputImgRef1.current.value = null }} className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"><i className="fa-solid fa-xmark"></i></button>
                            </div>

                        </>
                    )}
                </div>
                <input disabled={true} ref={inputImgRef1} type="file" accept="image/*" className="input-field" onChange={handleImageChange1} />
                {update == false ?
                    <></>
                    :
                    <button onClick={() => { handleUpload1(selectedImageFile1) }} className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Upload Photo
                    </button>
                } */}
            </div>
        </div>
    );
};

export default Profile;