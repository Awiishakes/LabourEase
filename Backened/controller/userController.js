import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import { User } from '../models/userSchema.js'
import { deleteImageFromCloudinary, uploadOnCloudinary } from '../utills/cloudinary.js';
import { sendToken } from "../utills/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
    const { name, cnic, contact, role ,password } = req.body
    if (!name || !cnic || !contact || !role || !password) {
        return next(new ErrorHandler('Please fill all the fields!'))
    }
    const isUserExist = await User.findOne({ cnic })
    if (isUserExist) {
        return next(new ErrorHandler('CNIC already registered!'))
    }
    const user = await User.create({
        name,
        cnic,
        contact,
        role,
        password,
    })
    sendToken(user, 200, res, 'User registered successfully!')
})


export const login = catchAsyncError(async (req, res, next) => {
    const { cnic, password } = req.body

    if (!cnic || !password) {
        return next(new ErrorHandler('Please provide CNIC and passsword!', 400))
    }

    const user = await User.findOne({ cnic }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Ivalid CNIC or password!', 400))
    }
    
    if (user.role === 'admin') {
        return next(new ErrorHandler('Ivalid CNIC or password!', 400))
    }
    if (user.status === 'banned') {
        return next(new ErrorHandler('Your Accout has been banned', 400))
    }

    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
        return next(new ErrorHandler('Ivalid CNIC or password!', 400))
    }

    sendToken(user, 200, res, 'User logged in successfully!')
})


export const logout = catchAsyncError(async (req, res, next)=>{
    res.status(200).cookie('token','',{
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true
    }).cookie('checkToken','',{
        expires: new Date(Date.now()),
        secure: true
    }).json({
        success: true,
        message: 'User Logged out!'
    })
})


export const getUser = catchAsyncError((req, res, next)=>{
    const user = req.user
    res.status(200).json({
        success: true,
        user
    })
})


export const updateUserData = catchAsyncError(async (req, res, next) => {
    const { id }= req.params
    const data = req.body
    const { _id } = req.user
    
    if (_id.toString() != id) {
        return next(new ErrorHandler('You are not authorized'))
    }

    const user = await User.findById(id)
    if (!user) {
        return next(new ErrorHandler('You are not authorized'))
    }

    const profile = req.files?.profile
    if (user.profile.public_id && profile) {
        await deleteImageFromCloudinary(user.profile.public_id)
    }

    const imageUrl = profile && await uploadOnCloudinary(profile)

    const updatedUser = await User.findByIdAndUpdate(_id,{
        ...data,
        ...(profile && {profile: imageUrl})
    },{
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: 'Profile data upadted succesfully',
        updatedUser
    })  
})


export const changePassword = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    const { password, newPassword } = req.body
    
    const user = await User.findById(_id).select('+password')
    if (!user) {
        return next(new ErrorHandler('User is not Authorized!'))
    }
    if (!password || !newPassword) {
        return next(new ErrorHandler('current and new Password is required',400))
    }
    
    const isPassword = await user.comparePassword(password)
    if (!isPassword) {
        return next(new ErrorHandler('Ivalid current password!', 400))
    }
    user.password = newPassword
    await user.save()

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    })  
})


export const verifyCnic = catchAsyncError(async (req, res, next) => {
    const { cnic } = req.body

    if (!cnic) {
        return next(new ErrorHandler('cnic is required',400))
    }
    const user = await User.findOne({cnic}).select('contact')
    if (!user) {
        return next(new ErrorHandler('User Not Found!',404))
    }

    res.status(200).json({
        success: true,
        contact: user.contact 
    })  
})

export const sendOtp = catchAsyncError(async (req, res, next) => {
    const { number } = req.body
    if (!number) {
        return next(new ErrorHandler('number is required',400))
    }

    res.status(200).json({
        success: true,
        message: 'Otp sent Successfully',
        otp: 123456
    }) 
})


export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { cnic, newPassword } = req.body
    if (!cnic || !newPassword) {
        return next(new ErrorHandler('cnic and newPassword is required',400))
    }
    const user = await User.findOne({cnic}).select('+password')
    if (!user) {
        return next(new ErrorHandler('User is not Authorized!'))
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    })  
})
