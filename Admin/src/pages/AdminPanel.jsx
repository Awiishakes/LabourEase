import React from 'react'
import Sidebar from '../components/Navigation/Sidebar'
import { Navigate, Outlet } from 'react-router-dom'
import logo from "../assets/labourEase.png";
import { useGlobal } from '../context/ContextHolder';
import SidebarLoader from '../components/Loaders/SidebarLoader';
import Skeleton from 'react-loading-skeleton';

const AdminPanel = () => {
  const { isAuthorized, loading } = useGlobal()

  if (!isAuthorized ) return <Navigate to={'/login'} replace />
  return (
    <div className='flex'>
        {loading? <SidebarLoader /> : <Sidebar />}
        <div className="w-full relative flex flex-col h-screen overflow-y-hidden">
          {loading?
            <div className="w-full items-center justify-between bg-slate-200 px-6 py-2 flex ">
                <Skeleton width={130} height={35} />
                <span className='lg:hidden'><Skeleton width={45} height={40} /></span>
            </div>
            :
            <header className="w-full bg-[#101820] px-6 flex items-center justify-between">
                <img src={logo} className='w-[clamp(9rem,8rem,5rem)] duration-300'/>
            </header>
            }
            {/* <h1 className='text-4xl text-yellow-500'><span className='text-black'>My</span> Services</h1> */}
        
            <div className="w-full overflow-x-hidden border-t flex flex-col" style={{scrollbarWidth:'thin', scrollbarColor:'#101820 transparent'}}>
                <Outlet />        
            </div>    
        </div>
    </div>
  )
}

export default AdminPanel
