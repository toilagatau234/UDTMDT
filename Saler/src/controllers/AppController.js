app.controller("AppController", function($scope, APIService) {
  $scope.logout = function () {
    APIService.setToken('');
    window.location.href = './login.html';
  };
});
