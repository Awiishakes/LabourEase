import cloudinary from 'cloudinary'
import ErrorHandler from '../middlewares/error.js'


export const uploadOnCloudinary = async (image) =>{
    const formats = ['image/png', 'image/jpeg', 'image/webp']


    if (!formats.includes(image.mimetype)) {
        throw new ErrorHandler('Invalid file type, Please upload work pictures in a "PNG, JPG, Webp" format', 400)
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath)
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error('Cloudinary Error', cloudinaryResponse.error || 'Unknown cloudinary error')
        throw new ErrorHandler('Failed to upload your work files', 500)
    }

    return { public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.secure_url }
}


export const deleteImageFromCloudinary = async (public_id) =>{
    if (!public_id) {
        throw new ErrorHandler('Image id required to delete image',400)
    }

    const cloudinaryResponse = await cloudinary.uploader.destroy(public_id)
    if (cloudinaryResponse.result === 'not found' || cloudinaryResponse.result != 'ok') {
        throw new ErrorHandler("Failed to delete image",500)
    }

    return cloudinaryResponse.result
}