import React from 'react'
import Skeleton from 'react-loading-skeleton'

const UpdateRequestLoader = () => {
  return (
    <>
        <div className="flex flex-col gap-y-4">
            <Skeleton width={'40%'} height={40} />
            <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 gap-x-2'>
                <Skeleton height={40} count={2} className='mb-1' />
                <Skeleton height={40} count={2} className='mb-1' />
                <Skeleton height={40} count={2} className='mb-1' />
                <Skeleton height={40} />
            </div>
            <Skeleton height={80} />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton height={120} />
                <Skeleton height={120} />
                <Skeleton height={120} />
            </div>
                <Skeleton height={128} />
        </div>
    </>
  )
}

export default UpdateRequestLoader
