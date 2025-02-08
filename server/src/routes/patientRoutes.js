import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoctorsBySpecialization, createAppointment } from '../controllers/patientController.js';
import { verifyAccessToken } from '../utils/tokenUtils.js'
const router = express.Router();

router.get("/getAppointments", verifyAccessToken, getAppointmentsByPatient);
router.post("/updatePatientprofile", verifyAccessToken, updatePatientProfile);
router.get("/patient/:patientId", verifyAccessToken, getPrescriptionsByPatient);
router.get("/DoctorsBycategory", verifyAccessToken, getDoctorsBySpecialization);
router.post("/appointment", verifyAccessToken, createAppointment);


export default router;