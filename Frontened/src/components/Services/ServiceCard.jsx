import  { useCallback, useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGlobal } from '../../context/ContextHolder'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Request from '../Requests/Request'


const ServiceCard = ({id, image, title, desc, ratings, startTime, endTime, price, priceFrom, priceTo}) => {

    const { isAuthorized } = useGlobal()
    const [isModal, setIsModal] = useState(false)
    const navigateTo = useNavigate()
    const pathName = useLocation().pathname

    const onSubmit = useCallback(async (formData) =>{
        try {
            const {data} = await axios.post('https://labourease-production.up.railway.app/api/request/postRequest', formData,
                {
                    withCredentials: true, 
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            toast.success(data.message)
            return data.success
        } catch (err) {
            toast.error(err.response.data.message)
            return err.response.data.success
        }
    }, [])

  const onClose = useCallback((value) => setIsModal(value), [])

    return (
        <>
            <div className="bg-[#101820] shadow-lg rounded-xl max-sm:p-4 flex sm:flex-col flex-row sm:items-center items-start overflow-hidden">
                <div className="sm:w-full w-2/5">
                    <img src={image?.url || null} alt={title} className='w-full h-36 min-[500px]:h-44 object-fill'  />
                </div>

                <div className="sm:w-full w-3/5 max-sm:ml-4 flex flex-col justify-between h-full sm:p-4">
                    <h2 className="text-lg min-[500px]:text-xl lg:text-2xl uppercase font-medium text-white">{title}</h2>
                    <p className='text-xs sm:text-sm font-normal text-gray-400 text-justify'>{desc?.slice(0,60)}...</p>
                    <div className="flex items-center gap-x-1 text-yellow-400 max-[500px]:text-sm">
                        {ratings > 0?
                            Array(5).fill(0).map((_,i)=>
                                i < ratings ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
                            )
                            :
                            Array(5).fill(0).map((_,i)=> <AiOutlineStar key={i} /> )
                        }
                        <span className='text-white/70'>({ratings || 0}/5)</span>
                    </div>
                        {/* <span className="text-yellow-500 font-semibold">{service.rate}</span> */}
                    <div className='price min-[500px]:mt-3'>
                        <span className='text-lg min-[500px]:text-2xl text-white/90 font-semibold'>Rs./{price? price:`${priceFrom} - ${priceTo}`}</span>
                    </div>
                    <div className='w-full flex items-center gap-x-1 justify-center mt-2 min-[500px]:mt-4 max-[500px]:text-xs'>
                        <button onClick={()=> isAuthorized? setIsModal(true): navigateTo('/login')} className='flex-1 px-2 py-2 bg-yellow-400 hover:bg-yellow-600 hover:text-white rounded-l-xl'>Book Now</button>
                        <Link to={isAuthorized?'/client/serviceDetials/'+id:'/login'} state={{page: pathName==='/home'?'home':'service'}} className='flex-1 text-center px-2 py-2 bg-yellow-400 hover:bg-yellow-600 hover:text-white rounded-r-xl'>See detials</Link>
                    </div>
                    
                </div>
            </div>
            <div>
                {isModal && <Request woworkerAvailability={{startTime, endTime}} onClose={onClose} onSubmit={onSubmit} workId={id} />}
            </div>
        </>
    )
}

export default ServiceCard
