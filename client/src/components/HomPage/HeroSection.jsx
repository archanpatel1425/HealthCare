import React from 'react';
import HeroSectionImage1 from '../../assets/img2.png';
import doctor from '../../assets/doctor.png'
import img1 from '../../assets/crutches.png'
import img2 from '../../assets/xray.png'
import img3 from '../../assets/pulmonary.png'
import img4 from '../../assets/cardiology.png'
import img5 from '../../assets/dental-care.png'
import img6 from '../../assets/neurology.png'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Footer from '../Footer';

const specialties = [
    { name: "Crutches", icon: "🦵", image: img1 },
    { name: "X-ray", icon: "🩻", image: img2 },
    { name: "Pulmonary", icon: "🩸", image: img3 },
    { name: "Cardiology", icon: "❤️", image: img4 },
    { name: "Dental care", icon: "🦷", image: img5 },
    { name: "Neurology", icon: "🧠", image: img6 },
];

const doctors = [
    {
        name: "Dr. Philip Bailey",
        specialty: "Urology",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        name: "Dr. Vera Hasson",
        specialty: "Cardiology",
        image: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
        name: "Dr. Matthew Hill",
        specialty: "Neurosurgery",
        image: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
        name: "Dr. Jeanette Hoff",
        specialty: "Surgery",
        image: "https://randomuser.me/api/portraits/women/55.jpg",
    },
    {
        name: "Dr. Robert Smith",
        specialty: "Dermatology",
        image: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
        name: "Dr. Lisa Adams",
        specialty: "Pediatrics",
        image: "https://randomuser.me/api/portraits/women/39.jpg",
    },
    {
        name: "Dr. Kevin Brown",
        specialty: "Orthopedics",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
];

const testimonials = [
    {
        name: "Ralph Jones",
        role: "UX Designer",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        feedback:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
    },
    {
        name: "Francis Jara",
        role: "Biographer",
        image: "https://randomuser.me/api/portraits/women/47.jpg",
        feedback:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
    },
    {
        name: "David Baer",
        role: "Executive",
        image: "https://randomuser.me/api/portraits/men/40.jpg",
        feedback:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum the industry's standard dummy text.",
    },
];

const HeroSection = () => {

    const [openIndex, setOpenIndex] = useState(0); // First answer open by default

    const faqs = [
        {
            question: "What is Medi solution?",
            answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        },
        {
            question: "How do I get a refill on my prescription?",
            answer: "You can get a refill by visiting our online portal or consulting with your doctor for a new prescription.",
        },
        {
            question: "How competent our total treatment?",
            answer: "Our treatments are managed by expert medical professionals with years of experience ensuring the best patient care.",
        },
        {
            question: "If I get sick what should I do?",
            answer: "If you feel unwell, book an appointment with our doctors, or visit the nearest healthcare center for urgent care.",
        },
        {
            question: "What is emergency care to your hospital?",
            answer: "We provide 24/7 emergency care with a dedicated team of doctors and nurses to assist in critical situations.",
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);

    const [index, setIndex] = useState(0);

    // Clone doctors to create infinite loop effect
    const loopedDoctors = [...doctors, ...doctors];

    useEffect(() => {
        const interval = setInterval(() => {
            nextDoctor();
        }, 5000);
        return () => clearInterval(interval);
    }, [index]);

    const nextDoctor = () => {
        setIndex((prevIndex) => (prevIndex + 1) % doctors.length);
    };

    return (
        <>

            <div className="relative w-full min-h-screen flex items-center justify-between bg-gradient-to-r from-cyan-100 via-green-200 to-green-300 px-6 overflow-hidden">
                {/* Left Content Box */}
                <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg max-w-2xl ml-10 flex flex-col items-center">
                    <h1 className="text-3xl text-center font-bold text-gray-900 leading-tight">
                        Take best quality treatment from{" "}
                        <span className="text-black md:text-5xl">
                            HealWell
                        </span>
                    </h1>
                    <p className="mt-4 text-3xl text-center text-gray-600">
                        "Your Wellness, Our Mission"
                    </p>

                    {/* Centered Appointment Button */}
                   
                    {/* Decorative Line */}
                    <div className="absolute bottom-0 left-0 w-20 h-1 bg-yellow-400"></div>
                </div>

                {/* Right Doctor Image */}
                <div className="">
                    <img
                        src={doctor}
                        alt="Doctor"
                        className=""
                    />
                </div>

                {/* Curved Background Shape */}
                <div className="absolute left-0 top-0 w-1/2 h-full bg-white rounded-br-full -z-10"></div>
            </div>


            <section className="py-12 px-4 bg-gray-200">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        What people say?
                    </h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto my-2"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum the industry's standard dummy text.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 shadow-lg rounded-lg text-center border"
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 mx-auto rounded-full border-4 border-gray-200"
                            />
                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                {testimonial.name}
                            </h3>
                            <p className="text-teal-500">{testimonial.role}</p>
                            <p className="mt-3 text-gray-600">{testimonial.feedback}</p>
                            <div className="text-4xl text-gray-200 mt-4">❝</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-12 px-4 bg-white ms-12 me-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Meet our specialists</h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto my-2"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>

                <div className="mt-10 overflow-hidden relative max-w-6xl mx-auto">
                    <motion.div
                        className="flex gap-8 m-4"
                        animate={{ x: `-${index * 25}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {loopedDoctors.map((doctor, i) => (
                            <motion.div
                                key={i}
                                className="w-1/4 flex-shrink-0 bg-white shadow-lg rounded-lg overflow-hidden relative group"
                            >
                                <img src={doctor.image} alt={doctor.name} className="w-full h-72 object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <div className="flex gap-3 text-white text-xl">
                                        <FaFacebookF className="cursor-pointer hover:text-teal-400" />
                                        <FaTwitter className="cursor-pointer hover:text-teal-400" />
                                        <FaInstagram className="cursor-pointer hover:text-teal-400" />
                                        <FaLinkedinIn className="cursor-pointer hover:text-teal-400" />
                                    </div>
                                </div>
                                <div className="p-4 text-center">
                                    <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                                    <p className="text-teal-500">{doctor.specialty}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Manual Navigation */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={nextDoctor}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
                    >
                        Next Doctor →
                    </button>
                </div>
            </section>

            <div className="p-6 md:p-12 bg-gray-100">

                <div className="max-w-6xl mx-auto text-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Our Specialities
                    </h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto my-2"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum the industry's standard dummy text.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    {specialties.map((specialty, index) => (
                        <button
                            key={index}
                            className={`p-4 rounded-lg text-center text-gray-600 font-bold shadow-md ${selectedSpecialty.name === specialty.name ? "bg-teal-500" : "bg-white"
                                }`}
                            onClick={() => setSelectedSpecialty(specialty)}
                        >
                            <span className="text-2xl">{specialty.icon}</span>
                            <p>{specialty.name}</p>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={selectedSpecialty.image}
                        alt={selectedSpecialty.name}
                        className="w-full md:w-1/2 bg-white rounded-lg shadow-lg"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-teal-500">Welcome to our {selectedSpecialty.name} section</h2>
                        <p className="text-gray-600 mt-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magni nemo libero debitis vitae sapiente quos.
                        </p>
                        <button className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg shadow-md">
                            Read More
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
                {/* Left Side - Icons */}
                <div className="grid grid-cols-3 gap-6 flex-1">
                    {[
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-heart-healthcare-flat-icons-inmotus-design.png",
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-ambulance-healthcare-flat-icons-inmotus-design.png",
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-syringe-healthcare-flat-icons-inmotus-design.png",
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-test-tubes-healthcare-flat-icons-inmotus-design.png",
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-first-aid-kit-healthcare-flat-icons-inmotus-design.png",
                        "https://img.icons8.com/external-flat-icons-inmotus-design/64/26e07f/external-medicine-healthcare-flat-icons-inmotus-design.png",
                    ].map((src, index) => (
                        <div key={index} className="bg-white p-4 rounded-full shadow-lg flex items-center justify-center">
                            <img src={src} alt="Medical Icon" className="w-12 h-12" />
                        </div>
                    ))}
                </div>

                {/* Right Side - FAQ */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-6">Just Answer the Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border rounded-lg shadow">
                                <button
                                    className={`w-full text-left px-6 py-4 font-semibold flex justify-between items-center ${openIndex === index ? "bg-teal-500 text-white" : "bg-white text-gray-700"
                                        }`}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.question}
                                    <span>{openIndex === index ? "▲" : "▼"}</span>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 py-4 bg-white text-gray-600">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      <Footer />
        </>
    );
};

export default HeroSection;