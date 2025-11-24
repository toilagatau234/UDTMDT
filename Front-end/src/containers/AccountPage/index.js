import {
  CompassOutlined,
  NotificationOutlined,
  ReconciliationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Result, Row } from 'antd';
import userLogo from 'assets/icon/user_32px.png';
import constants from 'constants/index';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';
import OrderList from './OrderList';
import UpdateAccountForm from './UpdateForm';
// SỬA: Import đúng tên UserAddressList
import UserAddressList from './UserAddressList';

function AccountPage() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const { isAuth } = useSelector((state) => state.authenticate);
  const [activeKey, setActiveKey] = useState(() =>
    pathname.replace(`${constants.ROUTES.ACCOUNT}/`, "")
  );

  // menu list
  const menu = [
    {
      icon: <UserOutlined className="icon m-r-12 font-size-24px" />,
      title: "Thông tin tài khoản",
      key: "",
    },
    {
      icon: <ReconciliationOutlined className="icon m-r-12 font-size-24px" />,
      title: "Quản lý đơn hàng",
      key: "orders",
    },
    {
      icon: <CompassOutlined className="icon m-r-12 font-size-24px" />,
      title: "Địa chỉ giao hàng",
      key: "addresses",
    },
    {
      icon: <NotificationOutlined className="icon m-r-12 font-size-24px" />,
      title: "Thông báo",
      key: "notifications",
    },
  ];

  // render component with key
  const renderWithKey = (key = "") => {
    switch (key) {
      case "":
        return (
          <>
            <h2 className="m-b-16 underline-title">Thông tin tài khoản</h2>
            <UpdateAccountForm />
          </>
        );
      case "orders":
        return (
          <>
            <h2 className="m-b-16 underline-title">Các đơn hàng </h2>
            <OrderList />
          </>
        );
      case "addresses":
        return (
          <>
            <h2 className="m-b-16 underline-title">Danh sách địa chỉ giao hàng </h2>
            {/* Bây giờ thẻ này đã được định nghĩa đúng */}
            <UserAddressList />
          </>
        );
      case "notifications":
        return (
          <>
            <h2 className="m-b-16 underline-title">Thông báo</h2>
            <Result
              icon={<NotificationOutlined />}
              title="Hiện tại, không có thông báo nào"
            />
            ,
          </>
        );
      default:
        <>
          <h2 className="m-b-16">Thông tin tài khoản</h2>
          <UpdateAccountForm />
        </>;
    }
  };

  // : lấy lại key khi bấm vào đơn hàng menu
  useEffect(() => {
    if (pathname === `${constants.ROUTES.ACCOUNT}/orders`)
      setActiveKey("orders");
  }, [pathname]);

  return (
    <>
      {!isAuth ? (
        <div style={{ minHeight: "82vh" }}>
          <Result
            title="Đăng nhập để xem thông tin"
            extra={[
              <Button type="primary" key="signup" className="btn-secondary">
                <Link to={constants.ROUTES.SIGNUP}>Đăng ký</Link>
              </Button>,
              <Button type="primary" key="login">
                <Link to={constants.ROUTES.LOGIN}>Đăng nhập</Link>
              </Button>,
            ]}
          />
        </div>
      ) : (
        <Row className="account-page container m-tb-32">
          <Col span={24} md={6} className="p-r-16">
            {/* giới thiệu */}
            <div className="intro d-flex p-b-4 m-b-12 ">
              <img
                src={userLogo}
                alt="userlogo"
                width={32}
                height={32}
                className="m-r-12"
              />
              <div className="d-flex align-items-center">
                <span className="font-size-16px m-r-6 ">Tài khoản của</span>
                <h3 className="name">{user.fullName}</h3>
              </div>
            </div>

            {/* menu */}
            <ul className="account-page menu m-t-12">
              {menu.map((item, index) => (
                <Link
                  to={constants.ROUTES.ACCOUNT + "/" + item.key}
                  key={index}
                >
                  <li
                    className={`account-page-menu-item p-b-20 ${
                      item.key === activeKey ? "active" : ""
                    }`}
                    onClick={() => setActiveKey(item.key)}
                  >
                    {item.icon}
                    <span className="font-size-16px">{item.title}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </Col>

          <Col className="p-lr-8" span={24} md={18}>
            {renderWithKey(activeKey)}
          </Col>
        </Row>
      )}
    </>
  );
}

export default AccountPage;