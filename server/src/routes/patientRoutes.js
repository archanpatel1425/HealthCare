import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoneAppointments, updateDoctorProfile, updateAppointmentStatus } from '../controllers/patientController.js';
const router = express.Router();

router.get("/getAppointments", getAppointmentsByPatient );
router.post("/updatePatientprofile", updatePatientProfile );
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/:reportId", getMedicalReportById); 
router.get("/:reportId", updateMedicalReport); 
router.get("/:reportId", deleteMedicalReport); 

export default router;




