import { createUserInDB } from '../services/authServices.js';
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

        // Convert DOB string to Date
        const [day, month, year] = userData.dob.split('-');
        userData['dob'] = new Date(year, month - 1, day);

        console.log('Processed User Data:', userData);
        // Save to database using the service
        const user = await createUserInDB(userData, 'doctor');
        const accessToken = generateAccessToken(user.doctorId);
        const refreshToken = generateRefreshToken(user.doctorId);
        console.log('------------------------------------------------')
        console.log(accessToken)
        console.log(refreshToken)
        console.log('------------------------------------------------')
        await authService.saveRefreshToken(user.doctorId, refreshToken, 'doctor');

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(201).json({ success: true, message: 'User created successfully !', user, accessToken });

    } catch (error) {
        console.error('Error creating user:', error);

        // Check for duplicate email error
        if (error.message === 'Email already registered as a doctor or patient') {
            return res.status(409).json({
                success: false,
                message: 'Email already registered as a doctor or patient',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message,
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
    const { email, password } = req.body;
    console.log('here')
    console.log(email, password)
    try {
        const response = await authService.loginUser(email, password);
        const doctorId = response.doctorId
        const accessToken = generateAccessToken(doctorId);
        const refreshToken = generateRefreshToken(doctorId);
        console.log('------------------------------------------------')
        console.log(accessToken)
        console.log(refreshToken)
        console.log('------------------------------------------------')
        await authService.saveRefreshToken(doctorId, refreshToken);

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        console.log('controllers : ', response)
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
