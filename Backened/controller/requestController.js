import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import { Requests } from '../models/requestSchema.js'
import cloudinary from 'cloudinary'
import { Work } from '../models/workSchema.js'
import { deleteImageFromCloudinary, uploadOnCloudinary } from '../utills/cloudinary.js'

export const getAllRequests = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    const { _id } = req.user
    // Fetch requests based on user role
    const filter = role === 'client' ? { clientId: _id } : role === 'worker'? { workerId: _id }: null;

    // Lookup to check service existence
    const requests = await Requests.find(filter)
    .populate({
        path: 'workId', // Populate service details
        select: 'title',   // Only fetch the title
      })
      .lean(); // Convert Mongoose documents to plain JS objects
      if (!requests) {
          return next(new ErrorHandler('Requests not found', 404))
        }
        
    // Process requests based on role
    const processedRequests = requests.map((request) => {
      if (!request.workId || request.status === 'rejected') { 
            // Service deleted
        if (role === 'worker') {
            return null; // Exclude for workers
        } else if (role === 'client' && !request.workId) {
            // Mark for clients
            return {
                ...request,
                isServiceDeleted: true,
                message: 'The service associated with this request has been deleted.',
                };
            }
        }
        // Return request as-is if service exists
        return request;
    });
    // Filter out nulls (for workers)
    const finalRequests = processedRequests.filter(Boolean);
    
    res.status(200).json({
        success: true,
        data: finalRequests
    })
})


export const getMyRequest = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    // Lookup to check service existence
    
    const request = await Requests.findById(id)
    .populate({
        path: 'workId', // Populate service details
        select: 'title',   // Only fetch the title
    })
    .select(['-__v','-clientId','-workerId','-_id'])
    if (!request) {
        return next(new ErrorHandler('Sorry! Request not found',404))
    }
    
    res.status(200).json({
        success: true,
        request
    })
})


export const deleteRequest = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'worker') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }

    const { id } = req.params
    const request = await Requests.findById(id)
    if (!request) {
        return next(new ErrorHandler('Sorry! request not Found', 404))
    }

    const images = request.images || []
    if (!images.length > 0) {
        return next(new ErrorHandler('Images Not found',404))
    }
    const public_ids = images.map((image)=>image.public_id)
    const cloudinaryResponse = await cloudinary.api.delete_resources(public_ids)
    if (!cloudinaryResponse) {
        return next(new ErrorHandler('Failed to delete Images', 500))
    }

    await request.deleteOne()

    res.status(200).json({
        success: true,
        message: 'Request deleted successfully'
    })
})


export const postRequest = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'worker') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('work pictures required'))
    }
    let { images } = req.files
    if (!Array.isArray(images)) {
        images = [images]
    }
    
    
    const imageData = []
    for (const image of images){
        const imageUrl = await uploadOnCloudinary(image)
        imageData.push(imageUrl)
    }
    
    const { name, city, address, contact, date, time, salary, description, coord, workId } = req.body
    const clientId = req.user._id
    
    if (!workId) {
        return next(new ErrorHandler('Work not found', 404))
    }
    
    const workDetials = await Work.findById(workId)
    if (!workDetials) {
        return next(new ErrorHandler('Work not found', 404))
    }

    const workerId = workDetials.postedBy    
    if (!name || !city || !address || !contact || !date || !time || !salary || !description) {
        return next(new ErrorHandler('Please fill all fields', 400))
    }
    const parsedCoord = JSON.parse(coord)

    const request = await Requests.create({
        name, city, address, contact, date, time, salary, description, clientId, workerId, workId,
        images: imageData,
        coord: parsedCoord
    })

    res.status(200).json({
        success: true,
        message: 'Request submitted',
    })
})


export const postImage = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'worker') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Images required to upload'))
    }

    const { image } = req.files
    const imageUrls = await uploadOnCloudinary(image)

    res.status(200).json({
        success: true,
        message: 'Image uploaded Successfully',
        imageUrls
    })
})

export const deleteImage = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role === 'worker') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }

    const { id } = req.params
    const result = await deleteImageFromCloudinary(id)
    if (result != 'ok') {
        return next(new ErrorHandler('Failed to delete Image', 400))
    }

    res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
    })
})


export const updateRequest = catchAsyncError(async (req, res, next) => {
    const { role } = req.user
    if (role != 'client' && role != 'admin') {
        return next(new ErrorHandler('Your not allowed to use this resource', 400))
    }
    const { id } = req.params
    const request = await Requests.findById(id)
    if (!request) {
        return next(new ErrorHandler('request no found', 404))
    }
    
    const updatedData = req.body
    if (updatedData.coord) updatedData.coord = JSON.parse(updatedData.coord)
    updatedData.images = JSON.parse(updatedData.images)

    const public_ids = updatedData.images.map(val => val.public_id)
    for(const image of request?.images){
        if (!public_ids.includes(image.public_id)){
            await deleteImageFromCloudinary(image.public_id)
        }
    }
    await Requests.findByIdAndUpdate(id, {
        ...updatedData
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: 'Request Updated successfully',
    })
})


export const updateRequestStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    if (!['accepted','rejected','completed'].includes(status)) {
        return next(new ErrorHandler('Invalid! status value',400))
    }

    const request = await Requests.findByIdAndUpdate(id, { status }, { new: true })
    if (!request) {
        return next(new ErrorHandler('Request not found',400))
    }

    res.status(200).json({
        success: true,
        message: 'Requests status updated successfully',
    })
})

export const getCompletedRequests = catchAsyncError(async (req, res, next) => {
    const { _id } = req.user
    // Lookup to check service existence
    const requests = await Requests.find({ workerId: _id, status: 'completed' }).select(['name','address','salary'])
    if (!requests) {
        return next(new ErrorHandler('Requests not found', 404))
    }
    
    res.status(200).json({
        success: true,
        requests
    })
})