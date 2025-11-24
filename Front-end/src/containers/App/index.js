//commons css
import 'antd/dist/antd.css';
import 'commons/utils/index.scss';
import ContactIcon from 'components/ContactIcon';
import FooterView from 'components/FooterView';
import HeaderView from 'components/HeaderView';
import GlobalLoading from 'components/Loading/Global';
import NotFound from 'components/NotFound';
import ScrollTo from 'components/ScrollTo';
//configuration
import 'configs/message.config';
import routesConfig from 'configs/routesConfig';
//React
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authActions from 'reducers/auth';
import userActions from 'reducers/user';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authenticate.isAuth);
  const { routes } = routesConfig;

  useEffect(() => {
    //authentication
    dispatch(authActions.getIsAuth());
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    //get user -> store redux
    if (isAuth) dispatch(userActions.getUserRequest());
    return () => {};
  }, [isAuth, dispatch]);

  //rendering...
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoading />}>
        <div className="App" id="app">
          <HeaderView />
          <ScrollTo />
          <ContactIcon />
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.main()}
              />
            ))}
            {/* Route 404 phải đặt ở cuối cùng */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <FooterView />
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
