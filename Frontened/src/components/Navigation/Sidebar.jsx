import { useState } from 'react'
import { AiFillDashboard, AiFillNotification, AiOutlineUser } from 'react-icons/ai'
import axios from 'axios';
import toast from 'react-hot-toast'
import { BiExit } from 'react-icons/bi';
import { useGlobal } from '../../context/ContextHolder';
import { NavLink, useNavigate } from 'react-router-dom';
import { BsCardChecklist } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import UrduFont from '../utills/UrduFont';

const Sidebar = () => {

  const { setIsAuthorized, setRole, role, user, setUser, setLoading } = useGlobal()
  const { t } = useTranslation()
  const navigateTo = useNavigate()

  const logOut = async () => {
    setLoading(true)
    setRole('visitor')
    localStorage.removeItem('token')
    // try {
    //   const response = await axios.get('https://labourease-production.up.railway.app/api/user/logout', { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      toast.success(response.data.message)
      localStorage.removeItem('role')
      setIsAuthorized(false)
      setUser([])
      navigateTo('/')
    // } catch (err) {
    //   setRole(role)
    //   toast.error(err.response.data.message)
    //   setIsAuthorized(true)
    // }
  }
  
  const [active, setActive] = useState(false)

  return (
    <>
      <button className={`${active ? 'lg:hidden':'hidden'} z-[1] h- w-full fixed inset-0 cursor-default bg-black/5`}/>
      <div className={`absolute right-5 top-7 z-[1] lg:hidden cursor-pointer flex flex-col justify-center items-center gap-y-1 ${active && 'cross-icon'} duration-300`} onClick={()=>setActive(!active)}>
        <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
        <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
        <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
      </div>

      <aside className={`lg:relative absolute z-[3] ${active?'left-0':'max-lg:-left-full'} flex flex-col justify-between py-6 bg-[#101820] h-screen w-72 shadow-xl duration-300 ease-in`}>
        <div className='flex flex-col gap-y-7'>
          <div className="w-44 h-44 p-6 mx-auto text-center">
            <div className='w-full h-full rounded-full border-[1.5px] border-yellow-400 overflow-clip mb-2'>
              <img src={user?.profile?.url||null} alt="" className='w-full h-full' />
            </div>
            <span className='text-white'>{user?.name}</span>
          </div>
          <div className="text-white text-base font-semibold ">
            <NavLink to={'dashboard'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center py-4 pl-6 hover:bg-yellow-600`}>
                <AiFillDashboard className="mr-3"/>
                <UrduFont>{t('sideMenu.dashboard')}</UrduFont>
            </NavLink>
            <NavLink to={'myServices'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center py-4 pl-6 hover:bg-yellow-600`}>
                <BsCardChecklist className="mr-3"/>
                <UrduFont>{t('sideMenu.myServices')}</UrduFont>
            </NavLink>
            <NavLink to={'requests'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center text-white/75 py-4 pl-6 hover:bg-yellow-600`}>
                <AiFillNotification className="mr-3"/>
                <UrduFont>{t('sideMenu.serviceRequests')}</UrduFont>
            </NavLink>
          </div>
        </div>

        <div className='mt-20'>
          <hr className='border-yellow-400 border-[1.3px]' />
          <NavLink to={'myProfile'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center text-white/75 pt-4 pb-2 pl-6 hover:bg-yellow-600`}>
              <AiOutlineUser className="mr-3"/>
              <UrduFont>{t('sideMenu.myProfile')}</UrduFont>
          </NavLink>
          <span onClick={logOut} className="flex items-center text-white opacity-75 cursor-pointer hover:opacity-100 py-3 pl-6 hover:bg-yellow-600">
              <BiExit className="mr-3"/>
              <UrduFont>{t('sideMenu.logout')}</UrduFont>
          </span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
