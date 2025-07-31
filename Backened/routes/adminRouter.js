import express from 'express'
import { isAuthorized } from '../middlewares/auth.js'
import { changeUserPassword, deleteUser, getAllRequests, getAllServices, getAllUsers, getDashboardDetials, getUser, login, registerUser, updateUser, updateUserStatus } from '../controller/adminController.js'
import { deleteWork, getMyWork, postWork, updateWork } from '../controller/workController.js'
import { deleteRequest, getMyRequest, updateRequest } from '../controller/requestController.js'
import { changePassword, logout, updateUserData } from '../controller/userController.js'

const router = express.Router()

// Auth
router.post("/login", login);
router.get("/logout", isAuthorized, logout);

// dashboard Api
router.get('/getAnalytics', isAuthorized, getDashboardDetials)
// User management Apis
router.get('/getAllUsers', isAuthorized, getAllUsers)
router.get('/getUser/:id', isAuthorized, getUser)
router.post('/newUser', isAuthorized, registerUser)
router.put('/updateUser/:id', isAuthorized, updateUser)
router.put('/updateProfile/:id', isAuthorized, updateUserData)
router.delete('/deleteUser/:id', isAuthorized, deleteUser)
router.patch('/updateStatus/:id', isAuthorized, updateUserStatus)
router.patch('/changePassword', isAuthorized, changePassword);
router.patch('/changePassword/:id', isAuthorized, changeUserPassword);
// Service Management Apis
router.get('/getAllServices', isAuthorized, getAllServices)
router.get('/getService/:id', isAuthorized, getMyWork)
router.post('/PostService', isAuthorized, postWork)
router.delete('/deleteService/:id', isAuthorized, deleteWork)
router.put('/updateService/:id', isAuthorized, updateWork)
// Request Management
router.get('/getAllRequests', isAuthorized, getAllRequests)
router.get('/getRequest/:id', isAuthorized, getMyRequest)
router.delete('/deleteRequest/:id', isAuthorized, deleteRequest)
router.put('/updateRequest/:id', isAuthorized, updateRequest)

export default router