const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const hash = require('hash.js');
const User = require('../model/user');
const client = require('../utils/redis');
const otp = require('../utils/otp');
const mailer = require('../utils/email');
const sms = require('../utils/twillio');
const responseFile = require('../utils/response');

// db querry to create new user / registration
exports.user_create = async (req, res) => {
    const {
        name, email, number, password,
    } = req;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) { return responseFile.errorResponse(res, 'User Already Exist', 403); }

        // password hashing using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // password hashing using sha256
        // const hashedPassword = hash.sha256().update(password).digest('hex');

        const newUser = new User(
            {
                name,
                email,
                mobile: number,
                password: hashedPassword,
                isEmailVerified: false,
                isPhoneVerified: false,
                isAdmin: false,
            },
        );

        await newUser.save();

        // creating payload for token generation
        const payload = {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        };

        // token generation using payload
        const token = jwt.sign(payload, 'randomString', { expiresIn: 10000 }, { algorithm: 'RS256' });

        // sending otp to mail and mobilephone
        const message = `Your otp for verification is ${otp} and will expire in 24 hours`;
        mailer(email, message);
        sms(number, message);

        // storing otp in redis using  email as keyword for email verification
        const redisEmail = await client.set(email, otp, 'EX', 86400);

        // storing otp in redis using  mobile number as keyword for phone number verification
        const redismobile = await client.set(number, otp, 'EX', 86400);
        return token;
    } catch (error) {
        responseFile.errorResponse(res, 'Server Error', 400);
    }
};

// db querry to login users
exports.user_login = async (req, res) => {
    const { email, password } = req;
    try {
        const user = await User.findOne({ email });

        if (!user) { return responseFile.errorResponse(res, 'No user found', 404); }

        if (!user.isEmailVerified) {
            return responseFile.errorResponse(res, 'Email not verified !', 403);
        }

        if (!user.isPhoneVerified) {
            return responseFile.errorResponse(res, 'Phone number not verified !', 403);
        }
        if (user.status === 'Blocked') {
            return responseFile.errorResponse(res, 'Your account is blocked !', 403);
        }
        if (user.status === 'Deleted') {
            return responseFile.errorResponse(res, 'User unavailable.Your account may be deleted !', 403);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return responseFile.errorResponse(res, 'Invalid  password !', 401); }

        const payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
        const token = await jwt.sign(payload, 'randomString', { expiresIn: 3600 }, { algorithm: 'RS256' });

        return token;
    } catch (error) {
        responseFile.errorResponse(res, 'Server Error', 400);
    }
};

// db querry to forgot password and sent otp
exports.forget_password = async (req, res) => {
    try {
        const { email } = req;
        const message = `Your otp for password reset is ${otp} and is valid for 5 minutes`;
        const redisEmail = await client.set(email, otp, 'EX', 300);
        mailer(email, message);
        return responseFile.successResponse(res, 'OTP sent to your registered email address');
    } catch (error) {
        responseFile.errorResponse(res, 'Server Error', 400);
    }
};

// db querry to reset password
exports.reset_password = async (req, res) => {
    try {
        const {
            email, otp, newPassword, confirmPassword,
        } = req;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        if (newPassword === confirmPassword) {
            client.get(email, async (err, data) => {
                if (err) {
                    console.log('error', err);
                }

                if (data === otp) {
                    User.updateOne({ email }, { password: hashedPassword }, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            return responseFile.successResponse(res, ' ', 'password changed sucessfully');
                        }
                    });
                } else {
                    return responseFile.errorResponse(res, 'Invalid otp...', 401);
                }
            });
        } else {
            return responseFile.errorResponse(res, 'password mismatch', 401);
        }
    } catch (error) {
        console.log(error);
        responseFile.errorResponse(res, 'Server Error', 400);
    }
};
