import express from 'express';
import { login, patientSignUp,doctorSignUp ,checkEmail, checkPhone,getUserData,fetchUserList,getMess,logOut } from '../controllers/authController.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';

const router = express.Router();

router.post('/patient-signup', patientSignUp);
router.post('/doctor-signup', doctorSignUp);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);
router.post('/check',verifyAccessToken,getMess);
router.post('/getdata',verifyAccessToken,getUserData);
router.post('/fetchuserlist',verifyAccessToken,fetchUserList);
router.post('/logout',logOut);

// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password/:token', authController.resetPassword);

export default router;