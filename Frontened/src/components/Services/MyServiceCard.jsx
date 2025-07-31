import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const MyServiceCard = ({ gig, onDelete }) => {
    const [isActive, setIsActive] = useState(gig.active);

    useEffect(()=>{
        setIsActive(gig.active)
    },[gig])


  return (
    <div className="relative border p-4 rounded shadow-md flex flex-col justify-between gap-y-5 bg-[#101820]">
        <div className='flex flex-col gap-y-1'>
            <img
            src={gig.image?.url}
            alt={gig.title}
            className="w-full h-32 object-fill rounded-md mb-4"
            />

            {/* Gig Title */}
            <h3 className="text-lg text-yellow-400 font-semibold">{gig.title}</h3>

            {/* Gig Details */}
            <p className="text-sm text-white/60">{gig.description.substring(0, 55)}...</p>

            {/* Price */}
            <p className="font-medium text-white">Price: Rs/. {gig.fixedSalary?gig.fixedSalary:`${gig.salaryFrom} - ${gig.salaryTo}`}</p>
        </div>

        {/* Status Toggle */}
        <span
            className={`px-2 absolute right-0 top-0 text-white rounded-bl-xl text-sm cursor-default duration-200 ${
                isActive ? "bg-green-500" : "bg-red-500"
            }`}
            >
            {isActive ? "Active" : "Inactive"}
        </span>

        <div className='flex flex-col '>
            <div className="flex items-center justify-between">
                {/* Edit Button */}
                <Link
                    to={'serviceDetials/'+gig._id}
                    className='py-1 px-3 rounded border border-blue-600 hover:bg-blue-600 text-white active:bg-blue-500 duration-200'
                    >
                    Edit
                </Link>

                {/* Delete Butto */}
                <button
                    onClick={() => onDelete(gig._id)}
                    className="py-1 px-3 rounded border border-red-600 hover:bg-red-600 text-white active:bg-red-500 duration-200"
                    >
                    Delete
                </button>
            </div>

            {/* Details Button */}
            <Link
            to={'serviceDetials/'+gig._id}
            className="text-center mt-2 py-1 px-3 rounded border border-yellow-500 text-white hover:bg-yellow-500 active:bg-yellow-600 duration-200"
            >
                View Detials
            </Link>
        </div>
    </div>
  )
}

export default MyServiceCard
