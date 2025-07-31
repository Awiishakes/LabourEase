import Skeleton from 'react-loading-skeleton'

const ManagementLoader = () => {
  return (
    <div className="p-4">
      <Skeleton width={220} height={35} />
      <div className="my-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </div>
      </div>
      <div className='w-full'>
        <Skeleton height={45} />
        <div className='max-w-full grid grid-cols-3 gap-x-2 mt-1'>
            <Skeleton height={35} count={4} />
            <Skeleton height={35} count={4} />
            <Skeleton height={35} count={4} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2 text-[#101820]">
          <Skeleton width={60} height={30} />
          <Skeleton width={50} height={30} />
        </div>
        <Skeleton width={100} height={30} />
        <Skeleton width={80} height={30} />
      </div>
    </div>
  )
}

export default ManagementLoader
