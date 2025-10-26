import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { layThongBao, xoaThongBao } from '../controllers/thongbao.controller.js'

const router = express.Router()


router.get("/",protectRoute,layThongBao)
router.delete("/xoa/:id",protectRoute,xoaThongBao)

export default router