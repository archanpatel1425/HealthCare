// QualificationsForm.jsx
import React from 'react';

const specialization = [
  'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician',
  'Psychiatrist', 'Dentist', 'General Practitioner', 'ENT Specialist', 'Ophthalmologist'
];

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const QualificationsForm = ({ register, errors, touchedFields, isCustomAvailability, setIsCustomAvailability }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">Qualifications</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Specialist Type</label>
        <select
          {...register('specialization', { required: 'Specialist type is required' })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        >
          <option value="">Select Specialist Type</option>
          {specialization.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {touchedFields.specialization && errors.specialization && (
          <p className="text-red-500 text-xs">{errors.specialization.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
        <input
          type="input"
          {...register('experience', { required: 'Experience is required' })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        />
        {touchedFields.experience && errors.experience && (
          <p className="text-red-500 text-xs">{errors.experience.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Qualifications  (PDF, JPG, JPEG)
        </label>
        <input
          type="file"
          {...register('qualifications', {
            required: 'License/Degree is required',
            validate: {
              acceptedFormats: (file) =>
                ['application/pdf', 'image/jpeg', 'image/jpg'].includes(file?.[0]?.type) ||
                'Only PDF, JPG, and JPEG files are allowed',
            },
          })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
          accept=".pdf, .jpg, .jpeg"
        />
        {errors.license && (
          <p className="text-red-500 text-xs">{errors.license.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <select
          {...register('availability')}
          onChange={(e) => setIsCustomAvailability(e.target.value === 'Custom')}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        >
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
                  {...register('customDays')}
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
              {...register('timeFrom', { required: 'Start time is required' })}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
            {touchedFields.timeFrom && errors.timeFrom && (
              <p className="text-red-500 text-xs">{errors.timeFrom.message}</p>
            )}
          </div>
          <div>
            <input
              type="time"
              {...register('timeTo', { required: 'End time is required' })}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
            {touchedFields.timeTo && errors.timeTo && (
              <p className="text-red-500 text-xs">{errors.timeTo.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationsForm;