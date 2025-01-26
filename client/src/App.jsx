import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DoctorSignUp_Form from './pages/DoctorSignUp_Form';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientSignUp_Form from './pages/PatientSignUp_Form';

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
      </Routes>
    </div>
  );
}

export default App;
