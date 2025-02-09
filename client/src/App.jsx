import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatPanel from './pages/ChatPanel.jsx';
import DoctorSignUp_Form from './pages/DoctorSignUp_Form';
import Home from './pages/Home';
import Login from './pages/Login';
import Meeting from './pages/Meeting.jsx';
import PatientPanel from './pages/patient-panel/Home.jsx';
import PatientSignUp_Form from './pages/PatientSignUp_Form';


import { ToastContainer } from 'react-toastify';
import ScheduleAppointment from './components/Patient/ScheduleAppointment.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DoctorHome from './pages/doctor-panel/Home';
import BookAppointment from './pages/patient-panel/BookAppointment.jsx';
import Dashboard from './pages/patient-panel/Dashboard.jsx';
import DoctorDetails from './pages/patient-panel/DoctorDetails.jsx';
import DoctorList from './pages/patient-panel/DoctorList.jsx';
import Prescriptions from './pages/patient-panel/Prescriptions.jsx';
import SkinCancer from './SkinCancer.jsx';
import SkinChecker from './SkinChecker.jsx';
function App() {
  const location = useLocation();

  const pathsWithNavbar = ['/', '/about', '/contactus', '/patient-panel'];

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {pathsWithNavbar.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meet/:meetId" element={<Meeting />} />
        <Route path="/signup/doctor" element={<DoctorSignUp_Form />} />
        <Route path="/signup/patient" element={<PatientSignUp_Form />} />
        <Route path="/patient-panel" element={<PatientPanel />} />

        <Route path="/chat" element={<ChatPanel />} />
        <Route path="/doctor-panel/*" element={<DoctorHome />} />
        <Route path="/sc" element={<SkinCancer />} />
        <Route path="/sk" element={<SkinChecker />} />
        <Route path="/dl" element={<DoctorList />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/pr" element={<Prescriptions />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/patient-panel" element={<Dashboard />} />
        <Route path="/patient-panel/book-appointment" element={<BookAppointment />} />
        <Route path="/patient-panel/book-slot" element={<ScheduleAppointment />} />
      </Routes>
    </div>
  );
}

export default App;