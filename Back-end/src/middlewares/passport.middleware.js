const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
const AccountModel = require('../models/account.models/account.model');
const UserModel = require("../models/account.models/user.model");
const jwt = require('jsonwebtoken');
const express = require('express');

// authentication with JWT
const jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    let token = null;

    // 1. Ưu tiên lấy từ Cookie (Code cũ)
    if (express().get('env') === 'production') {
      token = req.query.token;
    } else {
      token = req.cookies.access_token;
    }

    // 2. [THÊM MỚI] Nếu không có cookie, lấy từ Header (Authorization: Bearer <token>)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    // Nếu vẫn không có token -> Lỗi hoặc Next (tùy logic)
    if (!token) {
      // Với các route cần bảo vệ, nếu không có token thì trả về 401 ngay
      return res.status(401).json({
        message: 'Unauthorized. Token not found.',
      });
    }

    // verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { accountId } = decoded.sub;
      const user = await AccountModel.findById(accountId);
      if (user) {
        res.locals.isAuth = true;
        req.user = user;
        next(); // Cho phép đi tiếp
        return;
      }
    }
    
    // Nếu token sai hoặc user không tồn tại
    return res.status(401).json({
      message: 'Unauthorized. Invalid token.',
    });

  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized.',
      error,
    });
  }
};

// ! xác thực với google plus
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name } = profile;
        const { familyName, givenName } = name;
        const email = profile.emails[0].value;
        // kiểm tra email đã tồn tại hay chưa
        const localUser = await AccountModel.findOne({
          email,
          authType: "local",
        });
        if (localUser) return done(null, localUser);

        const user = await AccountModel.findOne({
          googleId: id,
          authType: "google",
        });
        if (user) return done(null, user);

        // tạo account và user tương ứng
        const newAccount = await AccountModel.create({
          authType: "google",
          googleId: id,
          email,
        });

        await UserModel.create({
          accountId: newAccount._id,
          email,
          fullName: familyName + " " + givenName,
        });

        done(null, newAccount);
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

const AdminModel = require('../models/account.models/admin.model');

// ... (other code)

const adminAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized. Token not found.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { adminId } = decoded.sub;
      const admin = await AdminModel.findById(adminId);
      if (admin) {
        req.user = admin;
        next();
        return;
      }
    }

    return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized.', error });
  }
};

module.exports = {
  jwtAuthentication,
  adminAuthentication,
};