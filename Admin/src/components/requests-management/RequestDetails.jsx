import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RequestValidationSchema } from '../../validations';
import UpdateRequestLoader from '../Loaders/UpdateRequestLoader';
import FormSubmitLoader from '../Loaders/FormSubmitLoader';
import ImageSocket from '../layout/ImageSocket';
// import ClientMap from '../components/layout/map/ClientMap';
// import WorkerMap from '../components/layout/map/WorkerMap';

const RequestDetials = () => {
  
  const { id } = useParams();
  const validation = RequestValidationSchema()
  const navigateTo = useNavigate()
  const [state, setState] = useState({
    editMode: false,
    images: [null, null, null],
    buttonStatus: null,
    loading: true,
    isOpen: false,
    status: null,
    coord: {lat:null, lng:null}
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(validation),
  });

  const images = watch('images')

  useEffect(() => {
    const getMyRequest = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/admin/getRequest/${id}`, { withCredentials: true });
        const { name, contact, address, city, date, time, salary, description, coord, workId, images } = res.data.request;
        reset({
          name, contact, address, city, date: date.slice(0, 10), time, salary, description, title: workId.title,
          images: [...images, ...Array(3 - images.length).fill(null)].slice(0, 3)
        });
        setState((prev) => ({
          ...prev,
          buttonStatus: res.data.request.status || null,
          loading: false,
          coord: coord
        }));
      } catch (err) {
        toast.error(err.response.data.message); 
        setState((prev) => ({ ...prev, loading: false }));
        navigateTo('/request-management')
      }
    };
    getMyRequest();
  }, [id, reset, !state.editMode]);

  const handleEditModeToggle = useCallback(() => {
    setState((prev) => ({ ...prev, editMode: !prev.editMode }));
  }, []);

  const handleImageUpload = useCallback((index, imageUrls) => {
    const updatedImages = [...images]
    updatedImages[index] = imageUrls
    setValue('images', updatedImages)
  }, [images, setValue]);

  const handleImageDelete = useCallback((index) => {
    const updatedImages = [...images]
    updatedImages[index] = null
    setValue('images', updatedImages)
  }, [images, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data){
        if(key != 'title' && key != 'images') formData.append(key, data[key])
      }
      const updatedImages = images.filter((val) => val != null).map((val) => (val._id ? { public_id: val.public_id, url: val.url } : val));
      formData.append('images', JSON.stringify(updatedImages))

      const res = await axios.put(`http://localhost:4000/api/admin/updateRequest/${id}`, formData, { withCredentials: true });
      toast.success(res.data.message);
      handleEditModeToggle();
    } catch (err) {
      toast.error(err.response.data.message || 'Something went wrong');
    }
  }

//   const handleNewCoord = useCallback((newCoord)=> setState((prev)=>({...prev, coord: newCoord})), [])
  
  return (
    <div className='w-full mx-auto bg-white mb-6 p-4'>
      {isSubmitting && <FormSubmitLoader />}
      <Link to={'/request-management'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
          <BiArrowBack className='inline' />
      </Link>
      <div className='flex justify-between items-center mt-3'>
        <h1 className="text-2xl font-bold mb-4">Request Details</h1>
        {/* Buttons */}
        {!state.loading &&
          <div className="flex justify-end space-x-2">
            {state.editMode ? (
              <>
                <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Save
                </button>
                <button type="button" onClick={handleEditModeToggle}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
                <button type="button" onClick={handleEditModeToggle}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Edit
                </button>
            )}
          </div>
        }
      </div>
      {state.loading && <UpdateRequestLoader />}      
      {!state.loading &&
        <form className="space-y-4">
          {/* Service Title (Read-Only) */}
          <div>
            <label className="block font-medium mb-1">Service Title</label>
            <input type="text" {...register('title')} readOnly className="w-full p-2 border rounded bg-gray-100 outline-none" />
          </div>

          <div className='w-full grid sm:grid-cols-2 md:grid-cols-3 gap-x-2'>
              {/* Name */}
              <Input editMode={state.editMode} type={'text'} name={'name'} register={register} errors={errors.name} />

              {/* Contact */}
              <Input editMode={state.editMode} type={'text'} name={'contact'} register={register} errors={errors.contact} />

              {/* Address */}
              <Input editMode={state.editMode} type={'text'} name={'address'} register={register} errors={errors.address} />

              {/* City */}
              <div>
              <label className="block font-medium mb-1">City</label>
              <select {...register('city')} disabled={!state.editMode}
                  className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              >
                  <option>Select City</option>
                  <option>Hyderabad</option>
                  <option>Paretabad</option>
                  <option>Latifabad</option>
              </select>
              {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
              </div>

              {/* Date */}
              <Input editMode={state.editMode} type={'date'} name={'date'} register={register} errors={errors.date} />

              {/* Time */}
              <Input editMode={state.editMode} type={'time'} name={'time'} register={register} errors={errors.time} />

              {/* Salary */}
              <Input editMode={state.editMode} type={'number'} name={'salary'} register={register} errors={errors.salary} />

          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea {...register('description')} readOnly={!state.editMode} style={{scrollbarWidth: 'thin', scrollbarColor:'#101820 transparent'}}
                className={`w-full p-2 border rounded ${!state.editMode&& 'outline-none cursor-default'} ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            ></textarea>
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>

          {/* Image Boxes */}
          <div className="form-group mb-6">
            <label className="block font-medium mb-2">Images</label>
            {errors.images && <span className="text-red-500 text-sm">{errors.images.message}</span>}
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <ImageSocket key={index} index={index} image={image} editMode={state.editMode} onUpload={handleImageUpload} onDelete={handleImageDelete} />
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <label className="block font-medium mb-1">Map</label>
            <div className="w-full h-48 relative border rounded flex items-center justify-center bg-gray-100">
              {/* {state.coord && (!state.editMode && (<WorkerMap locationCoordinates={state.coord} /> ))}
              {state.coord &&(
                (state.editMode && role === "client") && 
                  (<ClientMap
                    addressCoordinates={state.coord}
                    onLocationUpdate={handleNewCoord}
                  />)
              )} */}
            </div>
          </div>
          
        </form>
      }
    </div>
  );
};

export default RequestDetials;


const Input = ({name, editMode, errors, register, type}) =>{
    return(
        <div>
            <label className="block font-medium capitalize mb-1">{name}</label>
            <input type={type} {...register(name)} readOnly={!editMode}
                className={`w-full p-2 border rounded ${!editMode&& 'outline-none cursor-default'} ${errors ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors && <span className="text-red-500 text-sm">{errors.message}</span>}
        </div>
    )
}

