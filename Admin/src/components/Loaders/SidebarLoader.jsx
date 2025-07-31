import Skeleton from 'react-loading-skeleton'

const SidebarLoader = () => {
    
  return (
        <aside className='max-lg:hidden flex flex-col justify-between py-6 bg-slate-200 h-screen w-72 '>
            <div className='flex flex-col gap-y-12'>
                <div className="flex items-center flex-col gap-y-2">
                    <Skeleton circle width={120} height={120}/>
                    <Skeleton width={70} height={20} />
                </div>
                <div className='flex flex-col gap-y-4 py-4 pl-8'>
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
                    <div className='flex items-center gap-x-2'>
                        <Skeleton width={25} height={25} />
                        <Skeleton width={100} height={25} />
                    </div>
                </div>
            </div>
            <div className='mt-12'>
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
    )
}

export default SidebarLoader