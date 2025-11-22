import constants from "../constants/index";

// fn: chuyển đổi 1 số keyword sang mongo key, ex: "lonhon-" => "$gte:"
const replaceMongoKeyword = (value = "") => {
  let result = value;
  constants.PAIR_CONVERT_KEY.forEach((pair) => {
    result = result.replaceAll(pair.l, pair.r);
  });
  return result;
};

// fn: query string: ?t=0&key=1 => [{ t:0 }, { key: 1 }]
const queryString = (query = "") => {
  if (!query || query === "") return [];
  let result = [];
  let q = query;
  // xoá ký tự '?' nếu có
  if (q[0] === "?") q = q.slice(1, q.length);
  // tách các cụm query ['t=0', 'key=1']
  const queryList = q.split("&");
  result = queryList.map((str) => {
    let res = {};
    let temp = str.split("=");
    if (temp.length <= 1) res[temp[0]] = "";
    else res[temp[0]] = temp[1];
    return res;
  });

  return result;
};

// fn: phân tích query param url
// vd: key = p-reg-brand, value = Apple => {brand: {$regex: /^Apple$/i}}
// option p- là thuộc tính trong Product Model
const analysisQuery = (key = "", value = "") => {
  try {
    if (key === "") return;
    let result = {};

    // split '-' => ["p", "reg", "brand"]
    const options = key.split("-");

    // lấy main key là phần tử cuối trong mảng
    const mainKey = options[options.length - 1];

    // Note:nếu tồn tại "p" thì là thuộc tính của product model
    const isProductAttr = options.indexOf("p") === -1 ? false : true;

    // Note: nếu tồn tại "reg" tức là chuỗi cần bỏ vào regex
    const isRegex = options.indexOf("reg");

    // Note: nếu tồn tại "o" tức chuỗi là 1 object
    const isObject = options.indexOf("o");

    // value tồn tại ";" tức là đa giá trị
    const compositeValues = value.split(";");
    if (compositeValues.length <= 1) {
      // Note: đơn giá trị
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        const newObj = {};
        newObj[mainKey] = { $regex: `${value}` };
        Object.assign(result, newObj);
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        const newObj = JSON.parse(`{${value}}`);
        result[mainKey] = newObj;
      } else {
        // không chứa key đặc biệt
        result[mainKey] = `${value}`;
      }
    } else {
      // Note: nhiều giá trị [values]
      result["$or"] = [];
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = { $regex: `${valueItem}` };
          result["$or"].push(newObj);
        });
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = JSON.parse(`{${valueItem}}`);
          result["$or"].push(newObj);
        });
      } else {
        // không chứa key đặc biệt
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = `${valueItem}`;
          result["$or"].push(newObj);
        });
      }
    }

    // return
    return { isProductAttr, result };
  } catch (error) {
    // error
    return { isProductAttr: true, result: {} };
  }
};

