import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DoctorSignUp_Form from './pages/DoctorSignUp_Form';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientSignUp_Form from './pages/PatientSignUp_Form';
import PatientPanel from './pages/patient-panel/Home.jsx';
import Dashboard from "./pages/patient-panel/Dashboard";
import Appointment from "./pages/patient-panel/Appointment";
import ContactPage from './pages/ContactPage.jsx';

function App() {
  const location = useLocation();

  const pathsWithNavbar = ['/', '/about', '/contactus'];

  return (
    <div>
      {pathsWithNavbar.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/doctor" element={<DoctorSignUp_Form />} />
        <Route path="/signup/patient" element={<PatientSignUp_Form />} />
        <Route path="/patient-panel/" element={<PatientPanel />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="*" element={<Dashboard />} /> {/* Default route */}
        </Route>
        <Route path='/contact' element={<ContactPage/>} />
      </Routes>
    </div>
  );
}

export default App;