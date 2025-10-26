import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (idNguoidung,res)=>{
    try {
        const token = jwt.sign({ idNguoidung }, process.env.JWT_SECRET, {
            expiresIn: '15d',
        });

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
    } catch (error) {
        console.error("Lỗi khi tạo token và đặt cookie:", error.message);
        res.status(500).json({ error: "Không thể tạo token, vui lòng thử lại sau!" });
    }
}

