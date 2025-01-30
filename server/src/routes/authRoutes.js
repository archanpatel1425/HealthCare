import express from 'express';
import { login, patientSignUp,doctorSignUp ,checkEmail, checkPhone } from '../controllers/authController.js';

const router = express.Router();

router.post('/patient-signup', patientSignUp);
router.post('/doctor-signup', doctorSignUp);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);

// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password/:token', authController.resetPassword);

export default router;