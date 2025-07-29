const User = require('./../models/userModel');
const { createToken } = require('./../utils/jwtUtils');
const jwt = require('jsonwebtoken');


exports.signup = async(req,res)=>{
    try{
         const {name, email, password} = req.body;

         // Create new user  (password gets hashed in model)
         const user = await User.create({name, email, password});

         // Generate JWT token
         const token = createToken(user._id);

         // Respond with user data and token
         res.status(200).json({
            status: 'success',
            token,
            data:{
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
         })

    }catch (err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
};


exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
    
    // 1. Check if email and passsword are provided
    if(!email || !password){
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }

    // 2. Find user and include the password field
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists and password is correct
    if(!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password'
        });
    }

    // 4. Generate JWT token
    const token = createToken(user._id);

    // 5. Respond with token and user data (excluding password)
    res.status(200).json({
        status: 'success',
        token,
        data:{
            user:{
                id: user._id,
                name: user.name,
                email: user.email            
            }
        }
    });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}

exports.updateMyPassword = async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;

        // 1. Get User from DB with password
        const user = await User.findById(req.user._id).select('+password');

        // 2. Check if current password is correct
        const isCorrect = await user.correctPassword(currentPassword, user.password);
        if(!isCorrect) {
            return res.status(401).json({
                status: 'fail',
                message: 'Your current password is incorrect',
            });
        }

        // 3. Update to new password
        user.password = newPassword;
        await user.save(); // not findByIdAndUpdate to trigger pre-save hashinng

        // 4. Generate new JWT token
        const token = createToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            messagee: 'Password updated succesfully'
        });
    }catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.getMe = async (req, res) => {
  try{
    const user = await User.findById(req.user._id);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
  }catch (err) {
    res.status(500).json({
        status: 'fail',
        message: err.message
    });
  }
};

exports.updateMe = async (req, res) => {
    try{
        // Prevent password updates here
        if (req.body.password) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates. Use /updateMyPassword.'
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );
 
    res.status(200).json({
        status: 'success',
        data:{
            user: updatedUser
        }
    });
 } catch (err){
    res.status(500).json({
        status: 'fail',
        message: err.message
    });
 }
};