import Skeleton from 'react-loading-skeleton'

const DashboardLoader = () => {

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton height={110} />
        <Skeleton height={110} />
        <Skeleton height={110} />
        <Skeleton height={110} />
      </div>

      <div className='bg-gray-200 w-full flex gap-x-1 justify-center mt-4 p-2'>
        <div className='flex gap-x-1 items-end'>
          <Skeleton width={55} height={300} />
          <Skeleton width={55} height={150} />
          <Skeleton width={55} height={240} />
          <Skeleton width={55} height={180} />
          <Skeleton width={55} height={280} />
        </div>
        <div className='flex gap-x-1 items-end max-md:hidden'>
          <Skeleton width={55} height={300} />
          <Skeleton width={55} height={150} />
          <Skeleton width={55} height={240} />
          <Skeleton width={55} height={180} />
          <Skeleton width={55} height={280} />
        </div>
        <div className='flex gap-x-1 items-end max-xl:hidden'>
          <Skeleton width={55} height={300} />
          <Skeleton width={55} height={150} />
          <Skeleton width={55} height={240} />
          <Skeleton width={55} height={180} />
          <Skeleton width={55} height={280} />
        </div>
      </div>

      <div className="mt-8 text-[#101820]">
        <Skeleton width={200} height={35} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
      </div>
    </div>
  )
}

export default DashboardLoader