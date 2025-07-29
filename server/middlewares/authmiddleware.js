const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    try{
        // 1. Get token from headers
        let token;
        if(
            req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // 2. If no token, block access
        if(!token){
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in!',
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Get user from decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                status:'fail',
                message: 'The user belonging to this token no longer exists',
            });
        }

        // 5. Attach user to request
        req.user = user;
        next();
    }catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired token'
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};