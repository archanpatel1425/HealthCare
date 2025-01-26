import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.post('/logout', authController.logout);
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password/:token', authController.resetPassword);

export default router;