import express from 'express'
import { uploadQualificationPhoto,uploadProfilePhoto, getDoctorProfile, getPendingAppointments, getAcceptedAppointments, getDoneAppointments, updateDoctorProfile, updateAppointmentStatus, submitPrescription } from '../controllers/doctorController.js';
const router = express.Router();

router.post("/getprofile", getDoctorProfile);
router.post("/updateprofile", updateDoctorProfile);

router.post("/pending", getPendingAppointments);
router.post("/accepted", getAcceptedAppointments);
router.post("/done", getDoneAppointments);
router.post("/status", updateAppointmentStatus);
router.post("/submit-prescription", submitPrescription);
router.post("/uploadprofile-photo", uploadProfilePhoto);
router.post("/uploadqualification-photo", uploadQualificationPhoto);

export default router;
