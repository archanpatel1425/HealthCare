import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    // <footer className="bg-green-700 text-white py-20 mt-20 rounded-t-3xl shadow-lg">
    //   <div className="container mx-auto px-6 sm:px-8 lg:px-12">
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
    //       {/* Logo and Tagline */}
    //       <div className="flex flex-col items-center md:items-start">
    //         <a href="/" className="text-5xl font-extrabold tracking-wide hover:text-green-200 transition duration-300">
    //           Health<span className="text-green-300">Care</span>
    //         </a>
    //         <p className="mt-6 text-lg text-green-200 text-center md:text-left">
    //           Providing world-class healthcare services with compassion and excellence. We're here to care for you.
    //         </p>
    //       </div>

    //       {/* Navigation Links */}
    //       <div className="flex flex-col items-center md:items-start">
    //         <h3 className="text-3xl font-semibold mb-6 text-green-200">Quick Links</h3>
    //         <ul className="space-y-4 text-lg">
    //           <li>
    //             <a href="#home" className="hover:text-green-300 transition duration-300 transform hover:scale-105">Home</a>
    //           </li>
    //           <li>
    //             <a href="#services" className="hover:text-green-300 transition duration-300 transform hover:scale-105">Services</a>
    //           </li>
    //           <li>
    //             <a href="#about" className="hover:text-green-300 transition duration-300 transform hover:scale-105">About Us</a>
    //           </li>
    //           <li>
    //             <a href="#contact" className="hover:text-green-300 transition duration-300 transform hover:scale-105">Contact</a>
    //           </li>
    //         </ul>
    //       </div>

    //       {/* Contact and Social Media */}
    //       <div className="flex flex-col items-center md:items-start">
    //         <h3 className="text-3xl font-semibold mb-6 text-green-200">Contact Us</h3>
    //         <p className="text-lg mb-4">Email: <span className="text-green-300">info@healthcare.com</span></p>
    //         <p className="text-lg mb-6">Phone: <span className="text-green-300">+1 (800) 123-4567</span></p>

    //         {/* Social Media Links */}
    //         <div className="flex space-x-8 mt-6">
    //           <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    //             <FontAwesomeIcon icon={faFacebook} className="h-10 w-10 text-white hover:text-green-300 transition transform duration-300 hover:scale-125" />
    //           </a>
    //           <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
    //             <FontAwesomeIcon icon={faTwitter} className="h-10 w-10 text-white hover:text-green-300 transition transform duration-300 hover:scale-125" />
    //           </a>
    //           <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    //             <FontAwesomeIcon icon={faInstagram} className="h-10 w-10 text-white hover:text-green-300 transition transform duration-300 hover:scale-125" />
    //           </a>
    //           <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
    //             <FontAwesomeIcon icon={faLinkedin} className="h-10 w-10 text-white hover:text-green-300 transition transform duration-300 hover:scale-125" />
    //           </a>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Footer Bottom */}
    //     <div className="mt-16 text-center text-lg text-green-200">
    //       <p>&copy; {new Date().getFullYear()} HealthCare. All rights reserved. Crafted with care for you.</p>
    //     </div>
    //   </div>
    // </footer>

    <>
      {/* Footer Section -------------------------> */}
      <footer className="bg-green-300 text-green-800 py-10 px-6 md:px-16" data-aos="zoom-in-up">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* HealWell Section */}
          <div>
            <h3 className="font-bold">HealWell</h3>
            <ul className="mt-2 space-y-1">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* For Patients */}
          <div>
            <h3 className="font-bold">For patients</h3>
            <ul className="mt-2 space-y-1">
              <li>Search for doctors</li>
              <li>Search for clinics</li>
              <li>Search for hospitals</li>
              <li>HealWell Plus</li>
              <li>Covid Hospital listing</li>
              <li>HealWell Care Clinics</li>
              <li>Read health articles</li>
              <li>Read about medicines</li>
              <li>HealWell drive</li>
              <li>Health app</li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h3 className="font-bold">For doctors</h3>
            <ul className="mt-2 space-y-1">
              <li>HealWell Profile</li>
            </ul>
          </div>

          {/* For Clinics */}
          <div>
            <h3 className="font-bold">For clinics</h3>
            <ul className="mt-2 space-y-1">
              <li>Ray by HealWell</li>
              <li>HealWell Reach</li>
              <li>Ray Tab</li>
              <li>HealWell Pro</li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="font-bold">More</h3>
            <ul className="mt-2 space-y-1">
              <li>Help</li>
              <li>Developers</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>PCS T&C</li>
              <li>Healthcare Directory</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold">Social</h3>
            <ul className="mt-2 space-y-1">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>Youtube</li>
              <li>Github</li>
            </ul>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-green-800 flex justify-center items-center">
            <span className="text-green-800 mr-2">●</span> HealWell
          </h2>
          <p className="text-sm mt-2">Copyright © 2017, HealWell. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}