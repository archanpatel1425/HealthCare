import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import md1 from '../../assets/Doc1.png';
import md2 from '../../assets/Doc2.jpeg';
import md3 from '../../assets/Doc3.jpg';
import md4 from '../../assets/Doc4.png';
import fd1 from '../../assets/Doc5.jpg';
import fd2 from '../../assets/Doc6.jpg';
import fd3 from '../../assets/Doc7.png';
import fdoc from '../../assets/FDoc.png';
import img4 from '../../assets/cardiology.png';
import img1 from '../../assets/crutches.png';
import img5 from '../../assets/dental-care.png';
import eq1 from '../../assets/eq1-removebg-preview.png';
import eq2 from '../../assets/eq2-removebg-preview.png';
import eq3 from '../../assets/eq3-removebg-preview.png';
import eq4 from '../../assets/eq4-removebg-preview.png';
import eq5 from '../../assets/eq5-removebg-preview.png';
import eq6 from '../../assets/eq6-removebg-preview.png';
import HeroSectionImage1 from '../../assets/img2.png';
import img6 from '../../assets/neurology.png';
import img3 from '../../assets/pulmonary.png';
import img2 from '../../assets/xray.png';
import Footer from '../Footer';


const specialties = [
    { name: "Crutches", icon: "🦵", image: img1 },
    { name: "X-ray", icon: "", image: img2 },
    { name: "Pulmonary", icon: "🩸", image: img3 },
    { name: "Cardiology", icon: "❤️", image: img4 },
    { name: "Dental care", icon: "🦷", image: img5 },
    { name: "Neurology", icon: "🧠", image: img6 },
];

