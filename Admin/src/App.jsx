import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ServiceManagement from "./pages/ServiceManagement";
import RequestManagement from "./pages/RequestManagement";
import AdminPanel from "./pages/AdminPanel";
import { Toaster } from "react-hot-toast";
import NotFound from './components/NotFound/NotFound'
import Login from "./components/Auth/Login";
import { useGlobal } from "./context/ContextHolder";
import MyProfile from "./pages/MyProfile";
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from "react-loading-skeleton";
import RequestDetials from "./components/requests-management/RequestDetails";
import ServiceDetials from "./components/service-management/ServiceDetials";
import ChangePassword from "./components/Auth/ChangePassword";
import NewService from "./components/service-management/NewService";
import NewUser from "./components/user-management/NewUser";

const App = () => {

  const { isAuthorized, user } = useGlobal() 

  return (
    <SkeletonTheme highlightColor='#9ca3af' baseColor='#cbd5e1'>
      <Router>
        <Routes>
          <Route path="/" element={isAuthorized? <Navigate to={'dashboard'} replace /> : <Navigate to={'login'} />} />
          <Route element={<AdminPanel />}>
            <Route index path="dashboard" element={isAuthorized? <Dashboard /> : <Navigate to={'/login'} replace />} />
            
            <Route path="user-management" element={isAuthorized? <UserManagement /> : <Navigate to={'/login'} />} />
            <Route path="user-management/new" element={isAuthorized? <NewUser /> : <Navigate to={'/login'} />} />
            <Route path="user-management/detials/:id" element={isAuthorized? <MyProfile /> : <Navigate to={'/login'} />} />
            
            <Route path="service-management" element={isAuthorized? <ServiceManagement /> : <Navigate to={'/login'} />} />
            <Route path="service-management/new" element={isAuthorized? <NewService /> : <Navigate to={'/login'} />} />
            <Route path="service-management/detials/:id" element={isAuthorized? <ServiceDetials /> : <Navigate to={'/login'} />} />
            
            <Route path="request-management" element={isAuthorized? <RequestManagement /> : <Navigate to={'/login'} />} />
            <Route path="request-management/detials/:id" element={isAuthorized? <RequestDetials /> : <Navigate to={'/login'} />} />
            
            <Route path="my-profile" element={isAuthorized? <MyProfile /> : <Navigate to={'/login'} />} />
            <Route path="changePassword" element={isAuthorized? <ChangePassword /> : <Navigate to={'/login'} />} />
            <Route path="changePassword/:id" element={isAuthorized? <ChangePassword /> : <Navigate to={'/login'} />} />
          </Route>

          <Route path="*" element={<NotFound /> } />
          <Route path="login" element={!isAuthorized ||  user?.role!='admin'? <Login /> : <Navigate to={'/dashboard'} replace />} />
        </Routes>
        <Toaster />
      </Router>
    </SkeletonTheme>
  )
}

export default App
