import { createUserInDB, loginUser, checkEmailExists, checkPhoneExists } from '../services/authServices.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
export const doctorSignUp = async (req, res) => {
    try {
        console.log(req.body);
        console.log('-----------------------------------');

        let userData = { ...req.body };

        // Remove confirmPassword
        delete userData.confirmPassword;

        // Convert qualifications to string if needed
        userData['qualifications'] = userData.qualifications.toString();

        // Determine availability days
        let days = [];
        if (userData.availability === 'Weekdays') {
            days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        } else if (userData.availability === 'Weekends') {
            days = ['Saturday', 'Sunday'];
        } else {
            if (!userData.customDays?.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select at least one availability day'
                });
            }
            days = userData.customDays;
        }

        // Update availability format
        userData['availability'] = {
            days: days,
            time: {
                from: userData.timeFrom,
                to: userData.timeTo,
            },
        };

        // Remove unnecessary fields
        delete userData.timeFrom;
        delete userData.timeTo;
        delete userData.customDays;

        // Save to database using the service
        const user = await createUserInDB(userData, 'doctor');
        
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! Welcome aboard.',
            user
        });

    } catch (error) {
        console.error('Error creating user:', error);
        
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create user'
        });
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const exists = await checkEmailExists(email);
        
        res.status(200).json({
            success: true,
            exists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking email availability'
        });
    }
};

export const checkPhone = async (req, res) => {
    try {
        const { phone_no } = req.body;
        
        if (!phone_no) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const exists = await checkPhoneExists(phone_no);
        
        res.status(200).json({
            success: true,
            exists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking phone number availability'
        });
    }
};


export const patientSignUp = async (req, res) => {
    try {
        let userData = req.body;
        delete userData.confirmPassword;

        const user = await createUserInDB(userData,'Patient');
        res.status(201).json({ success: true, message: 'User created successfully !', user });

    } catch (error) {
        console.error('Error creating user:', error);
        if (error.message === 'Email already registered as a doctor or patient') {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message,
        });
    }
}

export const login = async (req, res) => {
    const { identifier, password } = req.body;
    const email = identifier;
    try {
        const response = await loginUser(email, password);
        console.log(response)
        if (!response.success) {
            return res.status(200).json({ success: false, message: response.message });
        }

        res.cookie("token", response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", 
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

