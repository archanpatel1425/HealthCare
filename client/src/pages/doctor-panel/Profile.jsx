import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './a.css'
import { showToast } from './Alerts'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const navigate = useNavigate()

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
        axios
            .post(`${import.meta.env.VITE_API_URL}/doctor/getprofile`, {
                doctorId: "693b8e48-af4f-4077-863d-1ba36b98a9cb",
            })
            .then((res) => {
                console.log(res.data);
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
                    availability: JSON.stringify(res.data.availability),
                });
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axios
            .post(`${import.meta.env.VITE_API_URL}/doctor/updateprofile`, { doctorId: "693b8e48-af4f-4077-863d-1ba36b98a9cb", formData: formData })
            .then((res) => {
                showToast("Profile updated...", "success")
                navigate("/doctor-panel")

            });
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const inputImgRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Doctor Profile</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="first_name" placeholder="First Name" className="input-field" value={formData.first_name} onChange={handleChange} autoComplete="off" />
                    <input type="text" name="last_name" placeholder="Last Name" className="input-field" value={formData.last_name} onChange={handleChange} autoComplete="off" />
                    <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="text" name="phone_no" placeholder="Phone Number" className="input-field" value={formData.phone_no} onChange={handleChange} autoComplete="off" />
                    <input type="email" name="email" placeholder="Email" className="input-field" value={formData.email} onChange={handleChange} autoComplete="off" />
                    <input type="text" name="specialization" placeholder="Specialization" className="input-field" value={formData.specialization} onChange={handleChange} autoComplete="off" />
                    <input type="text" name="experience" placeholder="Experience (e.g., 10 years)" className="input-field" value={formData.experience} onChange={handleChange} autoComplete="off" />
                    <input type="text" name="qualifications" placeholder="Qualifications" className="input-field" value={formData.qualifications} onChange={handleChange} autoComplete="off" />
                    <input type="text" name="availability" placeholder="Availability (e.g., Monday: 10AM-4PM)" className="input-field" value={formData.availability} onChange={handleChange} autoComplete="off" />
                    <button type="submit" className="md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Update Profile
                    </button>
                </form>
            </div>

            <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile Picture</h2>
                <div className="flex items-center gap-5 justify-center">
                    <img src={formData.profilepic || "https://via.placeholder.com/150"} alt="Profile" className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover mb-4" />
                    {selectedImage && (
                        <>
                            <i className="fa-solid fa-arrow-right"></i>
                            <div className="relative">
                                <img src={selectedImage} alt="" className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover mb-4" />
                                <button onClick={() => { setSelectedImage(null); inputImgRef.current.value = null }} className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"><i className="fa-solid fa-xmark"></i></button>
                            </div>

                        </>
                    )}
                </div>
                <input ref={inputImgRef} type="file" accept="image/*" className="input-field" onChange={handleImageChange} />
                <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Upload Photo
                </button>
            </div>
        </div>
    );
};

export default Profile;
