import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
export const createUserInDB = async (userData, userRole) => {
    try {
        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'email', 'phone_no', 'password'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new Error(`${field.replace('_', ' ')} is required`);
            }
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(userData.phone_no)) {
            throw new Error('Phone number must be exactly 10 digits');
        }

        // Check existing email and phone
        const emailExists = await checkEmailExists(userData.email);
        // if (emailExists) {
        //     throw new Error('This email is already registered');
        // }

        const phoneExists = await checkPhoneExists(userData.phone_no);
        if (phoneExists) {
            throw new Error('This phone number is already registered');
        }

        // Doctor-specific validations
        if (userRole === 'doctor') {
            if (!userData.specialization) {
                throw new Error('Specialization is required');
            }
            if (!userData.qualifications) {
                throw new Error('Qualifications document is required');
            }
            if (!userData.availability?.days?.length) {
                throw new Error('Please select availability days');
            }
            if (!userData.availability?.time?.from || !userData.availability?.time?.to) {
                throw new Error('Please specify availability time');
            }
        }

        // Create user based on role
        if (userRole === 'doctor') {
            const hashedpassword = await bcrypt.hash(userData.password, 10)
            userData.password = hashedpassword
            const newUser = await prisma.doctor.create({
                data: userData
            });
            return newUser;
        } else {
            const hashedpassword = await bcrypt.hash(userData.password, 10)
            userData.password = hashedpassword
            const newUser = await prisma.patient.create({
                data: userData
            });
            return newUser;
        }
    } catch (error) {
        console.error('Error saving user to DB:', error);
        throw new Error(error.message);
    }
};

export const checkEmailExists = async (email) => {
    try {
        const existingDoctorByEmail = await prisma.doctor.findUnique({
            where: { email }
        });

        const existingPatientByEmail = await prisma.patient.findUnique({
            where: { email }
        });

        return !!(existingDoctorByEmail || existingPatientByEmail);
    } catch (error) {
        console.error('Error checking email:', error);
        throw new Error('Error checking email availability');
    }
};

export const checkPhoneExists = async (phone_no) => {
    try {
        const existingDoctorByPhone = await prisma.doctor.findUnique({
            where: { phone_no }
        });

        const existingPatientByPhone = await prisma.patient.findUnique({
            where: { phone_no }
        });

        return !!(existingDoctorByPhone || existingPatientByPhone);
    } catch (error) {
        console.error('Error checking phone:', error);
        throw new Error('Error checking phone number availability');
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
    try {
        let user = await prisma.patient.findUnique({
            where: { email },
        });

        let userType = "patient";

        if (!user) {
            user = await prisma.doctor.findUnique({
                where: { email },
            });
            userType = "doctor";
        }

        if (!user) {
            return { success: false, message: "User Not Found" };
        }
        const ispassword = await bcrypt.compare(password, user.password)
        if (!ispassword) {
            return { success: false, message: "Invalid Password" };
        }
        if (userType == "doctor") {
            return {
                success: true,
                message: "Login Successful",
                user: {
                    user_id: user.doctorId,
                    email: user.email,
                    userType,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_no: user.phone_no,
                    gender: user.gender,
                    profilepic: user.profilepic,
                },
            };
        } else {
            return {
                success: true,
                message: "Login Successful",
                user: {
                    user_id: user.patientId,
                    email: user.email,
                    userType,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_no: user.phone_no,
                    gender: user.gender,
                    profilepic: user.profilepic,

                },
            };
        }

    } catch (error) {
        return { success: false, message: "Internal server error" };
    }
};

export const findUserById = async (user_id) => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: user_id },
        });

        const patient = await prisma.patient.findUnique({
            where: { patientId: user_id },
        });

        return doctor || patient;
    } catch (error) {
        console.error("Error finding user:", error);
        throw new Error("Error finding user by ID");
    }
};

export const fetchuserlist = async (user_id) => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: user_id }
        });

        const patient = await prisma.patient.findUnique({
            where: { patientId: user_id }
        });

        if (doctor) {
            // Fetch patients who have an appointment with this doctor
            const patientList = await prisma.appointment.findMany({
                where: { doctor_Id: user_id,status:"Scheduled" },
                include: { patient: true }
            });

            // Remove duplicates based on patientId
            const uniquePatients = Array.from(new Map(patientList.map(app => [app.patient.patientId, app.patient])).values());

            return uniquePatients;
        } else if (patient) {
            // Fetch doctors who have consulted this patient
            const doctorsList = await prisma.appointment.findMany({
                where: { patient_Id: user_id ,status:"Scheduled"},
                include: { doctor: true }
            });

            // Remove duplicates based on doctorId
            const uniqueDoctors = Array.from(new Map(doctorsList.map(app => [app.doctor.doctorId, app.doctor])).values());

            return uniqueDoctors;
        } else {
            return { message: "User not found in both doctor and patient models." };
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user list.");
    }
};
