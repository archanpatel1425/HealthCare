import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmailPasswordForm = ({ register, password }) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const validateEmail = async (email) => {
    try {
      const response = await axios.post(`${VITE_API_URL}/auth/check-email`, {
        email,
      });
      if (response.data.exists) {
        toast.error("Email already registered");
        return false;
      }
      return true;
    } catch (error) {
      toast.error("Error checking email");
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">
        Email & Password
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
            validate: validateEmail,
          })}
          className="mt-1 block w-full rounded-md px-3 py-2 border-2 border-green-300 focus:ring-green-600 focus:border-green-600 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 8,
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=[^@$!%*?&]*[@$!%*?&][^@$!%*?&]*$)[A-Za-z\d@$!%*?&]{8,}$/,
          })}
          className="mt-1 block w-full rounded-md px-3 py-2 border-2 border-green-300 focus:ring-green-600 focus:border-green-600 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (value) => value === password,
          })}
          className="mt-1 block w-full border-2 border-green-300 rounded-md px-3 py-2 focus:ring-green-600 focus:border-green-600 outline-none"
        />
      </div>
    </div>
  );
};

export default EmailPasswordForm;
