import React from 'react'
import Skeleton from 'react-loading-skeleton'

const ServiceDetialsLoader = () => {
  return (
    <>
        <div className="flex justify-between items-center mt-4">
            <Skeleton width={150} height={30} />
            <Skeleton width={60} height={30} />
         </div>
        <div className="sm:grid sm:grid-cols-2 gap-4 mt-4">
            <div className="col-span-2">
                <Skeleton width={350} height={250} />
            </div>
            <Skeleton height={40} count={3} className='mb-4' />
            <Skeleton height={40} count={3} className='mb-4' />
            <div className="col-span-2">
                <Skeleton height={80} />
            </div>
        </div>
    </>
  )
}

export default ServiceDetialsLoader
