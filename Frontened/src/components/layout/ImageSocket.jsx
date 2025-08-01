import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiTrash } from 'react-icons/bi';
import { RiImageAddFill } from 'react-icons/ri';

const ImageSocket = ({image, index, onUpload, onDelete, editMode}) => {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleImageUpload = async (file) => {
        if (!file) return;        
        // Validate file size (example: max 2MB)
        const maxSizeInMB = 2;
        if (file.size > maxSizeInMB * 1024 * 1024) {
          alert(`File size should not exceed ${maxSizeInMB}MB.`);
          return; 
        }
    
        const imageData = new FormData()
        imageData.append('image',file)
        setUploading(true);
        setProgress(0);
        
        await axios.post('https://labourease-production.up.railway.app/api/request/uploadImage', imageData, {withCredentials:true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
          onUploadProgress: (progress)=>{
            const percent = Math.round((progress.loaded * 100) / progress.total);
            setProgress(percent);
          }
        } )
        .then((res)=> {
            onUpload(index, res.data.imageUrls)
            toast.success(res.data.message)
        })
        .catch((err)=> toast.error(err.response.data.message))
        .finally(()=>{
            setUploading(false)
            setProgress(0)
        })
      }

    const handleImageDelete = async () => {
        await axios.delete(`https://labourease-production.up.railway.app/api/request/deleteImage/${image.public_id}`, {withCredentials:true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}} )
        .then((res)=>{
            onDelete(index)
            toast.success(res.data.message)
        })
        .catch((err)=> toast.error(err.response.data.message))
        .finally(()=>{
            setDeleting(false)
        })
    };

  return (
        <div className="relative border rounded-md overflow-hidden h-32 bg-gray-100 flex items-center justify-center">
            {uploading ? (
                <div className="flex items-center justify-center w-full h-full bg-black/70">
                    <svg className="w-8 h-8 text-yellow-500 " viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none"
                        strokeWidth="4" strokeDasharray="126" strokeDashoffset={126 - (progress / 100) * 126}
                        strokeLinecap="round" stroke="currentColor"
                    />
                    </svg>
                    <span className="absolute text-[8px] font-medium text-white">{progress}%</span>
                </div>
            ) : image ? (
            <>
                <img src={image?.url || ''} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                {editMode && (
                <button type="button" onClick={handleImageDelete} disabled={deleting}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                >
                    {deleting ? 
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor"
                            />
                        </svg>
                        :
                        <BiTrash />
                    }
                </button>
                )}
            </>
            ) : (
            editMode && (
                <>
                <label 
                    className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-md cursor-pointer"
                >
                    <input type="file" id={`upload-${index}`} accept="image/*" className="hidden"
                        onChange={(event) => handleImageUpload(event.target.files[0])}
                    />
                    <RiImageAddFill/>
                </label>
                </>
            )
            )}
        </div>
    )
}

export default ImageSocket
