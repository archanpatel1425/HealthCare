import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import ChatPanel from './pages/ChatPanel.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DoctorHome from './pages/doctor-panel/Home';
import DoctorSignUp_Form from './pages/DoctorSignUp_Form';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Meeting from './pages/Meeting.jsx';
import PatientHome from './pages/patient-panel/PatientHome.jsx';
import PatientSignUp_Form from './pages/PatientSignUp_Form';
import ProtectedRoute from './ProtectedRoute';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  const location = useLocation();
  const showNavbar =
    ['/', '/about', '/contact'].includes(location.pathname) ||
    location.pathname.startsWith('/patient-panel') || location.pathname.startsWith('/doctor-panel');

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/doctor" element={<DoctorSignUp_Form />} />
        <Route path="/signup/patient" element={<PatientSignUp_Form />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/meet/:meetId" element={<ProtectedRoute element={<Meeting />} />} />
        <Route path="/chat" element={<ProtectedRoute element={<ChatPanel />} />} />
        <Route path="/doctor-panel/*" element={<ProtectedRoute element={<DoctorHome />} />} />
        <Route path="/patient-panel/*" element={<ProtectedRoute element={<PatientHome />} />} />
      </Routes>
    </div>
  );
}

export default App;
