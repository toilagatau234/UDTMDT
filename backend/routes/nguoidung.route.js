import express from "express"
import {formDangKy, layTheoId,capNhat,yeuThich, layYeuThich, capNhatSoDu, layGiaoDich, capNhatSoDuRutTien,layHet,layTheoRole,voHieuHoa,traLaiQuyen} from '../controllers/nguoidung.controller.js'
import { protectRoute,isAdmin } from "../middleware/protectRoute.js"
const router = express.Router()

router.post("/form",protectRoute,formDangKy)
router.get("/layTheoId/:id",layTheoId)
router.patch("/update",protectRoute,capNhat)

router.post("/capnhat/yeuthich/:id",protectRoute,yeuThich)
router.get("/lay/yeuthich",protectRoute,layYeuThich)

router.patch("/capnhat/sodu",capNhatSoDu)
router.patch("/capnhat/sodu/ruttien",protectRoute,capNhatSoDuRutTien)
router.get("/lay/giaodich",protectRoute,layGiaoDich)

router.get("/layhet",protectRoute,isAdmin,layHet)
router.get("/laytheorole", protectRoute,isAdmin,layTheoRole)
router.put("/vohieuhoa/:id", protectRoute,isAdmin,voHieuHoa)
router.put("/tralaiquyen/:id",protectRoute,isAdmin,traLaiQuyen)

export default router