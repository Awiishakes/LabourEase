import React from 'react'
import Skeleton from 'react-loading-skeleton'

const MyRequestsLoader = () => {
  return (
      <div className="md:flex items-center justify-start gap-x-3 bg-slate-200 p-4">
        <div className="flex-[40%] max-md:hidden border-r border-r-slate-400 pr-3">
          <Skeleton height={250} />
        </div>
        <div className="flex-[60%]">
          <Skeleton width={250} height={30} className='mb-2' />
          <Skeleton width={120} height={25} className='mb-3' />
          <Skeleton width={'60%'} />
          <Skeleton width={'60%'} />
          <Skeleton width={'60%'} />
          <Skeleton width={'60%'} />
          <Skeleton width={'60%'} />
          <Skeleton height={45} />
        </div>
        <div className="flex md:flex-col max-md:justify-end max-md:mt-3 gap-2">
          <Skeleton width={65} height={30} />
          <Skeleton width={65} height={30} />
        </div>
      </div>
  )
}

export default MyRequestsLoader
