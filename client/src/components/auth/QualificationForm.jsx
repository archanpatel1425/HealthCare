import React, { useState } from 'react';
import { toast } from 'react-toastify';

const specialization = [
  'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician',
  'Psychiatrist', 'Dentist', 'General Practitioner', 'ENT Specialist', 'Ophthalmologist'
];

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const QualificationsForm = ({ register, watch, isCustomAvailability, setIsCustomAvailability }) => {
  const [photo, setPhoto] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
      
      if (!acceptedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, and JPEG files are allowed');
        e.target.value = '';
        return;
      }
      
      setPhoto(file);
    }
  };

  // Function to validate time range
  const validateTimeRange = (timeFrom, timeTo) => {
    if (!timeFrom || !timeTo) return true;
    return timeFrom < timeTo;
  };

  // Function to validate all fields
  const validateFields = () => {
    const values = watch();
    const errors = [];

    if (!values.specialization) {
      errors.push('Please select a specialization');
    }

    if (!values.experience) {
      errors.push('Please enter your years of experience');
    } else if (values.experience < 0) {
      errors.push('Experience cannot be negative');
    }

    if (!values.qualifications || values.qualifications.length === 0) {
      errors.push('Please upload your qualifications document');
    }

    if (!values.availability) {
      errors.push('Please select your availability');
    }

    if (isCustomAvailability && (!values.customDays || values.customDays.length === 0)) {
      errors.push('Please select at least one day for custom availability');
    }

    if (!values.timeFrom) {
      errors.push('Please select start time');
    }

    if (!values.timeTo) {
      errors.push('Please select end time');
    } else if (!validateTimeRange(values.timeFrom, values.timeTo)) {
      errors.push('End time must be after start time');
    }

    return errors;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">Qualifications</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Specialist Type</label>
        <select
          {...register('specialization', { 
            required: true,
            onChange: (e) => {
              if (!e.target.value) {
                toast.error('Please select a specialization');
              }
            }
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Specialist Type</option>
          {specialization.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
        <input
          type="number"
          min="0"
          {...register('experience', { 
            required: true,
            min: 0,
            onChange: (e) => {
              if (!e.target.value) {
                toast.error('Please enter your years of experience');
              } else if (e.target.value < 0) {
                toast.error('Experience cannot be negative');
              }
            }
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Qualifications (PDF, JPG, JPEG)
        </label>
        <input
          type="file"
          {...register('qualifications', {
            required: true,
            onChange: handleFileChange
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
          accept=".pdf,.jpg,.jpeg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <select
          {...register('availability', {
            required: true,
            onChange: (e) => {
              setIsCustomAvailability(e.target.value === 'Custom');
              if (!e.target.value) {
                toast.error('Please select your availability');
              }
            }
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Availability</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      {isCustomAvailability && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Days</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {availableDays.map(day => (
              <div key={day} className="flex items-center">
                <input
                  type="checkbox"
                  {...register('customDays', {
                    validate: value => {
                      if (isCustomAvailability && (!value || value.length === 0)) {
                        toast.error('Please select at least one day');
                        return false;
                      }
                      return true;
                    }
                  })}
                  value={day}
                  className="mr-2"
                />
                <label>{day}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Available Time</label>
        <div className="flex space-x-4">
          <div>
            <input
              type="time"
              {...register('timeFrom', {
                required: true,
                onChange: (e) => {
                  if (!e.target.value) {
                    toast.error('Please select start time');
                  }
                }
              })}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <input
              type="time"
              {...register('timeTo', {
                required: true,
                onChange: (e) => {
                  if (!e.target.value) {
                    toast.error('Please select end time');
                  } else {
                    const timeFrom = watch('timeFrom');
                    if (!validateTimeRange(timeFrom, e.target.value)) {
                      toast.error('End time must be after start time');
                    }
                  }
                }
              })}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationsForm;