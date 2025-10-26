import express from "express"
import {capNhatGiaoDich, capNhatTrangThai, layDonHangCuaNguoiBan, layDonHangCuaNguoiMua, layGiaoDich, layTatCaDonHangCuaNguoiMua, themDonHang} from '../controllers/donhang.controller.js'
import { protectRoute } from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/themdonhang",protectRoute,themDonHang)
router.patch("/capnhatgiaodich/:id",capNhatGiaoDich)
router.get("/laygiaodichtheoid/:id",layGiaoDich)

router.get("/laydonhangcuanguoiban/:trangThaiDH",protectRoute,layDonHangCuaNguoiBan)
router.patch("/capnhattrangthai/:id",capNhatTrangThai)
router.get("/laydonhangcuanguoimua/:trangThaiDH",protectRoute,layDonHangCuaNguoiMua)

router.get("/lay/tatca/donhang/nguoimua",protectRoute,layTatCaDonHangCuaNguoiMua)





export default router