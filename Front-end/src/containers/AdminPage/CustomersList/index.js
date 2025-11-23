import { Button, message, Popconfirm, Spin, Table } from 'antd';
import adminApi from 'apis/adminApi';
import React, { useEffect, useState } from 'react';

function CustomersList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Xóa người dùng
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
          const { list } = response.data;
          const newList = list.map((item, index) => {
            return {
              key: index,
              id: item._id,
              email: item.accountId.email,
              authType: item.accountId.authType,
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
