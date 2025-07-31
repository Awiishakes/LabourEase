import React from 'react'
import { Link } from 'react-router-dom'

const RequestCard = ({role, request, handleAlert}) => {

  return (
    <div className="md:flex relative items-center justify-start gap-x-3 bg-[#101820] border rounded-lg p-4 shadow-lg">
        {role === 'client' && request.isServiceDeleted && (
            <div className="absolute z-[1] left-0 top-0 w-full h-full rounded-lg bg-black/70 flex justify-center items-center text-2xl text-white">{request.message}
                <button onClick={() => handleAlert(request._id,'delete')} className="text-lg border p-2">click to delete</button>
            </div>
        )}
        <div className="flex-[40%] h-[250px] max-md:hidden border-r pr-3">
            <img src={request?.images[0]?.url} alt="service" className="w-full h-full object-fill" />
        </div>
        <div className="flex-[60%] text-yellow-400">
        <h1 className="text-xl text-white/70 mb-2">For service: <span className="text-yellow-500 font-semibold">&nbsp; {request.workId?.title || '---'}</span></h1>
        <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
        <p className="text-yellow-500">Address: <span className="text-white/70">&nbsp;{request.address}, {request.city}</span></p>
        <p className="text-yellow-500">Contact: <span className="text-white/70">&nbsp;{request.contact}</span></p>
        <p className="text-yellow-500">Date: <span className="text-white/70">&nbsp;{request.date.slice(0,10)}</span></p>
        <p className="text-yellow-500">Time: <span className="text-white/70">&nbsp;{request.time}</span></p>
        <p className="text-yellow-500">Salary: <span className="text-white/70">&nbsp;Rs/.{request.salary}</span></p>
        <p className="text-yellow-500 mb-2">Description: <span className="text-white/70">&nbsp;{request.description.slice(0,100)}...</span></p>
        </div>
        <div className="flex md:flex-col max-md:justify-end max-md:mt-3 gap-2">
            {role === 'client' &&
                <>
                    {request.status != 'completed' &&
                        <Link to={'/client/requestDetials/'+request._id}
                            className="py-1 px-3 text-center rounded border border-blue-600 hover:bg-blue-600 text-white active:bg-blue-500 duration-200">
                            {request.status === 'accepted' ? 'More Detials':'Edit'}
                        </Link>
                    }
                    {request.status === 'accepted' &&
                        <button onClick={() => handleAlert(request._id,'completed')}
                            className="py-1 px-3 rounded border border-green-400 hover:bg-green-500 text-white active:bg-green-400 duration-200">
                            Completed
                        </button>
                    }
                    {request.status !=='accepted' &&
                        <button onClick={() => handleAlert(request._id,'delete')}
                            className="py-1 px-3 rounded border border-red-600 hover:bg-red-600 text-white active:bg-red-500 duration-200">
                            Delete
                        </button>
                    }
                </>
            }
            {request.status != null && 
                <div className={`absolute top-1 right-1 px-3 ${request.status==='completed'&&'bg-green-500'} ${request.status==='accepted'&&'bg-blue-500'} ${request.status==='rejected'&&'bg-red-500'} rounded-bl-xl rounded-tr text-white`}>
                    {request.status==='completed'? 'Completed': request.status === 'accepted'? 'Accepted' : 'Rejected'}
                </div>
            }
            {role === 'worker' &&
                request.status != 'completed'&&
                    <>
                        {!request.status &&
                            <button onClick={()=>handleAlert(request._id, 'accepted')}
                                className="py-1 px-3 text-center rounded border border-blue-600 hover:bg-blue-600 text-white active:bg-blue-500 duration-200">
                                Accept
                            </button>
                        }    
                        <button onClick={()=>handleAlert(request._id, 'rejected')}
                            className="py-1 px-3 rounded border border-red-600 hover:bg-red-600 text-white active:bg-red-500 duration-200">
                            Reject
                        </button>
                        <Link to={'/worker/requestDetials/'+request._id}
                        className="py-1 px-3 text-center rounded border border-blue-600 hover:bg-blue-600 text-white active:bg-blue-500 duration-200">
                            More Detials
                        </Link>
                    </>
            }
        </div>
    </div>
  )
}

export default RequestCard
