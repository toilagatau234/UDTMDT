import constants from 'constants/index.js';
// 1. Import trực tiếp AccountPage để tránh lỗi lazy loading với nested route
import AccountPage from 'containers/AccountPage';
import HomePage from 'containers/HomePage';
import ProductDetailPage from 'containers/ProductDetailPage';
import React from 'react';
// Lưu ý: React Router v6 không còn dùng 'exact' trong Route config như v5, nhưng giữ lại trong object này cũng không sao nếu App.js xử lý đúng.

// lazy loading các component khác
const SignUp = React.lazy(() => import('containers/SignUp'));
const Login = React.lazy(() => import('containers/Login'));
const ForgotPassword = React.lazy(() =>
  import('containers/Login/ForgotPassword'),
);
const NotFound = React.lazy(() => import('components/NotFound'));
const Cart = React.lazy(() => import('components/Cart'));
const AdminPage = React.lazy(() => import('containers/AdminPage'));
const SearchResult = React.lazy(() =>
  import('containers/SearchFilterPage/Search'),
);
const FilterResult = React.lazy(() =>
  import('containers/SearchFilterPage/Filter'),
);
const PaymentPage = React.lazy(() => import('containers/PaymentPage'));

// 2. Đã XÓA dòng: const AccountPage = React.lazy(...) để tránh lỗi khai báo trùng

const routes = [
  {
    path: constants.ROUTES.HOME,
    exact: true,
    main: () => <HomePage />,
  },
  {
    path: constants.ROUTES.PRODUCT,
    main: () => <ProductDetailPage />,
  },
  {
    path: constants.ROUTES.SIGNUP,
    exact: true,
    main: () => <SignUp />,
  },
  {
    path: constants.ROUTES.LOGIN,
    exact: true,
    main: () => <Login />,
  },
  {
    path: constants.ROUTES.FORGOT_PASSWORD,
    exact: true,
    main: () => <ForgotPassword />,
  },
  {
    path: constants.ROUTES.ADMIN,
    exact: true,
    main: () => <AdminPage />,
  },
  {
    path: constants.ROUTES.CART,
    exact: false,
    main: () => <Cart list={[]} />,
  },
  {
    path: constants.ROUTES.NOT_FOUND,
    exact: true,
    main: () => <NotFound />,
  },
  {
    path: constants.ROUTES.SEARCH,
    exact: true,
    main: () => <SearchResult />,
  },
  {
    path: constants.ROUTES.FILTER,
    exact: true,
    main: () => <FilterResult />,
  },
  {
    // 3. QUAN TRỌNG: Thêm '/*' để Router biết AccountPage sẽ xử lý các đường dẫn con (như /account/orders)
    path: constants.ROUTES.ACCOUNT + '/*',
    exact: false,
    main: () => <AccountPage />,
  },
  {
    path: constants.ROUTES.PAYMENT,
    exact: true,
    main: () => <PaymentPage />,
  },
];

export default {
  routes,
};