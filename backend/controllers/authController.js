import User from '../models/userModel.js'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password, phone } = req.body;
    console.log("Username: ", username, " email: ", email);

    const newUser = new User({
        username,
        email,
        password, // store plain password
        phone
    });
    try {

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: pass, ...rest } = newUser._doc;
        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

        res
            .status(201)
            .cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
                sameSite: 'none',
                secure: true
            })
            .json(rest);
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const validPassword = password === validUser.password; // plain text comparison
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        const token = jwt.sign(
            { id: validUser._id, userType: validUser.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: pass, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                expires: expiryDate,
                sameSite: 'none',
                secure: true
            })
            .json(rest);
    }
    catch (error) {
        next(error);
    }
};


export const checkUser = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (user) {
            res.status(200).json({ isNewUser: false, user });
        } else {
            res.status(200).json({ isNewUser: true });
        }
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const addPhone = async (req, res) => {
    const { userId, phone } = req.body;

    if (!userId || !phone) {
        return res.status(400).json({ message: 'User ID and phone number are required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userWithSamePhone = await User.findOne({ phone });
        if (userWithSamePhone) {
            return res.status(400).json({ message: 'Phone number already exists.' });
        }

        user.phone = phone;
        await user.save();

        res.status(200).json({ message: 'Phone number updated successfully', user });
    } catch (error) {
        console.error('Error updating phone number:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
