app.controller('LoginCtrl', function($scope, APIService) {
  $scope.showPassword = false;

  $scope.login = function() {
    APIService.call('auth/login', 'POST', {
      email: $scope.email,
      password: $scope.password
    }).then(function(res) {
      if (res.data.role === 'saler' || res.data.role === 'admin') {
        APIService.setToken(res.data.token);
        window.location.href = 'index.html';
      } else {
        alert('Tài khoản không có quyền truy cập Saler');
      }
    }).catch(function(err) {
      alert(err.data?.message || 'Sai tài khoản hoặc mật khẩu');
    });
  };
});
