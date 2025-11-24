import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Spin } from 'antd';
import addressApi from 'apis/addressApi';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddressAddForm from './AddressAddForm';

// SỬA: Đưa default props vào tham số hàm
function UserAddressList({ isCheckout = false, onChecked = () => {} }) {
  const user = useSelector((state) => state.user);
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [list, setList] = useState([]);
  const [activeItem, setActiveItem] = useState(-1);
  const [updateList, setUpdateList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ... (Phần logic còn lại giữ nguyên) ...
  // : xoá 1 địa chỉ giao nhận
  const onDelDeliveryAdd = async (item) => {
    try {
      const response = await addressApi.delDeliveryAddress(user._id, item);
      if (response) {
        message.success("Xóa địa chỉ thành Công.");
        setUpdateList(!updateList);
      }
    } catch (error) {
      message.error("Xoá địa chỉ giao, nhận thất bại.");
    }
  };

  // event: đặt mặc định
  const onSetDefaultDeliveryAdd = async (item) => {
    try {
      const response = await addressApi.putSetDefaultDeliveryAddress(
        user._id,
        item
      );
      if (response) {
        message.success("Cập nhật thành công");
        setUpdateList(!updateList);
      }
    } catch (error) {
      message.error("Cập nhật thất bại.");
    }
  };

  // : hiển thị danh sách
  const showAddressList = (list = []) => {
    return (
      list &&
      list.map((item, index) => (
        <div
          key={index}
          className={`bg-white bor-rad-8 box-sha-home p-tb-8 p-lr-16 m-b-16 ${
            activeItem === index && isCheckout ? "item-active" : ""
          }`}
          onClick={() => {
            if (isCheckout) {
              setActiveItem(index);
              onChecked(index);
            }
          }}
        >
          <div className="d-flex justify-content-between m-b-4">
            <h3>
              <b>{item.name}</b>
              {index === 0 && !isCheckout && (
                <span
                  className="font-size-12px p-tb-4 p-lr-8 m-l-8 bor-rad-4"
                  style={{ border: "solid 1px #3a5dd9", color: "#3a5dd9" }}
                >
                  Mặc định
                </span>
              )}
            </h3>

            {index !== 0 && !isCheckout && (
              <div>
                <Button
                  type="link"
                  onClick={() => onSetDefaultDeliveryAdd(index)}
                >
                  Đặt mặc định
                </Button>
                <Button
                  type="dashed"
                  disabled={index === 0}
                  onClick={() => onDelDeliveryAdd(index)}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>
          <p className="m-b-4">
            <b>Địa chỉ: </b> {item.address}
          </p>
          <p className="m-b-4">
            <b>Số điện thoại: </b> {item.phone}
          </p>
        </div>
      ))
    );
  };

  // : Lấy danh sách địa chỉ
  useEffect(() => {
    let isSubscribe = true;
    const getDeliveryAddressList = async () => {
      try {
        setIsLoading(true);
        const response = await addressApi.getDeliveryAddressList(user._id);
        if (response && isSubscribe) {
          setList(response.data.list);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) {
          setList([]);
          setIsLoading(false);
        }
      }
    };

    if (user) getDeliveryAddressList();

    return () => (isSubscribe = false);
  }, [user, updateList]);

  return (
    <>
      {isLoading ? (
        <div className="t-center m-tb-50">
          <Spin tip="Đang tải danh sách địa chỉ giao hàng ..." size="large" />
        </div>
      ) : (
        <div className="AddressUserList">
          {/* thêm địa chỉ, chỉ cho tối đa 5 địa chỉ */}
          {list.length < 5 && (
            <Button
              type="primary"
              size="large"
              className="w-100"
              onClick={() => setIsVisibleForm(true)}
              style={{ height: 54 }}
            >
              <PlusOutlined />
              Thêm địa chỉ
            </Button>
          )}
          {/* hiện danh sách địa chỉ */}
          {list.length > 0 ? (
            <div className="m-t-16">{showAddressList(list)}</div>
          ) : (
            <div className="m-t-16 t-center">
              Hiện tại bạn chưa có địa chỉ giao, nhận hàng
            </div>
          )}
          {isVisibleForm && (
            <AddressAddForm
              onCloseForm={(addFlag) => {
                //Cờ báo thêm mới địa chỉ thành công để cập nhật lại địa chỉ
                if (addFlag) setUpdateList(!updateList);
                setIsVisibleForm(false);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

// XÓA: UserAddressList.defaultProps

UserAddressList.propTypes = {
  isCheckout: PropTypes.bool,
  onChecked: PropTypes.func,
};
export default UserAddressList;