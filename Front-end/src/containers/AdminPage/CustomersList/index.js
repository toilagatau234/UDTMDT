import { Button, message, Popconfirm, Spin, Table } from 'antd';
import adminApi from 'apis/adminApi';
import React, { useEffect, useState } from 'react';

function CustomersList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Xóa người dùng (Giữ nguyên)
  const onDelCustomer = async (id) => {
    try {
      const response = await adminApi.delCustomer(id);
      if (response && response.status === 200) {
        message.success("Xoá tài khoản thành công");
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      message.error("Xoá tài khoản thất bại");
    }
  };

  const columns = [
    // ... (Giữ nguyên columns)
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Họ Tên",
      key: "fullName",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Loại tài khoản",
      key: "authType",
      dataIndex: "authType",
    },
    {
      title: "Địa chỉ",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Ngày Sinh",
      key: "birthday",
      dataIndex: "birthday",
    },
    {
      title: "Giới tính",
      key: "gender",
      dataIndex: "gender",
      render: (gender) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "",
      render: (_v, records) => (
        <Popconfirm
          title="Bạn có chắc muốn xoá ?"
          placement="left"
          cancelText="Huỷ bỏ"
          okText="Xoá"
          onConfirm={() => onDelCustomer(records.id)}
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    let isSubscribe = true;
    async function getCustomerList() {
      try {
        setIsLoading(true);
        const response = await adminApi.getCustomerList();
        if (response && isSubscribe) {
          // SỬA: Thêm kiểm tra response.data và fallback mảng rỗng
          // Nếu axiosClient trả về data trực tiếp thì dùng response.list, còn không thì response.data.list
          const list = response.data?.list || response.list || [];
          
          const newList = list.map((item, index) => {
            return {
              key: index,
              id: item._id,
              // SỬA: Dùng Optional Chaining (?.) để tránh lỗi nếu accountId null
              email: item.accountId?.email || "Không xác định",
              authType: item.accountId?.authType || "Local",
              fullName: item.fullName,
              birthday: item.birthday,
              gender: item.gender,
              address: item.address,
            };
          });
          setData(newList);
          setIsLoading(false);
        }
      } catch (error) {
        if (isSubscribe) setIsLoading(false);
      }
    }
    getCustomerList();

    return () => {
      isSubscribe = false;
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin
          className="transform-center position-relative"
          size="large"
          tip="Đang lấy danh sách ..."
        />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ showLessItems: true, position: ["bottomCenter"] }}
        />
      )}
    </>
  );
}

export default CustomersList;