const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const responseFile = require('../utils/response');
const User = require('../model/user');

// admin login page
exports.admin_login = async (req, res) => {
    const { email, password } = req;

    try {
        const user = await User.findOne({ email });

        if (!user) { return responseFile.errorResponse(res, 'No user found', 404); }

        if (!user.isAdmin) {
            return responseFile.errorResponse(res, 'You are not admin !', 403);
        }
        if (!user.isEmailVerified) {
            return responseFile.errorResponse(res, 'Email not verified !', 403);
        }
        if (!user.isPhoneVerified) {
            return responseFile.errorResponse(res, 'Phone number not verified !', 403);
        }
        if (user.status === 'Blocked') {
            return responseFile.errorResponse(res, 'Your account is blocked !', 403);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return responseFile.errorResponse(res, 'Invalid  password', 401); }

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
        console.log(error);
        responseFile.errorResponse(res, 'Server Error', 400);
    }
};

// db querry of admin page to view user data of all users or id of users with specific status

exports.get_userData = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            const userList = await User.find({}, { password: 0, __v: 0 });
            responseFile.successResponse(res, userList, 'list of all users');
        } else {
            const userList = await User.find({ status }, { _id: 1 });
            responseFile.successResponse(res, userList, `list of  ${status} users`);
        }
    } catch (error) {
        responseFile.errorResponse(res, 'error in fetching user', 400);
    }
};

// db querry to update the user  status  with given email
exports.update_userStatus = async (req, res) => {
    try {
        const { status, email } = req.body;
        const userUpdateResult = await User.updateOne({ email }, { status });
        if (userUpdateResult.matchedCount) {
            return true;
        }
        return false;
    } catch (error) {
        responseFile.errorResponse(res, 'error in fetching user', 400);
    }
};

// db querry to delete the user data with given id (hard delete)
exports.user_delete = async (req, res) => {
    try {
        const userDeleteResult = await User.deleteOne({ _id: req.params.id });
        if (userDeleteResult.deletedCount) {
            return true;
        }
        return false;
    } catch (error) {
        responseFile.errorResponse(res, 'error in fetching user', 400);
    }
};

// db querry to delete the user data with given email (soft delete)
exports.user_softdelete = async (req, res) => {
    try {
        const userDeleteResult = await User.updateOne({ email: req.body.email }, { status: 'Deleted' });
        if (userDeleteResult.matchedCount) {
            return true;
        }
        return false;
    } catch (error) {
        responseFile.errorResponse(res, 'error in fetching user', 400);
    }
};
