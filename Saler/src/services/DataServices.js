app.service('DataServices', function ($http, APIService) {
  var service = this;

  function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
  }

  // ----- Dashboard -----
  service.getSalerDashboard = function () {
    return APIService.callAPI('saler/dashboard', 'GET', null, authHeaders())
      .then(res => res.data)
      .catch(err => { console.error('API dashboard:', err); });
  };

  // ----- Products (thuộc về saler hiện tại) -----
  service.getMyProducts = function () {
    return APIService.callAPI('saler/products', 'GET', null, authHeaders())
      .then(res => res.data)        // mảng sản phẩm
      .catch(err => { console.error('API products:', err); });
  };

  service.getMyProductById = function (id) {
    return APIService.callAPI('saler/products/' + id, 'GET', null, authHeaders())
      .then(res => res.data)        // chi tiết sp
      .catch(err => { console.error('API product by id:', err); });
  };

  service.createMyProduct = function (payload) {
    return APIService.callAPI('saler/products', 'POST', payload, authHeaders())
      .then(res => res.data)
      .catch(err => { console.error('API create product:', err); });
  };

  service.updateMyProduct = function (id, payload) {
    return APIService.callAPI('saler/products/' + id, 'PUT', payload, authHeaders())
      .then(res => res.data)
      .catch(err => { console.error('API update product:', err); });
  };

  service.deleteMyProduct = function (id) {
    return APIService.callAPI('saler/products/' + id, 'DELETE', null, authHeaders())
      .then(res => res.data)
      .catch(err => { console.error('API delete product:', err); });
  };

  // ----- Orders (đơn thuộc shop/saler hiện tại) -----
  service.getMyOrders = function () {
    return APIService.callAPI('saler/orders', 'GET', null, authHeaders())
      .then(res => res.data)        // mảng đơn
      .catch(err => { console.error('API orders:', err); });
  };

  service.updateOrderStatus = function (id, status) {
    return APIService.callAPI('saler/orders/' + id + '/status', 'PUT', { status }, authHeaders())
      .then(res => res.data)
      .catch(err => { console.error('API update order status:', err); });
  };
});
