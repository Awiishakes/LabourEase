import { useEffect, useState } from 'react'
import { BiArrowBack, BiPencil } from 'react-icons/bi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import MyProfileLoader from '../components/Loaders/MyProfileLoader';
import FormSubmitLoader from '../components/Loaders/FormSubmitLoader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGlobal } from '../context/ContextHolder';

const MyProfile = () => {

   const { id } = useParams()
   const navigateTo = useNavigate()
  const userValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),
    cnic: Yup.string()
      .required('CNIC is required')
      .matches(/^[0-9]{13}$/, 'CNIC must be exactly 13 digits')
      .matches(/^[1-8]+[1-8]+\d/, 'Invalid CNIC'),
    contact: Yup.string()
      .required('Contact is required')    
      .matches(/^[0][3]+\d/, 'Contact must start with "03"')
      .matches(/^[0-9]{11}$/, 'Contact must be exactly 11 digits'),
  });
 
    const [editMode, setEditMode] = useState(false);
    const {user, setUser, loading} = useGlobal()
    const isId = id? true : false

    const { register, handleSubmit, reset, getValues, watch, formState: { errors, isSubmitting },
    } = useForm({resolver: yupResolver(userValidationSchema)});

    const profile = watch('profile')
    const name = getValues('name')
    
    useEffect(() => {
        if(!loading && !isId){
          reset({name:user?.name, cnic:user?.cnic, contact: user?.contact, address:user?.address})        
        }
      }, [user, reset, loading, isId]);

      useEffect(() => {
        if(!loading && isId){
          axios.get(`http://localhost:4000/api/admin/getUser/${id}`, { withCredentials: true })
          .then((res)=>{
            const { name, cnic, contact, profile } = res.data.myUser[0]
            reset({ name, cnic, contact, profile: profile? profile : null })        
          })
          .catch((err)=>{
            toast.error(err.response.data.message)
            navigateTo('/user-management')
          })
        }
    }, [user, reset, loading, isId, id, navigateTo]);

  const onSubmit = (data) => {
    const formData = new FormData()
    for (const key in data) {
      if (key === 'profile' && profile) {
        formData.append(key,data[key][0])
      }else if (key != 'profile'){
        formData.append(key,data[key])
      }
    }

    if (isId) {
      axios.put(`http://localhost:4000/api/admin/updateUser/${id}`, formData, { withCredentials: true })
      .then((res)=>{
        toast.success(res.data.message)
        setEditMode(false);
      })
      .catch((err)=>toast.error(err.response.data.message))
    }else{
      axios.put(`http://localhost:4000/api/admin/updateProfile/${user._id}`, formData, { withCredentials: true })
      .then((res)=>{
        setUser(res.data.updatedUser)
        toast.success(res.data.message)
        setEditMode(false);
      })
      .catch((err)=>toast.error(err.response.data.message))
    }
  };
  
  const handleCancel = () => {
      reset()        
      setEditMode(false);
    };

    if (loading) {
      return <MyProfileLoader />
    }
    
  return (
      <div className='p-4 bg-gray-100 rounded min-h-screen'>
        {isId?
          <div className="w-full flex justify-between items-center mb-5">
            <h1 className='text-3xl sm:text-4xl text-yellow-500'>
                <span className='text-black'>User </span> Detials
            </h1> 
            <Link to={'/user-management'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
                <BiArrowBack />
            </Link>
          </div>
          // <h1 className='text-4xl text-yellow-400 mb-6'><span className='text-black'>User</span> Detials</h1>
        :
          <h1 className='text-4xl text-yellow-400 mb-6'><span className='text-black'>My</span> Profile</h1>
        }
        {isSubmitting && <FormSubmitLoader />}
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-auto">
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {editMode ? (
              <>
                <button
                  type="button" onClick={handleCancel}
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button
                  type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500">
                  Save
                </button>
              </>
            ) : (
              <button
                type="button" onClick={() => setEditMode(true)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500">
                Edit
              </button>
            )}
          </div>

          <form>
            {/* Profile Image */}
            <div className="flex items-center mb-6">
                <div className="relative w-28 h-28 ">
                <img
                    src={profile?.url? profile?.url : profile? URL.createObjectURL(profile[0]) : user?.profile?.url || "https://via.placeholder.com/100"} alt="Profile"
                    className="w-full h-full rounded-full object-fill border-[1.4px] border-yellow-500"
                />
                <label htmlFor='uploadImage'
                    className={`absolute bottom-0 right-0 ${editMode?'cursor-pointer':'hidden'} bg-yellow-400 text-[#101820] p-2 rounded-full hover:bg-yellow-500`}>
                    <BiPencil/>
                    <input id='uploadImage' type='file' accept='image/*' {...register('profile')} className='hidden' disabled={!editMode} />
                </label>
                </div>
                <div className="ml-4">
                <p className="text-lg font-semibold">{name}</p>
                </div>
            </div>
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-2 capitalize">name</label>
                <input
                  {...register('name')} type={'text'} placeholder={'Enter your Name'} disabled={!editMode}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Password</label>
              <Link to={`/changePassword${isId?'/'+id:''}`} state={{fromProfile: true}} style={{pointerEvents:!editMode&&'none'}}
                className="block bg-gray-200 border border-gray-300 rounded-lg p-2 text-left text-gray-600 hover:bg-gray-300 focus:outline-none">
                Change Password
              </Link>
            </div>

            <div className='w-full grid md:grid-cols-2 gap-x-3'>
              {/* CNIC */}
              <div>
                <label className="block text-gray-600 mb-2 capitalize">cnic</label>
                <input
                  {...register('cnic')} type={'text'} placeholder={'Enter Your Cnic'} disabled={!editMode}
                  className={`w-full border ${errors.cnic ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.cnic && <span className="text-red-500 text-sm">{errors.cnic.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-600 mb-2 capitalize">contact</label>
                <input
                  {...register('contact')} type={'text'} placeholder={'Enter Phone number'} disabled={!editMode}
                  className={`w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.contact && <span className="text-red-500 text-sm">{errors.contact.message}</span>}
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}

export default MyProfile