const doctors = [
    {
        name: "Dr. Philip Bailey",
        specialty: "Urology",
        image: md1,
    },
    {
        name: "Dr. Vera Hasson",
        specialty: "Cardiology",
        image: fd1,
    },
    {
        name: "Dr. Matthew Hill",
        specialty: "Neurosurgery",
        image: md2,
    },
    {
        name: "Dr. Jeanette Hoff",
        specialty: "Surgery",
        image: fd2,
    },
    {
        name: "Dr. Robert Smith",
        specialty: "Dermatology",
        image: md3,
    },
    {
        name: "Dr. Lisa Adams",
        specialty: "Pediatrics",
        image: fd3,
    },
    {
        name: "Dr. Kevin Brown",
        specialty: "Orthopedics",
        image: md4,
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

    const { patientData } = useSelector((state) => state.auth)
    const [openIndex, setOpenIndex] = useState(0); // First answer open by default
    const faqs = [
        {
            question: "What is HealWell?",
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
    const navigate = useNavigate()
    const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);

    const [index, setIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(4);

    // Update cards per view based on screen size
    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth < 640) {
                setCardsPerView(1);
            } else if (window.innerWidth < 768) {
                setCardsPerView(2);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(3);
            } else {
                setCardsPerView(4);
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    const loopedDoctors = [...doctors, ...doctors];
    const handleNavigate = () => {
        if (patientData?.doctorId) {
            navigate('/doctor-panel')
        }
        if (patientData?.patientId) {
            navigate('/patient-panel')
        }
    }
    const nextDoctor = () => {
        setIndex((prevIndex) => (prevIndex + 1) % doctors.length);
    };

    return (
        <>
         <div className="h-screen" data-aos="zoom-in-up">
      <div className="h-full">
        <div className="bg-[#d4e8db] w-full h-full">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col-reverse lg:flex-row justify-between items-center h-full gap-8 lg:gap-16">
              {/* Content Section */}
              <div className="flex flex-col items-center lg:w-1/2 max-w-xl">
                <div className="text-center md:text-4xl lg:text-7xl font-bold mb-2">
                  HealWell
                </div>
                <div className="text-center lg:text-4xl md:text-2xl mb-6">
                  Your Wellness, Our Mission
                </div>
                <button 
                  className="text-white bg-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
                  onClick={handleNavigate}
                >
                  Book An Appointment
                </button>
              </div>

              {/* Image Section */}
              <div className="lg:w-1/2 flex justify-end h-full items-center mt-4">
                <img
                  src={HeroSectionImage1}
                  alt="Hero Section"
                  className="h-full w-auto object-contain max-h-[90vh]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
            <section className="py-12 px-4 bg-gray-200" data-aos="zoom-in-up">
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

            <section id='about' className="py-12 px-4 bg-white" data-aos="zoom-in-up">
                <div className="max-w-7xl mx-auto">
                    {/* Centered heading above both sections */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Who Are We?
                        </h2>
                        <div className="w-16 h-1 bg-teal-500 mx-auto my-4"></div>
                    </div>

                    {/* Flex container that becomes column on mobile */}
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Content Section - Full width on mobile, 70% on desktop */}
                        <div className="w-full md:w-[60%] order-2 md:order-1">
                            <div className="max-w-none">
                                <div className="space-y-4 text-center text-gray-600">
                                    <p>
                                        Welcome to HealWell, your trusted partner in healthcare innovation. At HealWell, we are committed to providing a seamless and accessible healthcare experience through our advanced digital platform. Our mission is to bridge the gap between patients and healthcare providers, ensuring quality care is just a click away.
                                    </p>
                                    <p>
                                        With a user-friendly interface, HealWell offers a range of healthcare services, including online consultations, appointment scheduling, electronic medical records, and AI-powered disease prediction. We leverage cutting-edge technology to help users make informed health decisions while enabling doctors to provide efficient and accurate diagnoses.
                                    </p>
                                    <p>
                                        Our platform is built with a strong emphasis on security, ensuring that patient data remains confidential and protected. Whether you're seeking expert medical advice, tracking your health progress, or looking for reliable healthcare information, HealWell is designed to cater to all your healthcare needs.
                                    </p>
                                    <p>
                                        We believe that quality healthcare should be accessible to everyone, regardless of location. Our goal is to revolutionize the healthcare industry by making medical services more efficient, affordable, and patient-centric.
                                    </p>
                                    <p className="font-medium">
                                        Join us in our journey to create a healthier world. HealWell – Your Health, Your Way.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Section - Full width on mobile, 30% on desktop */}
                        <div className="w-full md:w-[40%] order-1 md:order-2">
                            <div className="rounded-lg overflow-hidden shadow-xl">
                                <img
                                    src={fdoc}
                                    alt="Healthcare professionals collaborating"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 md:py-12 px-4 bg-gray-200" data-aos="zoom-in-up">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Meet our specialists</h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto my-2"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>

                <div className="mt-6 md:mt-10 overflow-hidden relative max-w-6xl mx-auto">
                    <motion.div
                        className="flex gap-4 md:gap-8 px-2 md:px-4"
                        animate={{ x: `-${index * (100 / cardsPerView)}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        {loopedDoctors.map((doctor, i) => (
                            <motion.div
                                key={i}
                                className={`
                flex-shrink-0 bg-white shadow-lg rounded-lg overflow-hidden relative group
                ${cardsPerView === 1 ? 'w-full' : ''}
                ${cardsPerView === 2 ? 'w-1/2' : ''}
                ${cardsPerView === 3 ? 'w-1/3' : ''}
                ${cardsPerView === 4 ? 'w-1/4' : ''}
              `}
                            >
                                {/* Image Container with fixed aspect ratio */}
                                <div className="relative pt-[100%]">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="absolute top-0 left-0 w-full h-full object-contain bg-white p-4"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                        <div className="flex gap-3 text-white text-lg md:text-xl">
                                            <FaFacebookF className="cursor-pointer hover:text-teal-400" />
                                            <FaTwitter className="cursor-pointer hover:text-teal-400" />
                                            <FaInstagram className="cursor-pointer hover:text-teal-400" />
                                            <FaLinkedinIn className="cursor-pointer hover:text-teal-400" />
                                        </div>
                                    </div>
                                </div>
                                {/* Text Content */}
                                <div className="p-4 text-center bg-white">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{doctor.name}</h3>
                                    <p className="text-teal-500 text-sm">{doctor.specialty}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-4 md:mt-6 flex justify-center">
                    <button
                        onClick={nextDoctor}
                        className="px-4 md:px-6 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition text-sm md:text-base"
                    >
                        Next Doctor →
                    </button>
                </div>
            </section>

            <div className="p-6 md:p-12 bg-white" data-aos="zoom-in-up">
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

            <div className="mx-auto bg-gray-200 py-8 md:py-12 px-4 md:px-8" data-aos="zoom-in-up">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Left Side - Icons */}
                    <div className="w-full lg:mt-28 md:w-1/2">
                        <div className="grid grid-cols-2 lg:gap-16 sm:grid-cols-3 gap-8 md:gap-6 place-items-center">
                            {[eq1, eq2, eq3, eq4, eq5, eq6].map((index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-full shadow-lg border-2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-4 flex items-center justify-center"
                                >
                                    <img
                                        src={index}
                                        alt={`Medical Icon ${index}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - FAQ */}
                    <div className="w-full md:w-1/2" data-aos="zoom-in-up">
                        <h2 className="text-xl md:text-2xl text-center font-bold mb-4 md:mb-6">
                            Find Answer To Your Questions
                        </h2>
                        <div className="space-y-3 md:space-y-4 max-w-xl mx-auto">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border rounded-lg shadow">
                                    <button
                                        className={`w-full text-left px-4 md:px-6 py-3 md:py-4 font-semibold flex justify-between items-center transition-colors duration-200 ${openIndex === index
                                            ? "bg-teal-500 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <span className="pr-4">{faq.question}</span>
                                        <span className="flex-shrink-0">
                                            {openIndex === index ? "▲" : "▼"}
                                        </span>
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-4 md:px-6 py-3 md:py-4 bg-white text-gray-600">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HeroSection;