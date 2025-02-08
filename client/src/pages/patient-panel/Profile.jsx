import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData } from "../../Store/patient/authslice"; // Import updateUserData action

const Profile = () => {
    const dispatch = useDispatch();
    const { patientData } = useSelector((state) => state.auth);

    // Local state for form fields, edit mode, and loading
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true); // Start loading
        await dispatch(updateUserData(formData)); // Dispatch action to update profile
        await dispatch(fetchUserData()); // Fetch updated data after submission
        setIsSubmitting(false); // Stop loading
        setIsEditing(false); // Exit edit mode after submitting
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
                                onClick={() => setIsEditing(false)}
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

                <div className="flex flex-col items-center">
                    <div className="w-64 h-64 rounded-full border-6 border-blue-500 shadow-xl overflow-hidden">
                        <img
                            src={patientData?.profilepic || "/default-profile.png"} // Use a default image
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
