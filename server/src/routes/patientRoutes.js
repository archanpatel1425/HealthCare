import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoctorsBySpecialization,  } from '../controllers/patientController.js';
const router = express.Router();

router.get("/getAppointments", getAppointmentsByPatient );
router.post("/updatePatientprofile", updatePatientProfile );
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/DoctorsBycategory", getDoctorsBySpecialization);


export default router;




    