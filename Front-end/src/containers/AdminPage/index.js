import {
  CaretRightOutlined,
  DashboardOutlined,
  EyeOutlined,
  HomeOutlined,
  IdcardOutlined,
  MenuOutlined,
  NotificationOutlined,
  PlusCircleOutlined,
  ReconciliationOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined, // <--- THÊM MỚI: Icon cho menu Coupon
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import SubMenu from "antd/lib/menu/SubMenu";
import logo from "assets/imgs/logo.png";
import React, { useState } from "react";
import defaultAvt from "../../assets/imgs/default-avt.png";
import AdminUser from "./AdminUser";
import Category from "./Category";
import CustomersList from "./CustomersList";
import DashboardOrders from "./Dashboard/DashboardOrders";
import DashboardProduct from "./Dashboard/DashboardProduct";
import DashboardRevenue from "./Dashboard/DashboardRevenue";
import "./index.scss";
import Login from "./Login";
import OrderList from "./OrderList"; // Import trực tiếp vì không dùng lazy ở đây trong code cũ
import SeeProduct from "./ProductPage/SeeProduct";

// Lazy load các component nặng
const AddProduct = React.lazy(() => import("./ProductPage/ProductAddForm"));
// <--- THÊM MỚI: Import Coupon Component
const CouponManagement = React.lazy(() => import("./Coupon")); 

const mainColor = "#212121";

const menuList = [
  {
    key: "d",
    title: "Thống kê",
    icon: <DashboardOutlined />,
    children: [
      { key: "d0", title: "Doanh thu", icon: <CaretRightOutlined /> },
      { key: "d1", title: "Đơn hàng", icon: <CaretRightOutlined /> },
      { key: "d2", title: "Sản phẩm", icon: <CaretRightOutlined /> },
    ],
  },
  {
    key: "ca",
    title: "Danh mục",
    icon: <MenuOutlined />,
    children: [],
  },
  {
    key: "p",
    title: "Sản phẩm",
    icon: <ShoppingCartOutlined />,
    children: [
      { key: "p0", title: "Xem", icon: <EyeOutlined /> },
      { key: "p1", title: "Thêm", icon: <PlusCircleOutlined /> },
    ],
  },
  {
    key: "cu",
    title: "Người dùng",
    icon: <UserOutlined />,
    children: [],
  },
  {
    key: "a",
    title: "Quản trị viên",
    icon: <IdcardOutlined />,
    children: [],
  },
  {
    key: "o",
    title: "Đơn hàng",
    icon: <ReconciliationOutlined />,
    children: [],
  },
  // <--- THÊM MỚI: Menu Mã giảm giá
  {
    key: "cp", // Key viết tắt cho Coupon
    title: "Mã giảm giá",
    icon: <GiftOutlined />,
    children: [],
  },
  {
    key: "m",
    title: "Quảng cáo",
    icon: <NotificationOutlined />,
    children: [],
  },
];

function AdminPage() {
  const [keyMenu, setKeyMenu] = useState("p0");

  const [isLogin, setIsLogin] = useState(() => {
    const isLogin = localStorage.getItem("admin");
    return isLogin ? true : false;
  });

  const [adminName, setAdminName] = useState(() => {
    const admin = localStorage.getItem("admin");
    return admin ? admin : "Admin";
  });

  // fn: Xử lý khi chọn item
  const handleSelected = (e) => {
    const { key } = e;
    setKeyMenu(key);
  };

  // fn: Show Title Selected
  const showTitleSelected = (key) => {
    let result = "Dashboard";
    menuList.forEach((item) => {
      if (item.key === key) result = item.title;
      item.children.forEach((child) => {
        if (child.key === key) result = `${item.title} > ${child.title}`;
      });
    });
    return result;
  };

  const renderMenuItem = () => {
    return menuList.map((item, index) => {
      const { key, title, icon, children } = item;
      if (children.length === 0)
        return (
          <Menu.Item className="menu-item" key={key} icon={icon}>
            <span className="menu-item-title">{title}</span>
          </Menu.Item>
        );
      return (
        <SubMenu className="menu-item" key={key} icon={icon} title={title}>
          {children.map((child, index) => (
            <Menu.Item className="menu-item" key={child.key} icon={child.icon}>
              <span className="menu-item-title">{child.title}</span>
            </Menu.Item>
          ))}
        </SubMenu>
      );
    });
  };

  const renderMenuComponent = (key) => {
    switch (key) {
      case "d0":
        return <DashboardRevenue />;
      case "d1":
        return <DashboardOrders />;
      case "d2":
        return <DashboardProduct />;
      case "ca":
        return <Category />;
      case "p0":
        return <SeeProduct />;
      case "p1":
        return <AddProduct />;
      case "a":
        return <AdminUser />;
      case "cu":
        return <CustomersList />;
      case "o":
        return <OrderList />;
      // <--- THÊM MỚI: Case cho Coupon
      case "cp":
        return <CouponManagement />;
      default:
        break;
    }
  };

  const onLogin = (isLogin, name) => {
    if (isLogin) {
      setIsLogin(true);
      setAdminName(name);
      localStorage.setItem("admin", name);
    }
  };

  const onLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("admin");
  };

  return (
    <div className="Admin-Page" style={{ backgroundColor: "#e5e5e5" }}>
      {!isLogin ? (
        <div className="transform-center bg-white p-32 bor-rad-8 box-sha-home">
          <h2 className="m-b-16 t-center">Đăng nhập với quyền Admin</h2>
          <Login onLogin={onLogin} />
        </div>
      ) : (
        <>
          {/* header */}
          <div
            className="d-flex align-items-center"
            style={{ height: "72px", backgroundColor: mainColor }}
          >
            <div className="logo t-center" style={{ flexBasis: "200px" }}>
              <img width={100} height={48} src={logo} alt="" />
            </div>
            <div className="flex-grow-1 d-flex align-items-center">
              <h2 className="t-color-primary flex-grow-1 p-l-44 main-title">
                <span>Trang quản trị &gt; </span>
                <span className="option-title">
                  {showTitleSelected(keyMenu)}
                </span>
              </h2>
              <a
                href="/"
                className="open-web p-r-24 t-color-primary font-weight-500 p-b-10"
              >
                <HomeOutlined
                  className="icon font-size-28px t-color-primary m-r-10"
                  style={{ transform: "translateY(3px)" }}
                />
                <span className="open-web-title">Open the website</span>
              </a>
              <div className="user-admin p-r-24 t-color-primary font-weight-500">
                <Avatar size={36} className="m-r-10" src={defaultAvt} />
                <span className="user-admin-title">{adminName}</span>
              </div>
              <Button onClick={onLogout} className="m-r-44" type="dashed">
                Đăng xuất
              </Button>
            </div>
          </div>
          {/* main content */}
          <div className="d-flex">
            {/* menu dashboard */}
            <Menu
              className="menu p-t-24"
              theme="dark"
              onClick={handleSelected}
              style={{
                height: "inherit",
                minHeight: "100vh",
                backgroundColor: mainColor,
                flexBasis: "200px",
              }}
              defaultSelectedKeys={keyMenu}
              mode="inline"
            >
              {renderMenuItem()}
            </Menu>

            {/* main contents */}
            <div className="flex-grow-1">
              {/* Sử dụng React.Suspense vì AddProduct và CouponManagement là lazy loaded */}
              <React.Suspense fallback={<div>Loading...</div>}>
                {renderMenuComponent(keyMenu)}
              </React.Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPage;