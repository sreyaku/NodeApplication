const admin_service = require('../services/admin_services');
const responseFile = require('../utils/response');
const validation = require('../validation');

/**
 * Funtion for login of registered admin
 * @param {JSON} req request a JSON object containing email and password to login
 * @param {JSON} res response a JSON object with message and JWT token
 */

exports.adminLogin = async (req, res) => {
    try {
        const validateResult = await validation.loginSchema.validateAsync(req.body);
        const response = await admin_service.admin_login(validateResult, res);
        if (response) {
            responseFile.successResponse(res, response, 'token');
            return;
        }
        console.log(' no response from function user_login !!!');
    } catch (error) {
        if (error.isJoi === true) {
            return responseFile.errorResponse(res, error.details, 422);
        }
        return responseFile.errorResponse(res, error, 400);
    }
};

/**
 * function to get all Users in database
 * @param {Json} req null or JSON object containg status of user
 * @param {JSON} res a response as JSON object with all users in the database
 */

exports.getUserData = async (req, res) => {
    try {
        const response = await admin_service.get_userData(req, res);
    } catch (error) {
        return responseFile.errorResponse(res, 'currently no data available !!!');
    }
};

/**
 * function to update user status
 * @param {Json} req JSON object containg email and status of user
 * @param {JSON} res a response as JSON object with message.
 */

exports.updateUserStatus = async (req, res) => {
    try {
        const response = await admin_service.update_userStatus(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user status updated !!!');
            return;
        }

        return responseFile.errorResponse(res, 'Invalid email !!! ', 400);
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};

/**
 * function to user hard delete
 * @param {Json} req user id through url
 * @param {JSON} res a response as JSON object with message.
 */

exports.userdelete = async (req, res) => {
    try {
        const response = await admin_service.user_delete(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user deleted permanently !!!');
        } else {
            responseFile.errorResponse(res, 'Something went wrong !!!');
        }
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};

/**
 * function to user soft delete
 * @param {Json} req JSON object containg email of user
 * @param {JSON} res a response as JSON object with message.
 */
exports.userSoftdelete = async (req, res) => {
    try {
        const response = await admin_service.user_softdelete(req, res);
        if (response) {
            responseFile.successResponse(res, response, 'user deleted  !!!');
        } else {
            responseFile.errorResponse(res, 'Something went wrong !!!');
        }
    } catch (error) {
        console.log('error', error);
        return responseFile.errorResponse(res, 'Server eror !!! ', 500);
    }
};
