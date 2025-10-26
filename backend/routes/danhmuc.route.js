import express from "express"
import {layDanhMuc,themDanhMuc, suaDanhMuc, xoaDanhMuc} from '../controllers/danhmuc.controller.js'
import { layTheoId } from "../controllers/nguoidung.controller.js"
import { isAdmin } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/",layDanhMuc)
router.post("/them",isAdmin,themDanhMuc)
router.patch("/chinh/:id",isAdmin,suaDanhMuc)
router.delete("/:id",isAdmin,xoaDanhMuc)
router.get("/layTheoId/:id",layTheoId)

export default router