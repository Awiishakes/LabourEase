import React from 'react'

const Dialog = ({ type, message, onConfirm, onCancel }) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#101820] rounded-lg shadow-lg max-w-1/3 p-6 max-sm:mx-4">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 capitalize">{type === 'delete'? 'Delete' : 'Alert'}</h2>
            <p className="text-white/85 mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 border border-gray-300 text-gray-300 rounded hover:bg-gray-300 hover:text-[#101820]"
                    onClick={onCancel}
                >
                Cancel
                </button>
                <button
                    className={`px-4 py-2 text-white rounded border ${type === 'delete' || type === 'rejected'?'border-red-500 hover:bg-red-500' : 'border-green-500 hover:bg-green-500'} `}
                    onClick={onConfirm}
                >
                    {type === 'delete' && 'Delete' || type==='accepted' && 'Accept' || type==='rejected' && 'Reject' || type==='completed'&&'Confirm'}
                </button>
            </div>
            </div>
        </div>
    );
};
    

export default Dialog
