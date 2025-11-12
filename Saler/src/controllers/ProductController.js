app.controller("ProductController", function ($scope, $location, APIService) {
  $scope.products = [];
  $scope.form = { title: "", description: "", price: 0, sale: 0, stock: 0 };
  $scope.file = null; // ảnh upload
  $scope.previewUrl = null;

  const isAddPage = $location.path() === "/product/add";

  function loadList() {
    APIService.callAPI("saler/products", "GET").then(function (res) {
      $scope.products = res.data || [];
    });
  }

  // Chỉ load danh sách khi đang ở trang /products
  if (!isAddPage) loadList();

  // ==== Upload ảnh ====
  $scope.onFileChange = function (files) {
    $scope.$apply(function () {
      $scope.file = files && files[0] ? files[0] : null;
      $scope.previewUrl = $scope.file ? URL.createObjectURL($scope.file) : null;
    });
  };

  // ==== Thêm sản phẩm (chỉ dùng ở trang /product/add) ====
  $scope.save = function () {
    var fd = new FormData();
    fd.append("title", $scope.form.title);
    fd.append("description", $scope.form.description || "");
    fd.append("price", $scope.form.price);
    fd.append("sale", $scope.form.sale || 0);
    fd.append("stock", $scope.form.stock || 0);
    if ($scope.file) fd.append("image", $scope.file);

    var headers = { "Content-Type": undefined }; // để browser tự set boundary

    APIService.callAPI("saler/products", "POST", fd, headers).then(function () {
      swal("Thành công", "Đã thêm sản phẩm", "success");
      // Sau khi thêm xong -> quay về trang danh sách
      $location.path("/products");
    });
  };

  // (Tuỳ ý) Xoá trực tiếp trong trang danh sách
  $scope.remove = function (p) {
    swal({
      title: "Xóa sản phẩm?",
      text: p.title || p.name,
      icon: "warning",
      buttons: ["Hủy", "Xóa"],
      dangerMode: true,
    }).then(function (ok) {
      if (!ok) return;
      APIService.callAPI("saler/products/" + p._id, "DELETE").then(function () {
        swal("Đã xóa", "", "success");
        loadList();
      });
    });
  };
});
