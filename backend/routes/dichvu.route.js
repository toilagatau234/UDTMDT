import express from "express"
import {layDichVu,themDichVu, suaDichVu, xoaDichVu, idDichvu, DichvutheoDM, layTheoNguoiDung, capNhatLuotXem, goiYTimKiem, timKiem, capNhatDanhGia, layDanhGia, layDichVuTrangChu,layNguoiTaoDichVu} from '../controllers/dichvu.controller.js'
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/",layDichVu)
router.post("/them",protectRoute,themDichVu)
router.patch("/chinh/:id",suaDichVu)
router.delete("/:id",xoaDichVu)
router.get("/lay/:id",protectRoute,idDichvu)
router.get("/theodanhmuc/:id",protectRoute,DichvutheoDM)
router.get("/theonguoidung",protectRoute, layTheoNguoiDung)

router.post("/capnhat/luotxem/:id",capNhatLuotXem)
router.get("/search/goiy",goiYTimKiem)
router.get("/search/timkiem",timKiem)

router.patch("/capnhat/danhgia/:id",protectRoute,capNhatDanhGia)
router.get("/lay/danhgia/:id",layDanhGia)

router.get("/lay/dichvu/trangchu",layDichVuTrangChu)

router.get("/laynguoitao/:idDichVu",protectRoute,layNguoiTaoDichVu)
export default router