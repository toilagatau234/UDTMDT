import express from "express"
import {dangKy, danhNhap, dangXuat, getMe} from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.post("/signup",dangKy)
router.post("/login",danhNhap)
router.post("/logout",dangXuat)
router.get("/getme",protectRoute,getMe)

export default router