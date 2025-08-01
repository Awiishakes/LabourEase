import React, { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import MyServiceCard from '../../components/Services/MyServiceCard'
import MyServicesLoader from '../../components/Loaders/MyServicesLoader'
import { useTranslation } from 'react-i18next'
import Dialog from '../../components/layout/Dialog'
import UrduFont from '../../components/utills/UrduFont'

function MyServices() {
  
  const location = useLocation().pathname
  const { t } = useTranslation()
  const isActive = (path)=> location === path
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState()
  const [state, setState] = useState({id:null, isOpen:false})
 
  useEffect(() => {
    const getAllMyPosts = async () =>{
      setLoading(true)
      await axios.get('https://labourease-production.up.railway.app/api/work/getMyServices', { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      .then((res)=>{
        setGigs(res.data.myServices)
      })
      .catch((errors)=>{toast.error(errors.response.data.message)})
      .finally(()=> setLoading(false))
    }

    getAllMyPosts()
  }, [location]);
  
  const closeDialog = useCallback(() => setState({id:null, isOpen:false}), [])
  const openDialog = useCallback((id) => setState({id, isOpen: true}), [])

  const handleDelete = async () =>{
    await axios.delete(`https://labourease-production.up.railway.app/api/work/delete/${state.id}`,{ withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
    .then((res)=>{
      toast.success(res.data.message)
      setGigs(gigs=> gigs.filter(gig=> gig._id !== id))
    })
    .catch((err)=>toast.error(err.response.data.message))
    .finally(()=>closeDialog())
  }


  return (
    <>
      {state.isOpen && <Dialog type={'delete'} message={t('dialog.delete')} onCancel={closeDialog} onConfirm={handleDelete}  />}
      <div className={`${!isActive('/worker/myServices')&&'hidden'}  max-sm:px-2 `}>
        <header className="mb-6 flex justify-between items-center">
        <h1 className='text-4xl text-yellow-500'><span className='text-black'>
          <UrduFont>{t('myServices.titleP1')}</UrduFont></span> <UrduFont>{t('myServices.titleP2')}</UrduFont>
        </h1>
          <NavLink to={'new'} className='bg-[#101820] text-white px-4 py-2 rounded-md shadow-md'>
            + <UrduFont>{t('myServices.addBtn')}</UrduFont>
          </NavLink>
        </header>

        <div className="grid min-[500px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading?
            Array(4).fill(0).map((_,i)=> <MyServicesLoader key={i} />)
            :
            gigs.map((gig,key) => (
              <MyServiceCard gig={gig} key={key} onDelete={openDialog} />
            ))
          }
        </div>

        {/* No Gigs Found */}
        {gigs.length === 0 && (
          <p className="text-center text-lg text-gray-500 mt-10">
            {t('myServices.noService')}
          </p>
        )}
      </div>
      <Outlet />
    </>
  )
}

export default MyServices
