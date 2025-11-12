import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import {
    WrapperSidebar,
    WrapperHello,
    WrapperAvatar,
    WrapperUserName,
    WrapperMenu,
    WrapperMenuItem
} from './style'; // <-- 1. IMPORT STYLE TỪ FILE BÊN NGOÀI

const ProfileSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            setUserData(JSON.parse(userString));
        }
    }, []);

    const userName = userData?.firstName || userData?.email || 'Bạn';

    return (
        // 2. SỬ DỤNG CÁC COMPONENT ĐÃ IMPORT
        <WrapperSidebar>
            <WrapperHello>
                {userData?.avatar ? (
                    <WrapperAvatar src={userData.avatar} alt="avatar" />
                ) : (
                    <UserOutlined style={{ fontSize: '30px', color: '#999' }} />
                )}
                <span>
                    Xin chào, <WrapperUserName>{userName}</WrapperUserName>
                </span>
            </WrapperHello>

            <WrapperMenu>
                <WrapperMenuItem 
                    className={location.pathname === '/profile' ? 'active' : ''}
                    onClick={() => navigate('/profile')}
                >
                    Hồ Sơ Của Tôi
                </WrapperMenuItem>
                
                <WrapperMenuItem 
                    className={location.pathname === '/my-orders' ? 'active' : ''}
                    onClick={() => navigate('/my-orders')}
                >
                    Đơn Mua
                </WrapperMenuItem>
                
                <WrapperMenuItem 
                    className={location.pathname === '/change-password' ? 'active' : ''}
                    onClick={() => navigate('/change-password')}
                >
                    Đổi mật khẩu
                </WrapperMenuItem>
            </WrapperMenu>
        </WrapperSidebar>
    );
};

export default ProfileSidebar;