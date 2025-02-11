import React from 'react';
import HeroSectionImage1 from '../../assets/img2.png';
import doctor from '../../assets/doctor.png'
import img1 from '../../assets/crutches.png'
import img2 from '../../assets/xray.png'
import img3 from '../../assets/pulmonary.png'
import img4 from '../../assets/cardiology.png'
import img5 from '../../assets/dental-care.png'
import img6 from '../../assets/neurology.png'
import md1 from '../../assets/Doc1.png'
import md2 from '../../assets/Doc2.jpeg'
import md3 from '../../assets/Doc3.jpg'
import md4 from '../../assets/Doc4.png'
import fd1 from '../../assets/Doc5.jpg'
import fd2 from '../../assets/Doc6.jpg'
import fd3 from '../../assets/Doc7.png'
import amb from '../../assets/amb.jpg'
import eq1 from '../../assets/eq1.jpg'
import eq2 from '../../assets/eq2.jpg'
import eq3 from '../../assets/eq3.png'
import eq4 from '../../assets/eq4.jpg'
import eq5 from '../../assets/eq5.jpg'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const specialties = [
    { name: "Crutches", icon: "🦵", image: img1 },
    { name: "X-ray", icon: "🩻", image: img2 },
    { name: "Pulmonary", icon: "🩻", image: img3 },
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

            <div className=''>
                <div className="h-screen pt-16">
                    <div className="bg-[#d4e8db] w-full h-full">
                        <div className='flex justify-between items-center mx-24'>
                            <div>
                                <div className=' text-5xl font-bold text-center'>
                                    HealWell<br /> <span className='text-4xl'>Your Wellness Our Mission</span>
                                </div>
                                <div></div>
                                <button
                                    className='text-white bg-green-600 p-4 rounded-full mt-8 font-bold'
                                >
                                    Book An Appointment
                                </button>
                            </div>
                            <img src={HeroSectionImage1} alt="" className='mt-8 h-[85vh] w-[40vw]' />
                        </div>
                    </div>
                </div>
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

            <section className="py-12 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Who Are We?
                    </h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto my-2"></div>
                    <p className="text-gray-600">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic natus officiis veniam ea incidunt sed libero quod quibusdam sit! Laudantium id quibusdam, cum tenetur deserunt repellendus reprehenderit atque voluptas sequi?
                        Natus nihil quam ut atque et, obcaecati cum ducimus officia explicabo! Dolor fugiat ipsum possimus sequi accusantium labore, voluptates repudiandae facere consequuntur cupiditate odio quam, dolore ducimus perspiciatis nihil quasi.
                        Provident sunt ut impedit adipisci voluptates. Nihil aliquid corporis aliquam, ad nemo omnis explicabo quam, praesentium quibusdam sequi ipsa! Itaque corrupti adipisci a sapiente distinctio animi suscipit et asperiores enim.
                        In aliquam, labore tempora soluta minus voluptatem dolorum? Illo praesentium laborum excepturi voluptate est omnis accusantium fugiat temporibus, aut commodi? Mollitia velit necessitatibus expedita sequi eos, laudantium ratione sed porro.
                        Aut sapiente earum, quaerat reiciendis, recusandae fugit ratione tenetur ipsa aspernatur ad deleniti. Quasi consequatur exercitationem pariatur dignissimos officia ducimus facere numquam corporis soluta. Blanditiis temporibus molestias exercitationem perferendis ad.
                        Exercitationem nesciunt dignissimos modi deserunt ipsum aut quae placeat? Necessitatibus, facere enim corporis earum reprehenderit quae, aliquam est maxime et numquam quas dolore ducimus doloremque distinctio. Unde repellendus voluptatum vel!
                        Debitis alias aspernatur mollitia laborum! Ratione aliquid totam beatae. Necessitatibus dolorum recusandae dolores ut, sequi exercitationem dolor quidem beatae est expedita molestias quia autem alias aspernatur eum facere vero voluptatem.
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 bg-gray-200">
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

            <div className="p-6 md:p-12 bg-white">
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

            <div className="mx-auto bg-gray-200 py-12 flex flex-col md:flex-row gap-12">
                {/* Left Side - Icons */}
                <div className="ms-16 grid grid-cols-3 gap-6 flex-1">
                    {[amb, eq1, eq2, eq3, eq4, eq5].map((src, index) => (
                        <div key={index} className="bg-white rounded-full shadow-lg border-2 flex items-center justify-center">
                            <img src={src} alt="Medical Icon" className="w-32 h-32 max-w-full max-h-full object-contain" />
                        </div>
                    ))}
                </div>

                {/* Right Side - FAQ */}
                <div className="me-16 flex-1">
                    <h2 className="text-2xl text-center font-bold mb-6">Find Answer To Your Questions</h2>
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
        </>
    );
};

export default HeroSection;