// fn: định dạng chuỗi truy vấn
const formatQueryString = (str = "") => {
  let result = str;
  // xoá tất cả ký tự đặc biệt
  result = str.replace(/[`~!@#$%^&*()_|+\-=?;:<>\{\}\[\]\\\/]/gi, "");
  // thay khoảng trắng thành dấu cộng
  result = result.replace(/[\s]/gi, "+");
  return result;
};

// fn: hàm rút gọn tên sản phẩm
const reduceProductName = (name, length = 64) => {
  let result = name;
  if (name && name.length >= length) {
    result = name.slice(0, length) + " ...";
  }
  return result;
};

// fn: hàm format giá sản phẩm
const formatProductPrice = (price) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// fn: tính tỉ lệ sao của sản phẩm [1,2,3,4,5]
const calStar = (rates) => {
  const total = rates.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let rateTotal = 0;
  for (let i = 0; i < 5; ++i) {
    rateTotal += rates[i] * (i + 1);
  }
  return rateTotal / total;
};

// fn: chuyển key product thành tiếng Việt, vd: color => màu sắc
const convertProductKey = (key) => {
  switch (key) {
    case "brand":
      return "Thương hiệu";
    case "aperture":
      return "Khẩu độ";
    case "focalLength":
      return "Tiêu cự";
    case "sensor":
      return "Cảm biến";
    case "numberOfPixel":
      return "Số điểm ảnh";
    case "resolution":
      return "Độ phân giải";
    case "warranty":
      return "Bảo hành";
    case "frameSpeed":
      return "Tốc độ khung hình";
    case "capacity":
      return "Dung lượng (GB)";
    case "capacityPin":
      return "Dung lượng (mAh)";
    case "corePin":
      return "Lõi pin";
    case "size":
      return "Kích thước";
    case "type":
      return "Loại";
    case "typeKeyboard":
      return "Kiểu bàn phím";
    case "readSpeed":
      return "Tốc độ đọc (MB/s)";
    case "writeSpeed":
      return "Tốc độ ghi (MB/s)";
    case "rpm":
      return "Tốc độ vòng quay (RPM)";
    case "manufacturer":
      return "Nhà sản xuất";
    case "generation":
      return "Thế hệ";
    case "generationCpu":
      return "Thế hệ Cpu";
    case "series":
      return "Series";
    case "detailCpu":
      return "CPU";
    case "displaySize":
      return "Kích thước màn hình";
    case "display":
      return "Card màn hình";
    case "operating":
      return "Hệ điều hành";
    case "disk":
      return "Ổ cứng";
    case "ram":
      return "RAM (GB)";
    case "rom":
      return "Bộ nhớ trong (GB)";
    case "typePin":
      return "Kiểu pin";
    case "pin":
      return "Dung lượng pin (mAh)";
    case "weight":
      return "Khối lượng (Kg)";
    case "weightG":
      return "Khối lượng (g)";
    case "chipset":
      return "Chip set";
    case "socketType":
      return "Loại socket";
    case "bus":
      return "Bus (MHz)";
    case "timing":
      return "Timing";
    case "numberOfPort":
      return "Số lượng cổng";
    case "color":
      return "Màu sắc";
    case "cpu":
      return "CPU";
    case "before":
      return "Camera trước";
    case "after":
      return "Camera sau";
    case "ledColor":
      return "Màu led";
    case "frequency":
      return "Tần số quét (Hz)";
    case "fbfrequency":
      return "Tần số phản hồi";
    case "port":
      return "Cổng";
    case "bgPlate":
      return "Tấm nền";
    case "isLed":
      return "Đèn led";
    case "bandwidth":
      return "Băng thông";
    case "strong":
      return "Độ mạnh ăng-ten (dBi)";
    case "connect":
      return "Kết nối";
    case "typeConnect":
      return "Lọai kết nối";
    case "connectionStd":
      return "Chuẩn kết nối";
    case "connectionPort":
      return "Cổng kết nối";
    case "connectWireless":
      return "Kết nối không dây";
    case "wattage":
      return "Công suất (W)";
    case "gpu":
      return "GPU";
    case "gpuLock":
      return "GPU lock";
    case "memory":
      return "Bộ nhớ";
    case "memorySub":
      return "Bộ nhớ hổ trợ";
    case "pci":
      return "Giao tiếp PCI";
    case "processor":
      return "Số lượng đơn vị xử lý(CUDA)";
    case "connector":
      return "Cổng kết nối";
    case "radiators":
      return "Số quạt tản nhiệt";
    case "vr":
      return "VR";
    case "sizeStd":
      return "chuẩn kích thước";
    case "maxRam":
      return "Khe RAM tối đa";
    case "typeRamsub":
      return "Kiểu RAM hỗ trợ";
    case "maxMenmorySub":
      return "Hỗ trợ bộ nhớ tối đa(GB)";
    case "busRamSub":
      return "Bus RAM hỗ trợ";
    case "storage":
      return "Lưu trữ";
    case "typeM2Sub":
      return "Kiểu khe M.2 hỗ trợ";
    case "outputPort":
      return "Cổng xuất hình";
    case "slotPCI":
      return "Khe PCI";
    case "typeScreen":
      return "Loại màn hình";
    case "chargeGate":
      return "Cổng sạc";
    case "voltageIn":
      return "Điện áp vào";
    case "voltageOut":
      return "Điện áp ra";
    case "speed":
      return "Tốc độ";
    case "processingSpeed":
      return "Tốc độ xử lý";
    case "voltage":
      return "Nguồn điện cấp";
    case "suggestVoltage":
      return "Nguồn đề xuất";
    case "accessories":
      return "Phụ kiện đi kèm";
    case "timeResponse":
      return " Thời gian phản hồi (ms)";
    case "Brightness":
      return "Độ sáng (cd/m2)";
    case "colorVisibility":
      return "Khả năng hiển thị màu";
    case "typeSwitch":
      return "Kiểu switch";
    case "keyborad":
      return "Bàn phím";
    case "typeMonitor":
      return "Kiểu màn hình";
    case "multiGpu":
      return "Multi-GPU";
    case "protUsb":
      return "Số cổng USB";
    case "lan":
      return "Lan";
    case "Sound":
      return "Âm thanh";
    case "typeSensor":
      return "Dạng cảm biến";
    case "nameSensor":
      return "Tên cảm biến";
    case "numOfButton":
      return "Số nút bấm";
    case "funcKey":
      return "Phím chức năng";
    case "microphone":
      return "Microphone";
    case "Antenna":
      return "Ăng ten";
    case "cpuRamFlash":
      return "CPU/RAM/Flash";
    case "otherFunc":
      return "Tính năng khác";
    case "multiplier":
      return "Số nhân xử lý";
    case "processingFlow":
      return "Số luồng xử lý";
    case "cache":
      return "Cache (MB)";
    case "graphicsChip":
      return "Chip đồ họa";
    case "tdp":
      return "TDP (W)";
    case "hyperThreading":
      return "Hyper-Threading";

    default:
      return "Chi tiết khác";
  }
};

// fn: chuyên width màn hình window -> size theo ant design
const convertWidthScreen = (size = 576) => {
  if (size < 576) return "xs";
  if (size >= 576 && size < 768) return "sm";
  if (size >= 768 && size < 992) return "md";
  if (size >= 992 && size < 1200) return "lg";
  if (size >= 1200 && size < 1600) return "xl";
  return "xxl";
};

// fn: Hàm chuyển rate thành text
const convertRateToText = (rate = 0) => {
  switch (rate) {
    case 0:
      return "Sản phẩm quá tệ";
    case 1:
      return "Sản phẩm không tốt";
    case 2:
      return "Sản phẩm bình thường";
    case 3:
      return "Sản phẩm tốt";
    case 4:
      return "Cực kỳ hài lòng";
    default:
      return "Sản phẩm bình thường";
  }
};

// fn: format thời gian
const formatDate = (date = new Date().getTime()) => {
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate();

  return `${day} tháng ${m + 1}, ${y}`;
};

//fn: chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
  switch (type) {
    case 0:
      return "Laptop";
    case 1:
      return "Ổ cứng";
    case 2:
      return "Card màn hình";
    case 3:
      return "Mainboard";
    case 4:
      return "RAM";
    case 5:
      return "Điện thoại";
    case 6:
      return "Sạc dự phòng";
    case 7:
      return "Tai nghe";
    case 8:
      return "Bàn phím";
    case 9:
      return "Màn hình";
    case 10:
      return "Chuột";
    case 11:
      return "Router Wifi";
    case 12:
      return "Loa";
    case 13:
      return "Camera";
    case 14:
      return "Webcam";
    case 15:
      return "CPU";

    default:
      return "Khác";
  }
};

// fn: Chuyển series laptop sang chữ
const convertSeriesChipCpu = (series = 0) => {
  switch (series) {
    case 0:
      return "Core i3";
    case 1:
      return "Core i5";
    case 2:
      return "Core i7";
    case 3:
      return "Core i9";
    case 4:
      return "Ryzen 3";
    case 5:
      return "Ryzen 5";
    case 6:
      return "Ryzen 7";
    case 7:
      return "Pentium";
    case 8:
      return "Celeron";
    default:
      return "Core i3";
  }
};

// fn: random màu
const randomColor = () => {
  let r = Math.round(Math.random() * 254 + 1);
  let g = Math.round(Math.random() * 254 + 1);
  let b = Math.round(Math.random() * 254 + 1);
  return `rgb(${r},${g},${b})`;
};

// fn: generate autocomplete search options
const autoSearchOptions = () => {
  let result = [];
  // laptop
  result.push({ value: "Laptop" });
  result.push({ value: "Macbook" });
  result.push({ value: "RAM" });
  result.push({ value: "Ổ cứng SSD" });
  result.push({ value: "Máy ảnh Sony" });
  result.push({ value: "Mainboard Bo mạch chủ" });
  result.push({ value: "Loa, thiết bị âm thanh" });
  result.push({ value: "Màn hình, card màn hình" });
  result.push({ value: "Router wifi" });

  constants.FILTER_BRAND_LAPTOP.map((item) => {
    return result.push({ value: `Laptop ${item.title}` });
  });
  constants.FILTER_CHIP_LAPTOP.map((item) => {
    return result.push({ value: `Laptop ${item.title}` });
  });
  constants.FILTER_SIZE_LAPTOP.map((item) => {
    return result.push({ value: `Laptop ${item.title}` });
  });
  constants.FILTER_BRAND_RAM.map((item) => {
    return result.push({ value: `RAM ${item.title}` });
  });
  constants.FILTER_BUS_RAM.map((item) => {
    return result.push({ value: `RAM Bus ${item.title}` });
  });
  constants.FILTER_CAPACITY_RAM.map((item) => {
    return result.push({ value: `RAM ${item.title}` });
  });
  constants.FILTER_GENERATION_RAM.map((item) => {
    return result.push({ value: `RAM ${item.title}` });
  });
  constants.FILTER_SIZE_DISK.map((item) => {
    return result.push({ value: `Ổ cứng ${item.title}` });
  });
  constants.FILTER_CAPACITY_DISK.map((item) => {
    return (
      result.push({ value: `Ổ cứng SSD ${item.title}` }),
      result.push({ value: `Ổ cứng HDD ${item.title}` })
    );
  });
  constants.FILTER_BRAND_MOBILE.map((item) => {
    return result.push({ value: `Điện thoại ${item.title}` });
  });
  constants.FILTER_BRAND_KEYBOARD.map((item) => {
    return result.push({ value: `Bàn phím ${item.title}` });
  });
  constants.FILTER_TYPE_KEYBOARD.map((item) => {
    return result.push({ value: `${item.title}` });
  });
  constants.FILTER_BRAND_MOUSE.map((item) => {
    return result.push({ value: `Chuột ${item.title}` });
  });
  constants.FILTER_RESOLUTON_MONITOR.map((item) => {
    return result.push({ value: `Màn hình độ phân giải ${item.title}` });
  });
  constants.FILTER_SIZE_MONITOR.map((item) => {
    return result.push({ value: `Màn hình ${item.title}` });
  });
  constants.FILTER_MANUFACTURER_DISPLAY.map((item) => {
    return result.push({ value: `Card màn hình rời ${item.title}` });
  });
  return result;
};

// fn: chuyển đổi series chip
const convertSeriesChip = (series = 0) => {
  switch (series) {
    case 0:
      return "Core i3";
    case 1:
      return "Core i5";
    case 2:
      return "Core i7";
    case 3:
      return "Core i9";
    case 4:
      return "Ryzen 3";
    case 5:
      return "Ryzen 5";
    case 6:
      return "Ryzen 7";
    case 7:
      return "Pentium";
    case 8:
      return "Celeron";
    default:
      return "Khác";
  }
};

// fn: chuyển đổi kích thước ổ cứng
const convertDiskSize = (size = 0) => {
  switch (size) {
    case 0:
      return `2.5"`;
    case 1:
      return `3.5"`;
    case 2:
      return "M.2 2880";
    case 3:
      return "M2";
    default:
      return "Khác";
  }
};

// fn: chuyển đổi chuẩn kêt nối ổ cứng
const convertDiskConnectionStd = (std = 0) => {
  switch (std) {
    case 0:
      return "SATA 3";
    case 1:
      return "USB 3.0";
    case 2:
      return "M.2 SATA";
    case 3:
      return "M.2 NVMe";
    case 4:
      return "USB 3.2";

    default:
      return "Khác";
  }
};

// fn: chuyển đổi loại socket
const convertMainboardSocket = (socketType = 0) => {
  switch (socketType) {
    case 0:
      return "1151-v2";
    case 1:
      return "1200";
    case 2:
      return "AM4";
    case 3:
      return "1151";
    case 4:
      return "sTRX";
    default:
      return "Khác";
  }
};

// fn: chuyển đổi chuẩn kích thước mainboard
const convertMainboardSizeStd = (sizeStd = 0) => {
  switch (sizeStd) {
    case 0:
      return "Micro-ATX";
    case 1:
      return "ATX";
    case 2:
      return "Extend-ATX";
    case 3:
      return "Mini-ATX";
    case 4:
      return "XL-ATX";
    default:
      break;
  }
};

// fn: chuyên đổi loại tai nghe
const convertHeadphoneType = (type = 0) => {
  switch (type) {
    case 0:
      return "Over-ear";
    case 1:
      return "In-ear";
    case 2:
      return "On-ear";
    case 3:
      return "KHT";
    default:
      return "Khác";
  }
};

// fn: Chuyên đổi màu tai nghe
const convertHeadPhoneColor = (color = 0) => {
  switch (color) {
    case 0:
      return "Màu đen";
    case 1:
      return "Màu bạc";
    case 2:
      return "Màu trắng";
    case 3:
      return "Màu hồng";
    case 4:
      return "Màu đỏ";
    case 5:
      return "Màu xám";
    case 6:
      return "Màu xanh";
    case 7:
      return "Màu vàng";
    default:
      return "0";
  }
};

// fn: Chuyển đổi chuẩn kết nối tai nghe
const convertHeadphoneConnectionStd = (std = 0) => {
  switch (std) {
    case 0:
      return "3.5mm";
    case 1:
      return "Bluetooth";
    case 2:
      return "USB";
    case 3:
      return "Bluetooth 4.0";
    case 4:
      return "Bluetooth 5.0";
    case 5:
      return "2.4 GHz Wireless";
    default:
      return "Khác";
  }
};

// fn: Chuyên đổi màu bàn phím
const convertKeyBoardColor = (color = 0) => {
  switch (color) {
    case 0:
      return "Màu đen";
    case 1:
      return "Màu bạc";
    case 2:
      return "Màu trắng";
    case 3:
      return "Màu hồng";
    default:
      return "Khác";
  }
};

const convertSpeakerColor = (color = 0) => {
  switch (color) {
    case 0:
      return "Màu đen";
    case 1:
      return "Màu bạc";
    case 2:
      return "Màu trắng";
    case 3:
      return "Màu hồng";
    case 4:
      return "Màu đỏ";
    case 5:
      return "Màu xám";
    case 6:
      return "Màu xanh";
    case 7:
      return "Màu vàng";
    case 8:
      return "Màu Cam";
    default:
      return "0";
  }
};

// fn: Chuyên đổi Lọa bàn phím
const convertTypeKeyBoard = (type = 0) => {
  switch (type) {
    case 0:
      return "Bàn phím thường";
    case 1:
      return "Bàn phím giả cơ";
    case 2:
      return "Bàn phím cơ";
    default:
      return "0";
  }
};

// fn: Chuyên đổi màu bàn phím
const convertMouseColor = (color = 0) => {
  switch (color) {
    case 0:
      return "Màu đen";
    case 1:
      return "Màu bạc";
    case 2:
      return "Màu trắng";
    case 3:
      return "Màu hồng";
    case 4:
      return "Màu đỏ";
    case 5:
      return "Màu xám";

    default:
      return "Khác";
  }
};

// fn: Chuyên đổi led bàn phím
const convertKeyBoardLed = (led = 0) => {
  switch (led) {
    case 0:
      return "Không led";
    case 1:
      return "Đơn sắc";
    case 2:
      return "Rainbow";
    case 3:
      return "RGB";
    default:
      return "Khác";
  }
};

// fn: chuyển đổi tấm nền màn hình
const convertBgPlate = (bgPlate) => {
  switch (bgPlate) {
    case 0:
      return "IPS";
    case 1:
      return "VA";
    case 2:
      return "TN";
    case 3:
      return "PLS";
    case 4:
      return "MVA";
    case 5:
      return "KHT";
    default:
      return "Khác";
  }
};

// fn: chuyển đổi độ phân giải
const convertMonitorResolution = (res = 0) => {
  switch (res) {
    case 0:
      return "1920 x 1080";
    case 1:
      return "2560 x 1440";
    case 2:
      return "1920 x 1200";
    case 3:
      return "1366 x 768";
    case 4:
      return "1600 x 900";
    case 5:
      return "3840 x 2160";
    case 6:
      return "2560 x 1080";
    case 7:
      return "3440 x 1440";
    default:
      return "1920 x 1080";
  }
};

// fn: chuyển đổi Cổng sạc điện thoại
const convertMobileChargeGate = (res = 0) => {
  switch (res) {
    case 0:
      return "USB Type-C";
    case 1:
      return "Lightning";
    case 2:
      return "Micro USB";
    default:
      return "1920 x 1080";
  }
};

// fn: Chuyển đổi giá trị product từ number sang string
const convertProductValue = (type = 0, product) => {
  if (product === null || product === undefined) return product;
  switch (type) {
    // laptop
    case 0:
      return {
        ...product,
      };
    // disk
    case 1:
      const { size, connectionStd } = product;
      const newType = product.type ? "SSD" : "HDD";
      return {
        ...product,
        size: convertDiskSize(size),
        type: newType,
        connectionStd: convertDiskConnectionStd(connectionStd),
      };
    // display
    case 2:
      const { manufacturer, pci, vr } = product;
      const newManuf = manufacturer ? "AMD" : "NVIDIA";
      const newPci = pci ? "PCI Express 3.0" : "PCI Express 4.0";
      const newVr = vr ? "Hổ trọ" : "Không hổ trợ";
      return { ...product, manufacturer: newManuf, pci: newPci, vr: newVr };
    // main board
    case 3:
      const { socketType, sizeStd, typeRamsub, typeM2Sub } = product;
      const newTypeRamSub = typeRamsub ? "DDR3" : "DDR4";
      const newTypeM2Sub = typeM2Sub ? "M.2 NVMe" : "1-M.2 SATA/NVMe";
      return {
        ...product,
        typeRamsub: newTypeRamSub,
        typeM2Sub: newTypeM2Sub,
        socketType: convertMainboardSocket(socketType),
        sizeStd: convertMainboardSizeStd(sizeStd),
      };
    // ram
    case 4:
      const newRamType =
        product.type === 0 ? "DDR3" : product.type === 1 ? "DDR3L" : "DDR4";
      return { ...product, type: newRamType };
    // mobile
    case 5:
      const { operating, chargeGate } = product;
      const newOps = operating ? "IOS" : "Android";
      return {
        ...product,
        operating: newOps,
        chargeGate: convertMobileChargeGate(chargeGate),
      };
    // headphone
    case 7:
      const { microphone, typeConnect } = product;
      const newMicrophone = microphone ? "Không" : "Có";
      const newTypeConnect = typeConnect
        ? "Tai nghe có dây"
        : "Tai nghe không dây";
      const newHeadphoneType = convertHeadphoneType(product.type);
      return {
        ...product,
        type: newHeadphoneType,
        color: convertHeadPhoneColor(product.color),
        typeConnect: newTypeConnect,
        microphone: newMicrophone,
      };
    //  keyboard
    case 8:
      const newTypeKeyboard = convertTypeKeyBoard(product.typeKeyboard);
      const newColor = convertKeyBoardColor(product.color);
      const newLed = convertKeyBoardLed(product.ledColor);
      return {
        ...product,
        typeKeyboard: newTypeKeyboard,
        color: newColor,
        ledColor: newLed,
      };
    // monitor
    case 9:
      const { typeMonitor } = product;
      const newTypeMonitor = typeMonitor ? "Màn hình cong" : "Màn hình phẳng";
      return {
        ...product,
        bgPlate: convertBgPlate(product.bgPlate),
        resolution: convertMonitorResolution(product.resolution),
        typeMonitor: newTypeMonitor,
      };
    //  mouse
    case 10:
      const { color } = product;
      return {
        ...product,
        color: convertMouseColor(color),
        typeConnect: product.typeConnect ? "Không dây" : "Có dây",
        isLed: product.isLed ? "Có led" : "Không led",
        typeSensor: product.isLed ? "Optical" : "laser",
      };
    // router
    case 11:
      return {
        ...product,
        bandwidth: product.bandwidth ? "2.4 GHz/5 GHz" : "2.4 GHz",
      };
    case 12:
      return {
        ...product,
        color: convertSpeakerColor(product.color),
      };

    // webcam
    case 14:
      const newResolution =
        product.resolution === 0
          ? "720p"
          : product.resolution === 1
          ? "1280 x 720"
          : "1920 x 1080";
      return {
        ...product,
        connectionStd: product.connectionStd ? "USB 2.0" : "USB",
        resolution: newResolution,
      };
    default:
      return product;
  }
};

// fn: chuyển đổi thời gian now -> dd/mm/yyyy
const formatOrderDate = (date = Date.now(), flag = 0) => {
  const newDate = new Date(date);
  const d = newDate.getDate(),
    m = newDate.getMonth() + 1,
    y = newDate.getFullYear();
  return flag === 0
    ? `${d}/${m}/${y}`
    : `${newDate.getHours()}:${newDate.getMinutes()} ${d}/${m}/${y}`;
};

// fn: chuyển đổi tình trạng đơn hàng
const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 0:
      return "Đặt hàng thành công";
    case 1:
      return "Đã tiếp nhận";
    case 2:
      return "Đang lấy hàng";
    case 3:
      return "Đóng gói xong";
    case 4:
      return "Đang giao vận chuyển";
    case 5:
      return "Đang vận chuyển";
    case 6:
      return "Giao hàng thành công";
    default:
      return "Đặt hàng thành công";
  }
};

