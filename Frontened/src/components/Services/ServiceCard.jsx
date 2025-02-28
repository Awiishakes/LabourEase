import React, { useCallback, useState } from 'react'
import img1 from '../../images/img1.jpg'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import Request from '../Requests/Request'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGlobal } from '../../context/ContextHolder'
import { Link, useLocation, useNavigate } from 'react-router-dom'


const ServiceCard = ({id, image, title, desc, ratings, startTime, endTime, price, priceFrom, priceTo}) => {

    const { isAuthorized } = useGlobal()
    const [isModal, setIsModal] = useState(false)
    const navigateTo = useNavigate()
    const pathName = useLocation().pathname

    const onSubmit = useCallback(async (formData) =>{
        try {
            const {data} = await axios.post('http://localhost:4000/api/request/postRequest', formData,
                {
                    withCredentials: true, 
                    headers: { "Content-Type": "multipart/form-data" }
                })
            toast.success(data.message)
            return data.success
        } catch (err) {
            toast.error(err.response.data.message)
            return err.response.data.success
        }
    }, [])

    return (
        <>
            {/* <div className='serviceCard relative w-full h-[400px] rounded-3xl overflow-hidden' style={{ boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)' }}>
                <div className='relative overflow-hidden imgBox w-full h-full'>
                    <img src={image?.url || img1} alt="" className='w-full h-full duration-500' />
                </div>
                <div className='detials absolute w-full -bottom-16 left-0 p-5 z-[1] duration-500'>
                    <h2 className='text-3xl text-white'>{title}</h2>
                    <p className='text-white'>Rs. {price? price:`${priceFrom} - ${priceTo}`}</p>
                    <div className='flex items-center relative py-1'>
                        <AiFillStar className='text-[#f7f406] ' />
                        <AiFillStar className='text-[#f7f406] ' />
                        <AiFillStar className='text-[#f7f406] ' />
                        <AiFillStar className='text-[#f7f406] ' />
                        <AiOutlineStar className='text-[#f7f406] ' />
                        <span className='text-sm font-semibold ml-2 text-white'>4/5</span>
                    </div>
                    <div className='text-white mt-2'>
                        <p className='max-md:text-sm'>{desc}</p>
                    </div>
                    <div className='flex justify-start items-center w-full gap-x-4 mt-3'>
                        <button className='px-4 py-2 border-2 border-yellow-400 text-xs min-[650px]:text-sm text-white rounded-xl backdrop-blur-[2px]' onClick={()=> isAuthorized? setIsModal(true): navigateTo('/login')}>Book now</button>
                        <Link to={isAuthorized?'/client/serviceDetials/'+id:'/login'} className='px-4 py-2 border-2 border-yellow-400 text-xs min-[650px]:text-sm text-white rounded-xl backdrop-blur-[2px]'>Service details</Link>
                    </div>
                </div>
            </div> */}
            <>
                {isAuthorized && isModal &&
                    <Request workerAvailability={{startTime: startTime, endTime: endTime}} onClose={setIsModal} onSubmit={onSubmit} workId={id} />
                }
            </>

            {/* <div className='bg-[#101820] max-w-[355px] w-full overflow-hidden rounded-3xl pb-1' style={{boxShadow:'0 5px 10px rgba(0,0,0,0.2)'}}>
                <div className="main-image h-56">
                    <img src={image?.url || img1} className='w-full h-full object-fill'  />
                </div>
                <div className='mt-2 p-2 space-y-2'>
                    <span className="name text-2xl uppercase font-medium text-white">{title}</span>
                    <p className='text-xs sm:text-sm font-normal text-gray-400 text-justify'>{desc.slice(0,60)}...</p>
                    <div className="flex items-center gap-x-1 text-yellow-400">
                        {ratings > 0?
                            Array(5).fill(0).map((_,i)=>
                                i < ratings ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
                            )
                            :
                            Array(5).fill(0).map((_,i)=> <AiOutlineStar key={i} /> )
                        }
                        <span className='text-white/70'>({ratings}/5)</span>
                    </div>
                    <div className='price mt-3'>
                        <span className='text-2xl text-white/90 font-semibold'>Rs./{price? price:`${priceFrom} - ${priceTo}`}</span>
                    </div>
                    <div className='w-full flex items-center gap-x-1 justify-center mt-4'>
                        <button onClick={()=> isAuthorized? setIsModal(true): navigateTo('/login')} className='flex-1 px-2 py-2 bg-yellow-400 hover:bg-yellow-600 hover:text-white rounded-l-xl'>Book Now</button>
                        <Link to={isAuthorized?'/client/serviceDetials/'+id:'/login'} className='flex-1 text-center px-2 py-2 bg-yellow-400 hover:bg-yellow-600 hover:text-white rounded-r-xl'>See detials</Link>
                    </div>
                </div>
            </div> */}
            <div className="bg-[#101820] shadow-lg rounded-xl max-sm:p-4 flex sm:flex-col flex-row sm:items-center items-start overflow-hidden">
                <div className="sm:w-full w-2/5">
                    <img src={image?.url || img1} alt={title} className='w-full h-36 min-[500px]:h-44 object-fill'  />
                </div>

                <div className="sm:w-full w-3/5 max-sm:ml-4 flex flex-col justify-between h-full sm:p-4">
                    <h2 className="text-lg min-[500px]:text-xl lg:text-2xl uppercase font-medium text-white">{title}</h2>
                    <p className='text-xs sm:text-sm font-normal text-gray-400 text-justify'>{desc.slice(0,60)}...</p>
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

                    {/* Action Buttons */}
                    {/* <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">View</button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Book</button>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default ServiceCard
