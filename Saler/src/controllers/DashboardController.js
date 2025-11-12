app.controller('DashboardController', function($scope, APIService) {
  $scope.stats = {};
  $scope.products = [];

  const headers = {};
  const t = localStorage.getItem('token');
  if (t) headers.Authorization = 'Bearer ' + t;

  APIService.callAPI('saler/dashboard', 'GET', null, headers).then(function(res){
    $scope.stats = res.data || {};
  });

  APIService.callAPI('saler/products', 'GET', null, headers).then(function(res){
    $scope.products = res.data || [];
  });

  $scope.createProduct = function() {
    const name  = prompt('Tên sản phẩm?'); if (!name) return;
    const price = Number(prompt('Giá sản phẩm?') || 0);
    const stock = Number(prompt('Tồn kho?') || 0);
    APIService.callAPI('saler/products', 'POST', { name, price, stock }, headers)
      .then(function(){ location.reload(); });
  };

  $scope.deleteProduct = function(id) {
    if (!confirm('Xóa sản phẩm này?')) return;
    APIService.callAPI('saler/products/' + id, 'DELETE', null, headers)
      .then(function(){ location.reload(); });
  };
});
