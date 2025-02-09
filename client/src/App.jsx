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
import DoctorDetails from './pages/patient-panel/DoctorDetails.jsx';
import DoctorList from './pages/patient-panel/DoctorList.jsx';
import PatientHome from './pages/patient-panel/PatientHome.jsx';
import Prescriptions from './pages/patient-panel/Prescriptions.jsx';
import PatientSignUp_Form from './pages/PatientSignUp_Form';
import SkinCancer from './SkinCancer.jsx';
import SkinChecker from './SkinChecker.jsx';
function App() {

  const location = useLocation();
  const showNavbar =
    ['/', '/about', '/contactus'].includes(location.pathname) ||
    location.pathname.startsWith('/patient-panel');

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meet/:meetId" element={<Meeting />} />
        <Route path="/signup/doctor" element={<DoctorSignUp_Form />} />
        <Route path="/signup/patient" element={<PatientSignUp_Form />} />
        <Route path="/patient-panel/*" element={<PatientHome />} />
        <Route path="/chat" element={<ChatPanel />} />
        <Route path="/doctor-panel/*" element={<DoctorHome />} />
        <Route path="/sc" element={<SkinCancer />} />
        <Route path="/sk" element={<SkinChecker />} />
        <Route path="/dl" element={<DoctorList />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/pr" element={<Prescriptions />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
}

export default App;