import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoctorsBySpecialization,createAppointment,getDoctorList,getDoctorInfo,getDoctorSchedule  } from '../controllers/patientController.js';
import {verifyAccessToken} from '../utils/tokenUtils.js'
const router = express.Router();

router.get("/getAppointments",verifyAccessToken ,getAppointmentsByPatient );
router.post("/updatePatientprofile",verifyAccessToken ,updatePatientProfile );
router.get("/getpriscription",verifyAccessToken ,getPrescriptionsByPatient);
router.get("/doctors-by-category", verifyAccessToken,getDoctorsBySpecialization);
router.get("/doctorlist", verifyAccessToken,getDoctorList);
router.get("/doctorinfo/:doctorId", verifyAccessToken,getDoctorInfo);
router.post("/book-appointment",verifyAccessToken, createAppointment);
router.post("/get-schedule",verifyAccessToken ,getDoctorSchedule);

export default router;