import cookieParser from 'cookie-parser';
import { logout } from '../controller/userController.js';
import { User } from '../models/userSchema.js'
import { catchAsyncError } from './catchAsyncError.js'
import ErrorHandler from "./error.js";
import jwt from 'jsonwebtoken'

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    // const { token } = req.cookies
    //  if (!token) {
    //     return next(new ErrorHandler('User not Authorized', 401))
    // }
        
    const authToken = req.headers.authorization
     if (!authToken) {
        return next(new ErrorHandler('User not Authorized', 401))
    }
    const token = authToken.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (!decoded) {
        return next(new ErrorHandler('User not Authorized', 401))
    }

    const user = await User.findById(decoded.id)
    if (user.status === 'banned') {
        return res.status(400).json({
            success: false,
            message: 'Your Accout has been banned'
        })
    }

    req.user = user

    next()
})