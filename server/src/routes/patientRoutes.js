import express from 'express'
import { getAppointmentsByPatient, updatePatientProfile, getPrescriptionsByPatient, getDoctorsBySpecialization,createAppointment,getDoctorList,getDoctorInfo  } from '../controllers/patientController.js';
import {verifyAccessToken} from '../utils/tokenUtils.js'
const router = express.Router();

router.get("/getAppointments",verifyAccessToken ,getAppointmentsByPatient );
router.post("/updatePatientprofile",verifyAccessToken ,updatePatientProfile );
router.get("/getpriscription",verifyAccessToken ,getPrescriptionsByPatient);
router.get("/DoctorsBycategory", verifyAccessToken,getDoctorsBySpecialization);
router.get("/doctorlist", verifyAccessToken,getDoctorList);
router.get("/doctorinfo/:doctorId", verifyAccessToken,getDoctorInfo);
router.post("/appointment",verifyAccessToken, createAppointment);


export default router;