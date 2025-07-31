import React, { useCallback, useState } from 'react'


const RateDialog = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

    // Function to handle rating selection
    const handleRatingClick = useCallback((value) => {
      setRating(value); 
    }, [])
  
    // Function to handle form submission
    const handleSubmit = useCallback(() => {
      if (rating > 0) {
        onSubmit(rating)
      } else {
        document.getElementById('error').classList.remove('hidden')
      }
    }, [onSubmit, rating])
  
console.log("object")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#101820] p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-white">Please rate how much you appreciate service of worker</h2>
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              aria-label={`Rate ${star} star`}
              className={`text-4xl transition-colors duration-200 focus:outline-none ${
                star <= rating ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              &#9733;
            </button>
          ))}
        </div>
        <div className="flex justify-end space-x-4">

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-[#101820] px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
        <p id='error' className='hidden text-red-500 mt-3'>Please Rate before submitting</p>
      </div>
    </div>
  )
}

export default RateDialog
