import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Radio, DatePicker, Button, message } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import {
    WrapperContainer,
    WrapperContent,
    WrapperSidebar,
    WrapperMainContent,
    ProfileHeader,
    ProfileBody,
    FormLeft,
    FormRow,
    FormLabel,
    FormControl,
    SaveButton,
    AvatarRight,
    AvatarWrapper,
    AvatarText
} from './style';
// Giả sử bạn dùng thư viện dayjs cho DatePicker
import dayjs from 'dayjs'; 

const ProfilePage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Vui lòng đăng nhập');
            navigate('/sign-in');
        } else {
            const user = JSON.parse(userString);
            setUserData(user);

            // Set giá trị cho form
            form.setFieldsValue({
                firstName: user.firstName,
                phone: user.phone,
                gender: user.gender,
                // Chuyển đổi ngày sinh nếu có
                birthday: user.birthday ? dayjs(user.birthday) : null
            });
        }
    }, [navigate, form]);

    const onFinish = (values) => {
        console.log('Thông tin cập nhật:', values);
        // TODO: Gọi API để cập nhật thông tin
        
        // Cập nhật localStorage (tạm thời)
        const updatedUser = { ...userData, ...values };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);

        message.success('Cập nhật hồ sơ thành công!');
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('Hình ảnh phải nhỏ hơn 1MB!');
        }
        return isJpgOrPng && isLt1M;
    };

    const handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            // TODO: Lấy URL ảnh từ server và cập nhật
            message.success('Tải ảnh lên thành công (chưa lưu)');
        }
    };
    
    if (!userData) {
        return <div>Đang tải...</div>;
    }

    return (
        <WrapperContainer>
            <WrapperContent>
                <WrapperSidebar>
                    <ProfileSidebar />
                </WrapperSidebar>

                <WrapperMainContent>
                    <ProfileHeader>
                        Hồ Sơ Của Tôi
                        <div style={{ fontSize: '14px', fontWeight: '400', color: '#555' }}>
                            Quản lý thông tin hồ sơ để bảo mật tài khoản
                        </div>
                    </ProfileHeader>

                    <ProfileBody>
                        <FormLeft>
                            <Form form={form} onFinish={onFinish} layout="horizontal">
                                <FormRow>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            size="large"
                                            value={userData.email} 
                                            disabled 
                                        />
                                    </FormControl>
                                </FormRow>
                                <FormRow>
                                    <FormLabel>Tên</FormLabel>
                                    <FormControl>
                                        <Form.Item name="firstName">
                                            <Input size="large" />
                                        </Form.Item>
                                    </FormControl>
                                </FormRow>
                                <FormRow>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Form.Item name="phone">
                                            <Input size="large" />
                                        </Form.Item>
                                    </FormControl>
                                </FormRow>
                                <FormRow>
                                    <FormLabel>Giới tính</FormLabel>
                                    <FormControl>
                                        <Form.Item name="gender">
                                            <Radio.Group>
                                                <Radio value="male">Nam</Radio>
                                                <Radio value="female">Nữ</Radio>
                                                <Radio value="other">Khác</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </FormControl>
                                </FormRow>
                                <FormRow>
                                    <FormLabel>Ngày sinh</FormLabel>
                                    <FormControl>
                                        <Form.Item name="birthday">
                                            <DatePicker 
                                                size="large" 
                                                style={{ width: '100%' }}
                                                format="DD/MM/YYYY"
                                            />
                                        </Form.Item>
                                    </FormControl>
                                </FormRow>

                                <FormRow>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <SaveButton htmlType="submit">
                                            Lưu thay đổi
                                        </SaveButton>
                                    </FormControl>
                                </FormRow>
                            </Form>
                        </FormLeft>

                        <AvatarRight>
                            <AvatarWrapper
                                name="avatar"
                                listType="picture-card"
                                showUploadList={false}
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188" // URL API upload (thay thế sau)
                                beforeUpload={beforeUpload}
                                onChange={handleUploadChange}
                            >
                                {userData.avatar ? (
                                    <img src={userData.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UserOutlined style={{ fontSize: '40px', color: '#999' }} />
                                )}
                            </AvatarWrapper>
                            <Button style={{ marginTop: '15px' }}>Chọn Ảnh</Button>
                            <AvatarText>
                                Dung lượng file tối đa 1 MB<br />
                                Định dạng: .JPEG, .PNG
                            </AvatarText>
                        </AvatarRight>
                    </ProfileBody>
                </WrapperMainContent>
            </WrapperContent>
        </WrapperContainer>
    );
};

export default ProfilePage;