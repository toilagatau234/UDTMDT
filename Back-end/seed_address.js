// Back-end/seed_address.js
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const AddressModel = require('./src/models/address.model');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL_LOCAL || process.env.MONGO_URL;

const seedAddressData = async () => {
  try {
    console.log('1. Dang ket noi MongoDB...', MONGO_URL);
    await mongoose.connect(MONGO_URL);
    console.log('   -> Ket noi thanh cong!');

    console.log('2. Dang tai du lieu tu API...');
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
    const data = response.data;
    console.log(`   -> Da tai xong ${data.length} tinh/thanh.`);

    // QUAN TRỌNG: Xóa sạch collection cũ để xóa luôn các Index bị lỗi
    console.log('3. Dang xoa sach Collection Addresses cu...');
    try {
      await mongoose.connection.db.dropCollection('addresses');
      console.log('   -> Da xoa collection cu thanh cong.');
    } catch (error) {
      if (error.code === 26) {
        console.log('   -> Collection chua ton tai (khong can xoa).');
      } else {
        console.error('   -> Loi khi xoa collection:', error);
      }
    }

    console.log('4. Dang chuan hoa du lieu...');
    const formattedData = data.map((province) => {
      return {
        id: province.code.toString(),
        code: province.code.toString(),
        name: province.name,
        districts: province.districts.map((district) => ({
          id: district.code.toString(),
          code: district.code.toString(),
          name: district.name,
          streets: [], // Mảng rỗng để tránh lỗi
          wards: district.wards.map((ward) => ({
            id: ward.code.toString(),
            code: ward.code.toString(),
            name: ward.name,
            prefix: ward.division_type,
          })),
        })),
      };
    });

    console.log('5. Dang luu du lieu moi (Vui long doi khoang 10-30 giay)...');
    // Dùng insertMany với ordered: false để tăng tốc độ
    await AddressModel.insertMany(formattedData, { ordered: false });

    console.log('================================================');
    console.log('✅ HOAN THANH! DA NAP DATA TINH THANH THANH CONG');
    console.log('================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ LOI:', error);
    process.exit(1);
  }
};

seedAddressData();