import { useEffect, useState } from 'react'
import { useGlobal } from '../../context/ContextHolder';
import { SkeletonTheme } from 'react-loading-skeleton';
import HomeLoader from '../../components/Loaders/HomeLoader';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import UrduFont from '../../components/utills/UrduFont';


const Dashboard = () => {

  const { user, loading, role }  = useGlobal()    
  const { t, i18n }  = useTranslation()    
  const [completedRequests, setCompltedRequests]  = useState([])    
  const [totalPayment, setTotalPayment]  = useState(0)    

  useEffect(() => {
    const fetchCompletedRequests = async () =>{
      axios.get('http://localhost:4000/api/request/getCompleted',{withCredentials:true})
      .then((res)=>{
        setCompltedRequests(res.data.requests)
        res.data.requests.forEach(val=>setTotalPayment(prev=>prev+val.salary))
      })
      .catch((err)=>toast.error(err.response.data.message))
    }
    fetchCompletedRequests()
  }, []);
  
  if (loading) {
    return <SkeletonTheme highlightColor='#9ca3af' baseColor='#cbd5e1'>
            <HomeLoader role={role} />
          </SkeletonTheme>
  }
  

  return (
    <div className='w-full grid sm:grid-cols-2 gap-3'>
      <div className={`relative flex flex-col gap-y-3 justify-center ${i18n?.language === 'ur'?'items-end':'items-start'} rounded-md p-5`} style={{boxShadow:'2px 4px 10px 1px rgba(201, 201, 201, 0.47)'}}>
        <div className='w-24 h-24 relative rounded-3xl border-[1.2px] border-yellow-400 overflow-clip'>
          <img src={user?.profile?.url? user?.profile?.url : null} alt={'profile'} className='w-full h-full object-fill' />
        </div>
        <div className='tracking-wide space-y-1 text-[#101820]'>
          <h2 className={`text-lg mb-3 font-bold ${i18n?.language === 'ur'&& 'text-right mr-3'}`}>{user?.name}</h2>
          <div className={`flex flex-col gap-y-1 ${i18n?.language === 'ur'?'items-end':'items-start'}`}>
            <p className='font-medium'><UrduFont>{t('fields.cnic')+': '}</UrduFont><span className='font-normal text-gray-500'>&nbsp;{user?.cnic}</span></p>
            <p className='font-medium'><UrduFont>{t('fields.contact')+': '}</UrduFont><span className='font-normal text-gray-500'>&nbsp;{user?.contact}</span></p>
            <p className={`font-medium ${i18n?.language === 'ur'&&'flex flex-row-reverse gap-x-2 text-right'}`}><UrduFont>{t('fields.Address')}</UrduFont> <span className='font-normal text-gray-500'>&nbsp;{user?.address}</span></p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center p-[10px] rounded-lg" style={{boxShadow:'2px 4px 10px 1px rgba(201, 201, 201, 0.47)'}}>
        {/* Card Header */}
        <div className={i18n?.language === 'ur'?'text-right':''}>
          <UrduFont>
            <h2 className="text-2xl font-semibold text-[#101820]">{t('dashboard.compReq')}</h2>
            <p className="text-gray-600 text-sm">{t('dashboard.compReqdes')}</p>
          </UrduFont>
        </div>

        {/* Statistics Section */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* Completed Requests */}
          <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600">{completedRequests.length}</h3>
            <p className="text-gray-600 text-sm text-center"><UrduFont>{t('dashboard.totalReq')}</UrduFont></p>
          </div>
          {/* Balance */}
          <div className="flex flex-col items-center justify-center bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-green-600">Rs./{totalPayment||0}</h3>
            <p className="text-gray-600 text-sm"><UrduFont>{t('dashboard.totalBal')}</UrduFont></p>
          </div>
        </div>
      </div>

        <div className='sm:col-span-2 mt-2'>
          {/* Completed Requests List */}
          <div>
            <h3 className={`${i18n.language==='ur'? 'text-xl font-semibold text-right':'text-left text-lg font-medium'} text-[#101820]`}><UrduFont>{t('dashboard.recentReq')}</UrduFont></h3>
            <ul className="mt-4 space-y-2">
              {completedRequests.length > 0 ? (
                completedRequests.map((request, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                  >
                    <div>
                      <p className="text-[#101820] font-medium">{t('fields.name')}: <span className='text-gray-400'>{request.name}</span></p>
                      <p className="text-[#101820] text-sm">{t('fields.Adderss')}: <span className='text-gray-400'>{request.address}</span></p>
                      <p className="text-green-600 text-sm">{t('dashboard.succReq')}</p>
                    </div>
                    <span className="text-green-600 font-medium">+Rs./{request.salary}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-600 text-sm" style={{textAlign:i18n?.language === 'ur'?'right':'left'}}><UrduFont>{t('dashboard.noReqComp')}</UrduFont></p>
              )}
            </ul>
          </div>
        </div>
    </div>
  )
}

export default Dashboard
