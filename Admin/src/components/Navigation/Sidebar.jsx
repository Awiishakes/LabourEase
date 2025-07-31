import { useState } from 'react'
import { AiFillDashboard, AiOutlineUser } from 'react-icons/ai'
import axios from 'axios';
import toast from 'react-hot-toast'
import { BiExit } from 'react-icons/bi';
import { useGlobal } from '../../context/ContextHolder';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaClipboardList, FaTasks, FaUsers } from 'react-icons/fa';
import img from '../../../../Frontened/src/images/awais.jpg'

const Sidebar = () => {

  const { setIsAuthorized, setUser, setLoading, user } = useGlobal()
  const navigateTo = useNavigate()

  const logOut = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:4000/api/admin/logout', { withCredentials: true })
      toast.success(response.data.message)
      setIsAuthorized(false)
      setUser([])
      navigateTo('/')
    } catch (err) {
      toast.error(err.response.data.message)
      setIsAuthorized(true)
    }finally{setLoading(false)}
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

      <aside className={`lg:relative absolute z-[3] ${active?'left-0':'max-lg:-left-full'} flex flex-col justify-between py-6 bg-[#101820] h-screen w-[300px] shadow-xl duration-300 ease-in`}>
        <div className='flex flex-col gap-y-7'>
          <div className="w-40 h-48 p-6 mx-auto flex items-center flex-col gap-y-2">
            <div className='w-full h-full rounded-full border-[1.5px] border-yellow-400 overflow-clip'>
              <img src={user?.image?.url || img} alt="Profile_Pic" className='w-full h-full' />
            </div>
            <span className='text-white'>{user?.name}</span>
          </div>
          <div className="text-white text-base font-semibold ">
            <NavLink to={'dashboard'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center py-3 pl-4 hover:bg-yellow-600`}>
                <AiFillDashboard className="mr-3"/>
                Dashboard
            </NavLink>
            <NavLink to={'user-management'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center py-3 pl-4 hover:bg-yellow-600`}>
                <FaUsers className="mr-3"/>
                User Management
            </NavLink>
            <NavLink to={'service-management'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center text-white/75 py-3 pl-4 hover:bg-yellow-600`}>
                <FaTasks className="mr-3"/>
                Service Management
            </NavLink>
            <NavLink to={'request-management'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center text-white/75 py-3 pl-4 hover:bg-yellow-600`}>
                <FaClipboardList className="mr-3"/>
                Requests Management
            </NavLink>
          </div>
        </div>

        <div className=''>
          <hr className='border-yellow-400 border-[1.3px] mb-4' />
          <NavLink to={'my-profile'} onClick={()=>active && setActive(false)} className={({isActive})=>`${isActive? 'bg-yellow-600 text-white':'text-white/75'} flex items-center text-white/75 py-2 pl-6 hover:bg-yellow-600`}>
              <AiOutlineUser className="mr-3"/>
              My Profile
          </NavLink>
          <span onClick={logOut} className="flex items-center text-white opacity-75 cursor-pointer hover:opacity-100 py-2 pl-6 hover:bg-yellow-600">
              <BiExit className="mr-3"/>
              Logout
          </span>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
