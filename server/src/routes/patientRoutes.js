import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoctorsBySpecialization,createAppointment  } from '../controllers/patientController.js';
import { authenticateToken } from '../middleware/protectRoute.js';
const patientRoutes = express.Router();

patientRoutes.get("/getAppointments",authenticateToken, getAppointmentsByPatient );
patientRoutes.post("/updatePatientprofile",authenticateToken, updatePatientProfile );
patientRoutes.get("/prescription/:patientId",authenticateToken, getPrescriptionsByPatient);
patientRoutes.get("/doctorsByspecialization",authenticateToken, getDoctorsBySpecialization);
patientRoutes.post("/appointment",authenticateToken, createAppointment);

export default patientRoutes;


 

 