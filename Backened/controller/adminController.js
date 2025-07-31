import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import { Requests } from '../models/requestSchema.js'
import { User } from '../models/userSchema.js'
import { Work } from '../models/workSchema.js'
import { deleteImageFromCloudinary, uploadOnCloudinary } from '../utills/cloudinary.js'
import { mainCategories } from "../utills/data.js";
import { sendToken } from '../utills/jwtToken.js'


export const login = catchAsyncError(async (req, res, next) => {
  const { cnic, password } = req.body

  if (!cnic || !password) {
      return next(new ErrorHandler('Please provide CNIC and passsword!', 400))
  }

  const user = await User.findOne({ cnic }).select('+password')
  if (!user) {
      return next(new ErrorHandler('Ivalid CNIC or password!', 400))
  }
  if (user.role != 'admin') {
    return next(new ErrorHandler('Ivalid CNIC or password!', 400))
  }

  const isPassword = await user.comparePassword(password)
  if (!isPassword) {
      return next(new ErrorHandler('Ivalid CNIC or password!', 400))
  }

  sendToken(user, 200, res, 'User logged in successfully!')
})


export const getDashboardDetials = catchAsyncError(async (req, res, next)=>{
    const { role } = req.user
    if (role != 'admin') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }

    const totalUsers = await User.countDocuments({role: {$ne: 'admin'}}) || 0;
    const totalServices = await Work.countDocuments() || 0;

    const servicesByCategory = await Work.aggregate([
    { $group: {
            _id: "$category",
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] }, },
        },
    },]);

    // Transform the dataset to include main categories and totals
    const servicesByMainCategory = mainCategories.map((mainCategory) => {
      const subcategoryData = mainCategory.subCategories.map((sub) => {
        return servicesByCategory.find((service) => service._id === sub) || { total: 0, active: 0 }
      })
      const total = subcategoryData.reduce((sum, item) => sum + item.total, 0)
      const active = subcategoryData.reduce((sum, item) => sum + item.active, 0)
      return {
        category: mainCategory.category,
        totalSubcategories: mainCategory.subCategories.length,
        totalPostedServices: total,
        activeServices: active,
      }
    })

    // Total Requests and Pending Requests
    const totalRequests = await Requests.countDocuments() || 0;
    const pendingRequests = await Requests.countDocuments({ status: "accepted" }) || 0;

    // Requests by Month
    const requestsByMonth = await Requests.aggregate([
      { $group: {
          _id: { $month: "$postedOn" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Services by Month
    const servicesByMonth = await Work.aggregate([
      {$group: {
          _id: { $month: "$postedOn" },
          total: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Format the response
    const dashboardData = {
      totals: {
        users: totalUsers,
        services: totalServices,
        requests: totalRequests,
        pendingRequests,
      },
      servicesByCategory: [...servicesByMainCategory],
      requestsByMonth: requestsByMonth.map((item) => ({
        month: getMonthName(item._id),
        total: item.total,
      })),
      servicesByMonth: servicesByMonth.map((item) => ({
        month: getMonthName(item._id),
        total: item.total,
      })),
    };

  res.status(200).json({
      success: true,
      dashboardData
  })
})

// Helper function to get month name
const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May",
      "June", "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  }
  

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role != 'admin') {
    return next(new ErrorHandler('Your not allowed to use this resource', 400))
  }    

  const users = await User.find({role: {$ne : 'admin'}}).select(['-__v', '-createdAt'])

  res.status(200).json({
      success: true,
      users
  })  
})


export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role != 'admin') {
    return next(new ErrorHandler('Your not allowed to use this resource', 400))
  }    
  
  const { id }= req.params
  const user = await User.findByIdAndDelete(id)
  if (!user) {
      return next(new ErrorHandler('User not Found', 404))
  }
  
  res.status(200).json({
      success: true,
      message: 'User deleted Successfully',
  })  
})


export const updateUserStatus = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role != 'admin') {
    return next(new ErrorHandler('Your not allowed to use this resource', 400))
  }    
  const { id } = req.params
  const { status } = req.body
  if (!['active','banned'].includes(status)) {
      return next(new ErrorHandler('Invalid! status value',400))
  }

  const user = await User.findByIdAndUpdate(id, { status }, { new: true })
  if (!user) {
      return next(new ErrorHandler('User not found',400))
  }

  res.status(200).json({
      success: true,
      message: `User status ${status} successfully`,
  })
})


