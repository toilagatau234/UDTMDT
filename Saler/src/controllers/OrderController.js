app.controller("OrderController", function($scope, $routeParams, DataServices){
  $scope.orders = [];
  $scope.statuses = ['PENDING','CONFIRMED','SHIPPED','COMPLETED','CANCELED'];

  function load(){
    DataServices.getMyOrders().then(function(list){
      $scope.orders = list || [];
    });
  }
  load();

  $scope.updateStatus = function(o){
    DataServices.updateOrderStatus(o._id, o.status).then(function(){
      swal("Đã cập nhật", "Trạng thái đơn hàng đã đổi", "success");
      load();
    });
  };

  // nếu có trang chi tiết
  if ($routeParams.id) {
    // bạn có thể gọi API lấy chi tiết đơn nếu backend có
    // DataServices.getMyOrderById($routeParams.id).then(...)
  }
});
