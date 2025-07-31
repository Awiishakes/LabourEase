import express from 'express'
import { register, login, logout, getUser, updateUserData, changePassword, verifyCnic, sendOtp, resetPassword } from "../controller/userController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthorized, logout);
router.post("/forgetPassword/verifyId", verifyCnic);
router.post("/forgetPassword/sendOtp", sendOtp);
router.post("/forgetPassword/resetPassword", resetPassword);
router.get("/getuser", isAuthorized, getUser);
router.put("/updateProfile/:id", isAuthorized, updateUserData);
router.patch("/changePassword", isAuthorized, changePassword);

export default router
