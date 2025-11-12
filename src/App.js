import React, { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import AdminApp from './admin_pages/AdminApp'
import { AuthProvider } from './admin_pages/context/AuthContext'
import 'antd/dist/reset.css'

function App() {
  return (
    <Router>
      <Routes>

        {/* Tất cả routes bắt đầu bằng /admin/* sẽ được xử lý bởi AdminApp
            Các routes khác sẽ được xử lý bởi routes của user */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* User routes */}
        {routes.map((route) => {
          const Page = route.page
          const Layout = route.isShowHeader ? DefaultComponent : Fragment
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={
                <Layout>
                  <Page />
                </Layout>
              } 
            />
          )
        })}
      </Routes>
    </Router>
  )
}

export default App