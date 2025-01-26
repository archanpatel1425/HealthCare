import React, { useEffect, useState } from 'react';

const PersonalDetailsForm = ({ register, errors }) => {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
   console.log('photo')
   console.log(photo)
  }, [photo])
  
  const handleFileChange = (e) => {
    console.log('changed')
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
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
              required: 'First name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'First name should only contain alphabets',
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            {...register('last_name', {
              required: 'Last name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Last name should only contain alphabets',
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be exactly 10 digits',
              }
            })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            {...register('gender', { required: 'Gender is required' })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Photos URL</label>
          <input
            type="file"
            onChange={handleFileChange}
            {...register('profilepic', { required: 'Profile photo is required' })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
          {errors.photos && <p className="text-red-500 text-sm">{errors.photos.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;