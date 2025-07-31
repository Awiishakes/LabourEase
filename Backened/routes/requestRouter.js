import express from 'express'
import { deleteImage, deleteRequest, getAllRequests, getCompletedRequests, getMyRequest, postImage, postRequest, updateRequest, updateRequestStatus } from '../controller/requestController.js'
import { isAuthorized } from "../middlewares/auth.js";


const router = express.Router()

router.get('/getAll', isAuthorized, getAllRequests)
router.get('/getCompleted', isAuthorized, getCompletedRequests)
router.get('/getMyRequest/:id', isAuthorized, getMyRequest)
router.delete('/delete/:id', isAuthorized, deleteRequest)
router.post('/postRequest', isAuthorized, postRequest)
router.post('/uploadImage', isAuthorized, postImage)
router.put('/update/:id', isAuthorized, updateRequest)
router.delete('/deleteImage/:id', isAuthorized, deleteImage)
router.patch('/updateStatus/:id', isAuthorized, updateRequestStatus)

export default router