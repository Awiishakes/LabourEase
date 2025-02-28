import React from 'react'

const FormSubmitLoader = () => {
  return (    
    <div className="fixed inset-0 z-10 bg-black/50 flex justify-center items-center gap-x-2 text-white">
        <div className='animate-spin inline-block w-8 h-8 border-4 border-t-transparent rounded-full'/>
        <span className='text-lg tracking-wide'>Submitting please wait..</span>
    </div>
  )
}

export default FormSubmitLoader