export const getAllServices = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role != 'admin') {
    return next(new ErrorHandler('Your not allowed to use this resource', 400))
  }

  const services = await Work.find().select(['title', 'category', 'city', 'postedBy', 'active'])
  .populate({
      path: 'postedBy', // Populate User details
      select: 'name',   // Only fetch the name
    })
    .lean()

  const allServices = services.map((service)=> {return {...service, postedBy: service.postedBy?.name, active: service?.active===true?'active':'inActive'}})

  res.status(200).json({
      success: true,
      allServices
  })
})

export const getAllRequests = catchAsyncError(async (req, res, next) => {
  const { role } = req.user
  if (role != 'admin') {
    return next(new ErrorHandler('Your not allowed to use this resource', 400))
  }

  const requests = await Requests.find().select(['name', 'contact', 'workId', 'status'])
  .populate({
      path: 'workId', // Populate service details
      select: 'title',   // Only fetch the title
    })
    .lean()
      
  const allRequests = requests.map((request)=> {return {...request, workId: request.workId?.title, status: request?.status? request.status:'--'}})    
  
  res.status(200).json({
      success: true,
      allRequests
  })
})


export const getUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) {
      return next(new ErrorHandler('Sorry! User not found',404))
  }

  const myUser = await User.find({_id: id })
  .select(['-__v', '-status', '-createdAt'])

  res.status(200).json({
      success: true,
      myUser
  })
})


export const updateUser = catchAsyncError(async (req, res, next) => {
   const { id }= req.params
  const data = req.body
  const { role } = req.user

  if (role != 'admin') {
      return next(new ErrorHandler('You are not authorized'))
  }
  const user = await User.findById(id)
  if (!user) {
    return next(new ErrorHandler('Sorry! User not found',404))
  }

  const profile = req.files?.profile
  if (user.profile.public_id && profile) {
      await deleteImageFromCloudinary(user.profile.public_id)
  }

  const imageUrl = profile && await uploadOnCloudinary(profile)
  await User.findByIdAndUpdate(id,{
      ...data,
      ...(profile && {profile: imageUrl})
  },{
      new: true,
      runValidators: true
  })

  res.status(200).json({
      success: true,
      message: 'User data upadted succesfully',
  })  
})


export const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params
  const { newPassword } = req.body
  const { role } = req.user

  if (role != 'admin') {
      return next(new ErrorHandler('You are not authorized'))
  }
  
  const user = await User.findById(id).select('+password')
  if (!user) {
      return next(new ErrorHandler('User is not Found!', 404))
  }
  if (!newPassword) {
      return next(new ErrorHandler('current and new Password is required',400))
  }
  
  user.password = newPassword
  await user.save()

  res.status(200).json({
      success: true,
      message: 'Password changed successfully',
  })  
})


export const registerUser = catchAsyncError(async (req, res, next) => {
  const userRole = req.user.role
  if (userRole != 'admin') {
      return next(new ErrorHandler('You are not authorized'))
  }

  const { name, cnic, contact, role ,password } = req.body
  if (!name || !cnic || !contact || !role || !password) {
      return next(new ErrorHandler('Please fill all the fields!'))
  }
  
  const isUserExist = await User.findOne({ cnic })
  if (isUserExist) {
      return next(new ErrorHandler('CNIC already registered!'))
  }
  const user = await User.create({
      name, cnic, contact, role, password,
  })
  
  res.status(200).json({
    success: true,
    message: 'User Registered Successfully',
  })  
})