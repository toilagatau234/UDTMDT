import express from "express"
import {layGioHang, themDichVuVaoGioHang,capNhatSoLuong} from '../controllers/giohang.controller.js'
import { protectRoute } from "../middleware/protectRoute.js"
const router = express.Router()

router.get("/",protectRoute,layGioHang)

router.post("/them",protectRoute,themDichVuVaoGioHang)
router.put("/capnhat",protectRoute,capNhatSoLuong)


export default router