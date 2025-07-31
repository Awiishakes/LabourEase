import React from 'react'
import Skeleton from 'react-loading-skeleton'
import MyServicesLoader from './MyServicesLoader'

const HomeLoader = ({role, page}) => {

  return (
    <>
        {['client','visitor'].includes(role) &&
        <>
            <header className='w-full h-full bg-slate-200'>
                <div className='h-[65svh] min-[500px]:h-[75svh] sm:h-[85svh]'>
                    <svg className='absolute bottom-52 min-[500px]:bottom-32 sm:bottom-20 md:bottom-16' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#fff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <div className="h-5/6 w-full flex justify-center items-center">
                        <div className="w-full text-center">
                            <Skeleton width={'50%'} height={50} className='mb-7' />
                            {page === 'service'?
                                <div className='w-3/5 grid grid-cols-4 mx-auto gap-x-3'>
                                    <Skeleton containerClassName='col-span-3' height={50} />
                                    <Skeleton  height={50} />
                                </div>
                                :
                                <Skeleton width={'40%'} height={20} count={3} />
                            }
                        </div>
                    </div>
                </div>
            </header>
            <section className='w-full py-8 '>
                <div className='w-full text-center mb-14'>
                    <Skeleton height={50} className='w-3/5 md:w-2/5' />
                </div>
                <div className="max-[568px]:max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-screen-2xl mx-auto max-[658px]:px-5 max-2xl:px-8">
                    <div className='grid min-[568px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 gap-x-2 min-[685px]:gap-x-5'>
                        {Array(4).fill(0).map((_, key)=>
                            page === 'service'?
                                <div key={key} className='bg-gray-200 h-64 lg:h-72 pb-10 pt-14 px-4 overflow-hidden rounded-2xl text-center'>
                                    <Skeleton width={50} height={50} className='mb-3' />
                                    <Skeleton width={'70%'} height={30} className='mb-5' />
                                    <Skeleton width={'80%'} height={20} count={2} />
                                </div>
                            :
                                <MyServicesLoader key={key} />
                        )}
                    </div>
                </div>
            </section>
        </>
        }
        {role === 'worker' &&
            <div className="w-full">
                <main className="w-full flex-grow p-6">
                    <div className='w-full grid sm:grid-cols-2 gap-3'>
                        <Skeleton height={230} />
                        <Skeleton height={230} />
                        <div className='sm:col-span-2 mt-6'>
                            <Skeleton width={250} height={40} className='mb-4' />
                            <Skeleton height={25} count={4} className='mb-1' />
                        </div>
                    </div>
                </main>
            </div>    
        }
    </>
  )
}

export default HomeLoader
