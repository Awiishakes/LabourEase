import express from 'express'
import { deleteWork, getAllWorks, getMyWork, getMyWorks, getSerchedWorks, postWork, updateRatings, updateServiceStatus, updateWork } from '../controller/workController.js'
import { isAuthorized } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getAll', getAllWorks)
router.get('/services', getSerchedWorks)
router.get('/getMyServices', isAuthorized, getMyWorks)
router.get('/getMyService/:id', isAuthorized, getMyWork)
router.post('/postService', isAuthorized, postWork)
router.put('/update/:id', isAuthorized, updateWork)
router.patch('/updateStatus/:id', isAuthorized, updateServiceStatus)
router.patch('/updateRatings/:id', isAuthorized, updateRatings)
router.delete('/delete/:id', isAuthorized, deleteWork)

export default router