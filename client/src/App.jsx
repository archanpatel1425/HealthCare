import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatPanel from './pages/ChatPanel.jsx';
import DoctorSignUp_Form from './pages/DoctorSignUp_Form';
import Home from './pages/Home';
import Login from './pages/Login';
import Meeting from './pages/Meeting.jsx';
import PatientSignUp_Form from './pages/PatientSignUp_Form';
import PatientPanel from './pages/patient-panel/Home.jsx';


import DoctorHome from './pages/doctor-panel/Home';
import SkinCancer from './SkinCancer.jsx';
import SkinChecker from './SkinChecker.jsx';
import AppointmentForm from './pages/patient-panel/AppointmentForm.jsx';

function App() {
  const location = useLocation();

  const pathsWithNavbar = ['/', '/about', '/contactus'];

  return (
    <div>
      {pathsWithNavbar.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meet/:meetId" element={<Meeting />} />
        <Route path="/signup/doctor" element={<DoctorSignUp_Form />} />
        <Route path="/signup/patient" element={<PatientSignUp_Form />} />
        <Route path="/patient_panel" element={<PatientPanel />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />

        <Route path="/chat" element={<ChatPanel />} />
        <Route path="/doctor-panel/*" element={<DoctorHome />} />
        <Route path="/sc" element={<SkinCancer />} />
        <Route path="/sk" element={<SkinChecker />} />
      </Routes>
    </div>
  );
}

export default App;