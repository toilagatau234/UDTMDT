var app = angular.module('TokyoLifeSaler', ["ngRoute","ngCookies","angular-jwt","ui.switchery"]);

app.config(function ($routeProvider) {
    $routeProvider
        // Trang chính
        .when("/", {
            templateUrl: "./src/pages/dashboard.html",
            controller: "DashboardController"
        })

        // Quản lý sản phẩm
        // .when("/product", {
        //     templateUrl: "./src/pages/product/products.html",
        //     controller: "ProductController"
        // })
        .when("/product/", {
          templateUrl: "./pages/product/list.html",
          controller: "ProductController"
        })
        .when("/product/add", {
            templateUrl: "./src/pages/product/add.html",
            controller: "ProductController"
        })
        .when("/product/edit/:id", {
            templateUrl: "./src/pages/product/edit.html",
            controller: "ProductController"
        })

        // Quản lý đơn hàng
        .when("/order", {
            templateUrl: "./src/pages/order/order.html",
            controller: "OrderController"
        })
        .when("/order/detail/:id", {
            templateUrl: "./src/pages/order/detail.html",
            controller: "OrderController"
        })

        // Thống kê
        .when("/statistical", {
            templateUrl: "./src/pages/statistical/statistical.html",
            controller: "StatisticalController"
        })

        // Nếu URL không khớp thì quay lại dashboard
        .otherwise({ redirectTo: "/" });
});
