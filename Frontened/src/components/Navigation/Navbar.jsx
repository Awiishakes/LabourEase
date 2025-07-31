import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useGlobal } from '../../context/ContextHolder'
import axios from 'axios'
import toast from 'react-hot-toast'
import logo from '../../images/labourEase.png'
import { FaUser, FaUserAlt } from 'react-icons/fa'
import { BiExit } from 'react-icons/bi'
import { BsCardChecklist } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { CgClose } from 'react-icons/cg'
import UrduFont from '../utills/UrduFont'
import NavbarLoader from '../Loaders/NavbarLoader'

function Navbar() {

  const { isAuthorized, setIsAuthorized, user, setUser, setRole, role, setLoading, loading } = useGlobal()
  const navigateTo = useNavigate()
  const navbar = useRef()
  const profileMenu = useRef()
  const { i18n, t } = useTranslation()
  const location = useLocation().pathname
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (loading) setLoading(false)
  }, [loading, setLoading, setUser]);

  useEffect(()=>{
    document.addEventListener('scroll',()=>{
      if (window.scrollY<50 && (location === '/home'))
        navbar?.current.classList.remove('scroll-nav')
      else
        navbar?.current.classList.add('scroll-nav')
    })    
  },[location])

  const logOut = useCallback(async () => {
    setLoading(true)
    setRole('visitor')
    try {
      const response = await axios.get('http://localhost:4000/api/user/logout', { withCredentials: true })
      toast.success(response.data.message)
      localStorage.removeItem('role')
      setIsAuthorized(false)
      setUser([])
      navigateTo('/')
    } catch (err) {
      setRole(role)
      toast.error(err.response.data.message)
      setIsAuthorized(true)
    }
  }, [navigateTo, role, setIsAuthorized, setLoading, setRole, setUser])
  
  const closeSideMenu = useCallback(() => active && setActive(false), [active])
  
  const profileMenuToggle = useCallback(() => {
      profileMenu.current.classList.toggle('scale-100')
      profileMenu.current.classList.toggle('duration-200')
  }, [])
  
  const closeProfileMenu = useCallback(() => {
    if(profileMenu.current.classList.contains('scale-100'))
      profileMenuToggle()
    closeSideMenu()
  }, [closeSideMenu, profileMenuToggle])


  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value)
    if (active) setActive(false)
  }

  if (loading) {
    return <NavbarLoader role={role} />
  }

  return (
    <>
      <nav ref={navbar} className={`navbar fixed top-0 left-0 z-[1001] ${location==='/home'?'bg-transparent':'bg-[#101820] shadow-md'} w-full h-20 py-2 duration-300`}>
        <div className='flex w-11/12 items-center justify-between mx-auto'>
          <img src={logo} className='w-[clamp(9rem,8rem,5rem)] duration-300'/>
          <> <div className={`md:hidden cursor-pointer flex flex-col justify-center items-center gap-y-1 ${active && 'cross-icon'} duration-300`} onClick={()=>setActive(!active)}>
            <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
            <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
            <span className='w-8 h-[2px] bg-white rounded-lg duration-300'></span>
          </div>
          <div className={`flex md:w-[70%] lg:w-[62%] md:items-center md:justify-between max-md:fixed top-20 max-md:bg-[#101820] max-md:flex-col overflow-hidden ${isAuthorized ? 'auth-navbar':'unAuth-navbar'} ${active && 'active'}`}>
            {isAuthorized && 
              <div className='md:hidden flex items-center gap-x-4 m-4  '>
                <span className='bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full overflow-clip'>
                  {user?.profile?.url?
                    <img src={user?.profile?.url} alt="profile" className='w-full h-full' />
                    :
                    <FaUser className='text-base' color='#101820' />
                  }
                </span>
                <span className='flex flex-col'>
                  <h2 className='text-white tracking-[1px]'>{user?.name}</h2>
                  <h3 className='text-white/40 text-sm'>{user?.cnic}</h3>
                </span>
              </div>
            }
            {role !== 'worker' &&
              <ul className='navItems text-white flex text-sm uppercase gap-x-9 tracking-[1px] max-md:flex-col gap-y-8'>
                <NavLink className={({isActive})=>`${isActive && 'active'} mx-auto hover:text-yellow-400 relative ${active?'opacity-100 delay-75':'max-md:opacity-0'} duration-300`} onClick={closeSideMenu} to={'/home'}><li><UrduFont>{t('navbar.home')}</UrduFont></li></NavLink>
                <NavLink className={({isActive})=>`${isActive && 'active'} mx-auto hover:text-yellow-400 relative ${active?'opacity-100 delay-100':'max-md:opacity-0'} duration-300`} onClick={closeSideMenu} to={'about'}><li><UrduFont>{t('navbar.about')}</UrduFont></li></NavLink>
                <NavLink className={({isActive})=>`${isActive && 'active'} mx-auto hover:text-yellow-400 relative ${active?'opacity-100 delay-150':'max-md:opacity-0'} duration-300`} onClick={closeSideMenu} to={'service'} ><li><UrduFont>{t('navbar.services')}</UrduFont></li></NavLink>
              </ul>
            }
            <div className='auth-links relative max-md:border-t max-md:pt-3 text-white flex max-md:justify-center gap-x-10 md:gap-x-5 max-md:w-full text-sm tracking-[1px] '>
              <select value={localStorage.getItem('i18nextLng')} onChange={changeLanguage} className='lang bg-transparent border-2 border-transparent outline-none cursor-pointer hover:text-yellow-400'>
                  <option className='text-white bg-[#101820]' value={'en'}>Eng</option>
                  <option className='text-white bg-[#101820]' value={'ur'}>اردو</option>
              </select>
              {!isAuthorized ? 
                <div className='flex items-center md:gap-x-4 gap-x-11 duration-300 uppercase'>
                  <NavLink className={({isActive})=>`${isActive && 'text-yellow-400'} hover:text-yellow-400 duration-300`} onClick={closeSideMenu} to={'login'}><UrduFont>{t('login.login')}</UrduFont></NavLink>
                  <NavLink className={({isActive})=>`${isActive && 'md:bg-yellow-400 max-md:text-yellow-400'} hover:text-yellow-400 md:border-[1.5px] md:hover:text-[#101820] md:hover:bg-yellow-400 border-yellow-400 rounded-lg p-2 duration-300`} 
                    onClick={closeSideMenu} to={'register'}>
                    <UrduFont>{t('signUp.signUp')}</UrduFont>
                  </NavLink>
                </div>
                :
                <div className=''>
                  <div className='auth-circle flex justify-center items-center w-10 h-10 border-2 border-yellow-400 bg-yellow-400 rounded-full overflow-clip cursor-pointer' onClick={profileMenuToggle}>
                    {user?.profile?.url?
                      <img src={user?.profile?.url} alt="profile" className='object-fill w-full h-full' />
                      :
                      <FaUser className='text-base' color='#101820' />
                    }
                  </div>
                  <div ref={profileMenu} className='profile scale-0 origin-top-right w-60 md:fixed right-[75px] top-16 overflow-hidden shadow-lg rounded-lg rounded-tr-none bg-gray-700 text-white flex justify-center flex-col'>
                    <div className='max-md:hidden absolute right-2 top-2 cursor-pointer hover:text-yellow-400 text-lg' onClick={profileMenuToggle}>
                      <CgClose />
                    </div>
                    <div className='max-md:hidden flex items-center gap-x-3 m-3 p-2 border-b'>
                      <span className='bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full overflow-clip'>
                        {user?.profile?.url?
                          <img src={user?.profile?.url} alt="profile" className='object-fill w-full h-full' />
                          :
                          <FaUser className='text-base' color='#101820' />
                        }
                      </span>
                      <span className='flex flex-col'>
                        <h2>{user?.name}</h2>
                        <h3 className='text-white/30'>{user?.cnic}</h3>
                      </span>
                    </div>
                    <NavLink to={'client/myRequests'} onClick={closeProfileMenu} className={({isActive})=>`${isActive && 'md:bg-gray-800 max-md:text-yellow-400'} info flex items-center gap-x-4 p-2 pl-4 md:hover:bg-gray-800 cursor-pointer duration-300`}>
                      <BsCardChecklist />
                      <h3 className='text-sm'><UrduFont>{t('navbar.myRequests')}</UrduFont></h3>
                    </NavLink>
                    <NavLink to={'client/myProfile'} onClick={closeProfileMenu} className={({isActive})=>`${isActive && 'md:bg-gray-800 max-md:text-yellow-400'} info flex items-center gap-x-4 p-2 pl-4 md:hover:bg-gray-800 cursor-pointer duration-300`}>
                      <FaUserAlt />
                      <h3 className='text-sm'><UrduFont>{t('sideMenu.myProfile')}</UrduFont></h3>
                    </NavLink>
                    <div className={`info flex items-center gap-x-4 p-2 pl-4 pb-3 md:hover:bg-gray-800 cursor-pointer duration-300`} onClick={logOut}>
                      <BiExit size={15}/>
                      <h3 className='text-sm'><UrduFont>{t('sideMenu.logout')}</UrduFont></h3>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          </>
        </div>
      </nav>
    </>
  )
}

export default Navbar
