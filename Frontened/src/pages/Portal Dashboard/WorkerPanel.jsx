import React from 'react'
import Sidebar from '../../components/Navigation/Sidebar'
import logo from '../../images/labourEase.png'
import { Outlet, useLocation } from 'react-router-dom'
import { useGlobal } from '../../context/ContextHolder'
import Skeleton from 'react-loading-skeleton'
import NavbarLoader from '../../components/Loaders/NavbarLoader'
import { useTranslation } from 'react-i18next'


const WorkerPanel = () => {

  const { loading, role }  = useGlobal()
  const { i18n } = useTranslation()
  // const match = (path) => useLocation().pathname === path

  const changeLanguage = (e) =>{
    i18n.changeLanguage(e.target.value)
  }

  return (
    <div className='flex'>
    {loading? <NavbarLoader role={role} /> : <Sidebar/>}
    <div className="w-full relative flex flex-col h-screen overflow-y-hidden">
        {/* <!-- Desktop Header --> */}
        {loading?
            <div className="w-full bg-slate-200 px-6 py-2 flex items-center justify-between">
                <Skeleton width={130} height={35} />
                <Skeleton width={50} height={25} className='max-lg:mr-14' />
                <span className='absolute right-5 lg:hidden'><Skeleton width={45} height={30} /></span>
            </div>
            :
            <header className="w-full bg-[#101820] px-6 flex items-center justify-between">
                <img src={logo} className='w-[clamp(9rem,8rem,5rem)] duration-300'/>
                <select value={localStorage.getItem('i18nextLng')} onChange={changeLanguage} className='lang text-sm bg-transparent outline-none pr-2 cursor-pointer text-white hover:text-yellow-400 max-lg:mr-14 duration-300'>
                  <option className='text-black' value={'en'}>Eng</option>
                  <option className='text-black' value={'ur'}>اردو</option>
                </select>
            </header>
        }
        {/* <h1 className='text-4xl text-yellow-500'><span className='text-black'>My</span> Services</h1> */}
    
        <div className="w-full overflow-x-hidden border-t flex flex-col" style={{scrollbarWidth:'thin', scrollbarColor:'#101820 transparent'}}>
            <main className="w-full flex-grow p-6">
                <Outlet />
            </main>
    
        </div>    
      </div>
    </div>
  )
}

export default WorkerPanel
