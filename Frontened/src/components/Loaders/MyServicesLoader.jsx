import React from 'react'
import Skeleton from 'react-loading-skeleton'

const MyServicesLoader = () => {
  return (
    <div className="relative border p-4 rounded flex flex-col justify-between gap-y-5 bg-slate-200">
        <div className='flex flex-col gap-y-1'>
            <Skeleton height={128} className='mb-4' />
            <Skeleton width={'65%'} />
            <Skeleton height={40} />
            <Skeleton width={'70%'} />
        </div>

        <div className='flex flex-col '>
            <div className="flex items-center justify-between">
                <Skeleton width={50} height={20} />
                <Skeleton width={80} height={20} />
            </div>
            <Skeleton height={20} />
        </div>
    </div>
  )
}

export default MyServicesLoader
