import axios from 'axios';
import { Mail, Phone, PhoneCall, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/contact`, formData,{withCredentials:true});
      if (response.status === 200) {
        alert('Message sent successfully');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      if (error.response.data.message === "Unauthorized: No token provided") {
        window.location.href = "/login"
      }

      console.error('Error:', error);
    }
  };

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-b from-green-50 to-green-100" data-aos="zoom-in-up">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-12 md:py-16 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Get in Touch</h1>
        <p className="text-md md:text-lg text-green-200 max-w-2xl mx-auto">
          We'd love to hear from you. Contact us via email or phone.
        </p>
      </div>

      {/* Contact Details */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {[
            { icon: <Mail className="h-10 w-10 text-green-500" />, title: "Email Us", text: "healthcare1804@gmail.com" },
            { icon: <Phone className="h-10 w-10 text-green-500" />, title: "Call Us", text: "+91 91041 24005" },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 border-l-4 border-green-500 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow flex items-center gap-4"
            >
              {item.icon}
              <div>
                <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-green-700">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 text-sm md:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 text-sm md:text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-5 rounded-md shadow-lg text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all duration-300"
            >
              Send <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-green-50 py-6 md:py-8 mt-12 text-center text-gray-600 px-4">
        <p className="text-sm md:text-base">We typically respond within 24 hours. For urgent matters, please call us.</p>
      </div>
    </div>
  );
};

export default ContactPage;
