import React from 'react'
import Skeleton from 'react-loading-skeleton'

const NavbarLoader = ({role}) => {
    
  return (
    <>
        {['client','visitor'].includes(role) &&
            <nav className='fixed top-0 left-0 z-10 w-full h-[70px] py-2 bg-slate-200'>
                <div className='flex w-11/12 items-center justify-between mx-auto'>
                    <Skeleton width={130} height={35} />
                    <ul className='flex gap-x-9 max-md:hidden'>
                        <Skeleton width={70} height={20} />
                        <Skeleton width={70} height={20} />
                        <Skeleton width={70} height={20} />
                    </ul>
                    <div className='flex gap-x-5 items-center'>
                        <Skeleton width={50} height={20} />
                        {role === 'visitor' ? 
                            <div className='flex items-center gap-x-4 max-md:hidden'>
                                <Skeleton width={70} height={20} />
                                <Skeleton width={70} height={20} />
                            </div>
                        :
                            <div className='max-md:hidden'>
                                <Skeleton circle width={50} height={50} />
                            </div>
                        }
                        <div className='md:hidden'>
                            <Skeleton width={45} height={40} />
                        </div>
                    </div>
                </div>
            </nav>
        }
        {role === 'worker' &&
            <aside className=' max-lg:hidden flex flex-col justify-between py-6 bg-slate-200 h-screen w-64 '>
                <div className='flex flex-col gap-y-12'>
                    <div className="flex items-center flex-col gap-y-2">
                        <Skeleton circle width={120} height={120}/>
                        <Skeleton width={70} height={20} />
                    </div>
                    <div className='flex flex-col gap-y-7 py-4 pl-8'>
                        <div className='flex items-center gap-x-2'>
                            <Skeleton width={25} height={25} />
                            <Skeleton width={100} height={25} />
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <Skeleton width={25} height={25} />
                            <Skeleton width={100} height={25} />
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <Skeleton width={25} height={25} />
                            <Skeleton width={100} height={25} />
                        </div>
                    </div>
                </div>
                <div className='mt-20'>
                    <hr className='border-gray-300 border-[1.3px]' />
                    <div className='flex items-center gap-x-2 py-4 pl-6'>
                        <Skeleton width={25} height={25} />
                        <Skeleton width={100} height={25} />
                    </div>
                    <div className='flex items-center gap-x-2 pl-6'>
                        <Skeleton width={25} height={25} />
                        <Skeleton width={100} height={25} />
                    </div>
                </div>
            </aside>
        }
    </>
  )
}

export default NavbarLoader
