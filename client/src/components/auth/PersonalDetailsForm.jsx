import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PersonalDetailsForm = ({ register }) => {
  const [photo, setPhoto] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error('Please upload only JPG, JPEG or PNG files');
        e.target.value = '';
        return;
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        e.target.value = '';
        return;
      }
      setPhoto(file);
    }
  };

  const validatePhoneNumber = async (phone_no) => {
    try {
      // Basic phone number validation
      if (!/^[0-9]{10}$/.test(phone_no)) {
        // toast.error('Phone number must be exactly 10 digits');
        return false;
      }

      const response = await axios.post(`${VITE_API_URL}/auth/check-phone`, { phone_no });
      if (response.data.exists) {
        toast.error('Phone number already registered');
        return false;
      }
      return true;
    } catch (error) {
      toast.error('Error checking phone number');
      return false;
    }
  };

  const validateName = (value, fieldName) => {
    if (!value) {
      toast.error(`${fieldName} is required`);
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(value)) {
      toast.error(`${fieldName} should only contain alphabets`);
      return false;
    }
    if (value.length < 2) {
      toast.error(`${fieldName} should be at least 2 characters long`);
      return false;
    }
    if (value.length > 50) {
      toast.error(`${fieldName} should not exceed 50 characters`);
      return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">Personal Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            {...register('first_name', {
              required: true,
              validate: value => validateName(value, 'First name'),
              onChange: (e) => {
                if (e.target.value && !/^[A-Za-z\s]+$/.test(e.target.value)) {
                  toast.error('First name should only contain alphabets');
                }
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            {...register('last_name', {
              required: true,
              validate: value => validateName(value, 'Last name'),
              onChange: (e) => {
                if (e.target.value && !/^[A-Za-z\s]+$/.test(e.target.value)) {
                  toast.error('Last name should only contain alphabets');
                }
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone_no', {
              required: true,
              validate: validatePhoneNumber,
              onChange: (e) => {
                if (e.target.value && !/^[0-9]*$/.test(e.target.value)) {
                  // toast.error('Phone number should only contain numbers');
                }
                if (e.target.value && e.target.value.length > 10) {
                  // toast.error('Phone number should not exceed 10 digits');
                }
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your 10-digit phone number"
            maxLength="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            {...register('gender', { 
              required: true,
              onChange: (e) => {
                if (!e.target.value) {
                  toast.error('Please select your gender');
                }
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              {...register('profilepic', {
                required: true,
                onChange: handleFileChange,
                validate: {
                  acceptedFormats: files => 
                    files?.[0]?.type && ['image/jpeg', 'image/jpg', 'image/png'].includes(files[0].type) ||
                    'Only JPG, JPEG and PNG files are allowed',
                  fileSize: files =>
                    files?.[0]?.size <= 5 * 1024 * 1024 || 'File size should be less than 5MB'
                }
              })}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              accept=".jpg,.jpeg,.png"
            />
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="Profile preview"
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            JPG, JPEG or PNG file. Max size 5MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;