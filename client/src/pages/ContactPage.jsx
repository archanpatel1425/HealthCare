import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Send } from 'lucide-react';

const ContactPage = () => {
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
      const response = await axios.post(`http://localhost:5000/api/contact`, formData);
      if (response.status === 200) {
        alert('Message sent successfully');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          We'd love to hear from you. Contact us via email or phone.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {[ 
            { icon: <Mail className="h-8 w-8 text-blue-500" />, title: "Email Us", text: "contact@example.com" },
            { icon: <Mail className="h-8 w-8 text-green-500" />, title: "Call Us", text: "+123 456 7890" }
          ].map((item, index) => (
            <div key={index} className="p-6 border-l-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-blue-500 bg-white">
              {item.icon}
              <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto p-8 shadow-lg bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Mail</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Send  <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-50 py-8 mt-12 text-center text-gray-600">
        <p>We typically respond within 24 hours. For urgent matters, please call us.</p>
      </div>
    </div>
  );
};

export default ContactPage;
