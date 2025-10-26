import express from "express";
import { guiTinNhan, layTinNhan, layToanBoNguoiDung } from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();



router.get("/layfull",protectRoute,layToanBoNguoiDung);
router.get("/:id",protectRoute,layTinNhan);
router.post("/gui/:id",protectRoute, guiTinNhan);

export default router;
