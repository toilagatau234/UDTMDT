import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/auth.route.js";
import danhmucRoutes from "./routes/danhmuc.route.js";
import dichvuRoutes from "./routes/dichvu.route.js";
import userRoutes from "./routes/nguoidung.route.js";
import giohangRoutes from "./routes/giohang.route.js";
import donhangRoutes from "./routes/donhang.route.js";
import vnpayRoutes from "./routes/vnpay.route.js";
import chatRoutes from "./routes/chat.route.js";
import thongbaoRoutes from "./routes/thongbao.route.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(morgan("tiny"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/danhmuc", danhmucRoutes);
app.use("/api/dichvu", dichvuRoutes);
app.use("/api/giohang", giohangRoutes);
app.use("/api/donhang", donhangRoutes);
app.use("/api/vnpay", vnpayRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/thongbao", thongbaoRoutes);

app.get("/", (req, res) => {
  res.send("Xin chào bạn");
});


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const userSocketMap = {}; 


export function getReceiverSocketId(idNguoidung) {
  return userSocketMap[idNguoidung];
}


io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const idNguoidung = socket.handshake.query.idNguoidung;
  
  if (idNguoidung) {
    userSocketMap[idNguoidung] = socket.id;  
  }


  socket.on("joinRoom", (idNguoiTao) => {
    const room = `dichvu_${idNguoiTao}`;
    if (!socket.rooms.has(room)) {
      socket.join(room);
      console.log(`User ${idNguoidung} joined room ${room}`);
    }
  });
  

  socket.on("sendMessage", ({ idNguoiDungGui,idNguoiDungNhan, noiDungTN }) => {
    io.to(`dichvu_${idNguoiDungGui}`).emit("tinNhanMoi", {
      idNguoiDungGui,
      idNguoiDungNhan,
      noiDungTN,
    });
  });



socket.on("sendNotification", ({ tuNguoiDung, denNguoiDung, noiDungTB }) => {

  const targetSocketId = getReceiverSocketId(denNguoiDung); 

  if (targetSocketId) {
    io.to(targetSocketId).emit("thongBaoMoi", {
      tuNguoiDung,
      denNguoiDung,
      noiDungTB,
    });
  } else {
    console.log(`Không tìm thấy socketId cho người dùng ${denNguoiDung}`);
  }
});



  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[idNguoidung];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io };

server.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});