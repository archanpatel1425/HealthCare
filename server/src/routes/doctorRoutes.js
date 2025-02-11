import express from 'express'
import { uploadQualificationPhoto,uploadProfilePhoto, getDoctorProfile, getPendingAppointments, getAcceptedAppointments, getDoneAppointments, updateDoctorProfile, updateAppointmentStatus, submitPrescription,getId } from '../controllers/doctorController.js';
import {verifyAccessToken} from '../utils/tokenUtils.js'

const router = express.Router();

router.post("/getprofile",verifyAccessToken ,getDoctorProfile);
router.post("/updateprofile", verifyAccessToken,updateDoctorProfile);

router.post("/pending",verifyAccessToken ,getPendingAppointments);
router.post("/accepted", verifyAccessToken,getAcceptedAppointments);
router.post("/done",verifyAccessToken, getDoneAppointments);
router.post("/status",verifyAccessToken ,updateAppointmentStatus);
router.post("/submit-prescription", verifyAccessToken,submitPrescription);
router.post("/uploadprofile-photo", verifyAccessToken,uploadProfilePhoto);
router.post("/uploadqualification-photo",verifyAccessToken, uploadQualificationPhoto);
router.post("/getId",verifyAccessToken,getId)
export default router;