// fn: chuyển đổi phương thức thanh toán
const convertPaymentMethod = (payMethod = 0) => {
  switch (payMethod) {
    case 0:
      return "Thanh toán tiền mặt khi nhận hàng";
    case 1:
      return "Thanh toán online";
    default:
      return "Thanh toán tiền mặt khi nhận hàng";
  }
};

// fn: tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  const { transportFee, orderProd, numOfProd } = order;
  const total =
    transportFee +
    (orderProd.price * numOfProd -
      (orderProd.price * numOfProd * orderProd.discount) / 100);
  return total;
};

// fn: tính tổng phí đơn hàng
const calTotalOrderFee2 = (order) => {
  const { transportFee, orderDetails} = order;
  const total = orderDetails.reduce((total, item) => {
    return total +=
    item.orderProd.price * item.numOfProd -
    (item.orderProd.price * item.numOfProd *item.orderProd.discount) /100
  }, 0)
  return total + transportFee;
};

export default {
  replaceMongoKeyword,
  formatQueryString,
  queryString,
  analysisQuery,
  convertProductValue,
  reduceProductName,
  formatProductPrice,
  calStar,
  convertProductKey,
  convertWidthScreen,
  convertRateToText,
  convertProductType,
  formatDate,
  convertSeriesChipCpu,
  randomColor,
  autoSearchOptions,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  calTotalOrderFee,
  calTotalOrderFee2
};
