import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { useGlobal } from '../../context/ContextHolder'

const MyProfileLoader = () => {
    const {role} = useGlobal()
  return (
        <div className={`bg-white p-8 w-full max-w-4xl mx-auto ${role==='client'&&'mt-20'}`}>
            <div className="flex justify-end">
                <Skeleton width={70} height={30} className='text-end' />
            </div>
            <div>
                <div className="flex items-center mb-6">
                    <div className="relative w-28 h-28 ">
                        <Skeleton circle height={'100%'} />
                        <div className='absolute bottom-0 right-0'>
                            <Skeleton circle width={30} height={30} />
                        </div>
                    </div>
                    <div className="ml-4">
                        <Skeleton width={90} height={25} />
                    </div>
                </div>
                <div className="w-full md:w-1/2 mb-4">
                    <Skeleton height={40} />
                </div>
                <Skeleton height={40} />
                <div className='w-full grid md:grid-cols-2 gap-x-3 my-4'>
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                </div>
                <Skeleton height={80} />
            </div>
        </div>
    )
}

export default MyProfileLoader
