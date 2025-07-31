import { useGlobal } from './context/ContextHolder'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Navbar from './components/Navigation/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Service from './pages/Service/Service'
import NotFound from './components/NotFound/NotFound'
import { Toaster } from 'react-hot-toast'
import WorkerPanel from './pages/Portal Dashboard/WorkerPanel'
import MyServices from './pages/Portal Dashboard/MyServices'
import AddService from './components/Services/AddService'
import SubCategories from './pages/Service/SubCategories'
import Dashboard from './pages/Portal Dashboard/Dashboard'
import HomeRedirect from './components/utills/HomeRedirect'
import PrivateRoutes from './components/utills/PrivateRoutes'
import MyRequests from './components/Requests/MyRequests'
import ServiceDetials from './pages/Portal Dashboard/ServiceDetials'
import UpdateRequest from './components/Requests/UpdateRequest'
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from 'react-loading-skeleton'
import MyProfile from './pages/Portal Dashboard/MyProfile'
import ChangePassword from './pages/Auth/ChangePassword'
import ForgetPassword from './pages/Auth/ForgetPassword'

const App = () => {

  const { isAuthorized, role, loading } = useGlobal() 
  const auth = role => ['client','visitor'].includes(role)

  return (
    <>
      <SkeletonTheme highlightColor='#9ca3af' baseColor='#cbd5e1'>
        <div>
          <Router>
            {auth(role) && (<Navbar />)}
            <Routes>
              <Route path={'/'} element={ <HomeRedirect /> } />
              <Route path='home' element={auth(role) ? <Home /> :<Navigate to ='/' /> } />
              <Route path='about' element={auth(role) ? <About /> : <Navigate to='/' /> } />
              <Route path='service' element={auth(role) ? <Service />  :<Navigate to='/' /> }>
                <Route path='subCategories' element={<SubCategories />} />
              </Route>  

              <Route path='worker' element={<PrivateRoutes allowedRoles={['worker']} />} >
                <Route element={<WorkerPanel />}>
                  <Route index path='dashboard' element={<Dashboard />} />
                  <Route path='myServices' element={<MyServices /> }>
                    <Route path='new' element={<AddService />} />
                    <Route path='serviceDetials/:id' element={<ServiceDetials />} />
                  </Route>
                  <Route path='requests' element={<MyRequests />} />
                  <Route path='requestDetials/:id' element={<UpdateRequest />} />
                  <Route path='update' element={<UpdateRequest />} />
                  <Route path='myProfile' element={<MyProfile />} />
                  <Route path='changePassword' element={<ChangePassword />} />
                </Route>
              </Route>
              
              <Route path='client' element={ <PrivateRoutes allowedRoles={['client']}/> } >
                <Route index path='myRequests' element={<MyRequests />} />
                <Route path='requestDetials/:id' element={<UpdateRequest/>} />
                <Route path='serviceDetials/:id' element={<ServiceDetials />} />
                <Route path='myProfile' element={<MyProfile />} />
                <Route path='changePassword' element={<ChangePassword />} />
              </Route> 

              <Route path='forgetPassword' element={!isAuthorized? <ForgetPassword />: <Navigate to='/' replace />} />
              <Route path='login' element={!isAuthorized? <Login />: <Navigate to='/' replace />} />
              <Route path='register' element={!isAuthorized? <Register />: <Navigate to='/' replace />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            {auth(role) && (!loading && <Footer />)}
            <Toaster position='top-left' />
          </Router>
        </div>
      </SkeletonTheme>
    </>
  )
}

export default App
