import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import cloudinary from 'cloudinary'
import { Work } from '../models/workSchema.js'
import { deleteImageFromCloudinary, uploadOnCloudinary } from '../utills/cloudinary.js'
import { Requests } from '../models/requestSchema.js'

export const getAllWorks = catchAsyncError(async (req, res, next) => {
    const services = await Work.find({ active: true })
    res.status(200).json({
        success: true,
        services,
    })
})

export const getSerchedWorks = catchAsyncError(async (req, res, next) => {
    const { search } = req.query;
    let query = {};

    if (!search) {
        return next(new ErrorHandler('SearchTerm required'))
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const services = await Work.find(query);

      res.status(200).json({
        success: true,
        message: 'Search Completed',
        services
    })
})


export const postWork = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role != 'worker' && role != 'admin') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('work pictures required'))
    }
    
    const postedBy = req.user._id
    const { title, description, city, subcategory, startTime, endTime, fixedSalary, salaryFrom, salaryTo } = req.body
    const { image } = req.files

    if (!title || !subcategory) {
        return next(new ErrorHandler('Please provide all detials of work', 400))
    }
    if (!salaryFrom && !fixedSalary) {
        return next(new ErrorHandler('Please either provide fixedSalary or ranged salary'))
    }

    const imageUrl = await uploadOnCloudinary(image)

    const work = await Work.create(fixedSalary?
        { title, description, city, category:subcategory, startTime, endTime, fixedSalary, 
            image: imageUrl,
            postedBy 
        }:
        { title, description, city, category:subcategory, startTime, endTime, salaryFrom, salaryTo, 
            image: imageUrl,
            postedBy 
        }
    )
    res.status(200).json({
        success: true,
        message: 'Work posted successfully',
    })
})


export const getMyWorks = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'client') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    const myServices = await Work.find({ postedBy: req.user._id })
    res.status(200).json({
        success: true,
        myServices
    })
})

export const getMyWork = catchAsyncError(async (req, res, next) => {

    const { id } = req.params
    const work = await Work.findById(id)
    if (!work) {
        return next(new ErrorHandler('Sorry! service not found',404))
    }

    const myService = await Work.find({_id: id })
    .select(['-postedBy','-postedOn','-__v','-_id'])

    res.status(200).json({
        success: true,
        myService
    })
})


export const updateWork = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    const { id } = req.params
    let work = await Work.findById(id)
    const image = req.files?.image
    let updatedImageData = {
        public_id: work.image?.public_id, 
        url: work.image?.url
    }

    if (role !== 'worker') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }    
    if (!work) {
        return next(new ErrorHandler('Sorry! This service not found',404))
    }

    if (image) {
        const formats = ['image/png', 'image/jpeg', 'image/webp']    
        if (!formats.includes(image.mimetype)) {
            return next(new ErrorHandler('Invalid file type, Please upload work pictures in a "PNG, JPG, Webp" format', 400))
        }
        const public_id = work.image?.public_id
        const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, {
            public_id: public_id || undefined,
            overwrite: true,
            invalidate: true
        })
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error('Cloudinary Error', cloudinaryResponse.error || 'Unknown cloudinary error')
            return next(new ErrorHandler('Failed to upload your work files', 500))
        }
        updatedImageData = {
            public_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url
        }
    }

    const data = req.body
    data.image = updatedImageData
    const unsetData = {}

    if (data.fixedSalary && !work.fixedSalary) {
        unsetData.salaryFrom = ''
        unsetData.salaryTo = ''
    }else if (!data.fixedSalary && work.fixedSalary) {
        unsetData.fixedSalary = ''
    }

    work = await Work.findByIdAndUpdate(id, {        
        $set: data,
        $unset: unsetData,
        },{
            new: true,
            runValidators: true,
            useFindAndModify: false
        })        
    
    res.status(200).json({
        success: true,
        message: 'Work updated successfully',
        work
    })
})


export const updateServiceStatus = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    const { id } = req.params
    const { active } = req.body

    if (role != 'worker' && role != 'admin') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }    
    if (![true,false].includes(active)) {
        return next(new ErrorHandler('Invalid! active value',400))
    }

    const work = await Work.findByIdAndUpdate(id, 
        { active },
        {
            new: true,
            useFindAndModify: false
        })
    if (!work) {
        return next(new ErrorHandler('Service not found',400))
    }
    
    res.status(200).json({
        success: true,
        message: 'Service status updated successfully',
    })
})


export const deleteWork = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'client') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    const { id } = req.params
    
    const work = await Work.findById(id)
    if (!work) {
        return next(new ErrorHandler('Sorry! this service not found',404))
    }

    const public_id = work.image?.public_id
    await deleteImageFromCloudinary(public_id)

    await work.deleteOne()

    res.status(200).json({
        success: true,
        message: 'Work deleted successfully'
    })
})


export const updateRatings = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const { ratings } = req.body
    if (!id) {
        return next(new ErrorHandler('Sorry! service not found',404))
    }
    let work = await Requests.findById(id)
    .populate({
        path: 'workId',
        select: '_id',
    }).select('workId')
     if (!work) {
        return next(new ErrorHandler('Sorry! this service not found',404))
    }

    work = await Work.findByIdAndUpdate(work.workId._id, { ratings },
        {
            new: true,
            useFindAndModify: false
        })
    if (!work) {
        return next(new ErrorHandler('Sorry! this service not found',404))
    }
    
    res.status(200).json({
        success: true,
        message: 'Ratings updated successfully'
    })
})

