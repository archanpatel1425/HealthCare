import express from 'express'
import { getDoctorProfile, getPendingAppointments, getAcceptedAppointments, getDoneAppointments, updateDoctorProfile, updateAppointmentStatus, submitPrescription } from '../controllers/doctorController.js';
const router = express.Router();

router.post("/getprofile", getDoctorProfile);
router.post("/updateprofile", updateDoctorProfile);

router.post("/pending", getPendingAppointments);
router.post("/accepted", getAcceptedAppointments);
router.post("/done", getDoneAppointments);
router.post("/status", updateAppointmentStatus);
router.post("/submit-prescription", submitPrescription);

export default router;
