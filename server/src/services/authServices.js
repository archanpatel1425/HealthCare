import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const prisma = new PrismaClient();

export const createUserInDB = async (userData, userRole) => {
    try {
        const existingDoctorByEmail = await prisma.doctor.findUnique({
            where: { email: userData.email },
        });

        const existingPatientByEmail = await prisma.patient.findUnique({
            where: { email: userData.email },
        });

        const existingDoctorByPhone = await prisma.doctor.findUnique({
            where: { phone_no: userData.phone_no },
        });

        const existingPatientByPhone = await prisma.patient.findUnique({
            where: { phone_no: userData.phone_no },
        });

        if (existingDoctorByEmail || existingPatientByEmail) {
            throw new Error('Email already registered as a doctor or patient');
        }

        if (existingDoctorByPhone || existingPatientByPhone) {
            throw new Error('Phone number already registered as a doctor or patient');
        }

        if (userRole == 'doctor') {
            const newUser = await prisma.doctor.create({ data: userData });
            return newUser;
        }
        else {
            const newUser = await prisma.patient.create({ data: userData });
            return newUser;
        }
    } catch (error) {
        console.error('Error saving user to DB:', error);
        throw new Error(error.message);
    }
};
export const saveRefreshToken = async (userId, refreshToken, userType) => {
    if (userType == 'doctor') {
        return prisma.doctor.update({
            where: { doctorId: userId },
            data: { refreshToken: refreshToken }
        });
    } else {
        return prisma.patient.update({
            where: { patientId: userId },
            data: { refreshToken: refreshToken }
        });
    }

}

export const loginUser = async (email, password) => {
    // Find doctor by email
    console.log('in services')
    const doctor = await prisma.doctor.findUnique({
        where: { email },
    });

    // If doctor is not found
    if (!doctor) {
        throw new Error('User not found');
    }
    console.log('step 3')
    // Compare the provided password with the hashed password
    const isPasswordCorrect = doctor.password

    // If password is incorrect
    if (!isPasswordCorrect) {
        throw new Error('Password is incorrect');
    }
    console.log('step 4')

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('opt : ', otp)
    // Send OTP to the user's email
    try {
        mailData = {
            subject: 'Opt for Verification',
            text: `${otp} is yout OTP for login Verification`
        }
        console.log(mailData)
        await sendEmail(doctor.email, mailData);
        return { doctorId: doctor.doctorId, otp };
    } catch (error) {
        throw new Error('Failed to send OTP');
    }
};

