import { useEffect, useState } from 'react'
import { BiPencil } from 'react-icons/bi';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobal } from '../../context/ContextHolder';
import axios from 'axios';
import toast from 'react-hot-toast';
import MyProfileLoader from '../../components/Loaders/MyProfileLoader';
import FormSubmitLoader from '../../components/Loaders/FormSubmitLoader';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {

  const { t } = useTranslation() 
  const userValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('validation.required')(t('fields.name')))
      .min(3, t('validation.minLength')(t('fields.name'), 3)),
    cnic: Yup.string()
      .required(t('validation.required')(t('fields.cnic')))
      .matches(/^[0-9]{13}$/, t('validation.cnicLength'))
      .matches(/^[1-8]+[1-8]+\d/, t('validation.cnicInvalid')),
    contact: Yup.string()
      .required(t('validation.required')(t('fields.contact')))    
      .matches(/^[0][3]+\d/, t('validation.contactStart'))
      .matches(/^[0-9]{11}$/, t('validation.contactLength')),
  });
 
    const [editMode, setEditMode] = useState(false);
    const {user, setUser, loading, role} = useGlobal()

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, isSubmitted },
    } = useForm({resolver: yupResolver(userValidationSchema)});

    const profile = watch('profile')
    
    useEffect(() => {
        if(!loading){
            reset({name:user?.name, cnic:user?.cnic, contact: user?.contact, address:user?.address})        
        }
    }, [user, reset, loading]);

  const onSubmit = (data) => {
    const formData = new FormData()
    for (const key in data) {
      if (key === 'profile' && profile) {
        formData.append(key,data[key][0])
      }else if (key != 'profile'){
        formData.append(key,data[key])
      }
    }

    axios.put(`https://labourease-production.up.railway.app/api/user/updateProfile/${user._id}`, formData, { withCredentials: true })
    .then((res)=>{
      setUser(res.data.updatedUser)
      toast.success(res.data.message)
      setEditMode(false);
    })
    .catch((err)=>console.log(err))
  };
  
  const handleCancel = () => {
      reset()        
      setEditMode(false);
    };

    if (loading) {
      return <MyProfileLoader />
    }

  return (
      <div className={`p-4 bg-gray-100 rounded min-h-screen ${role==='client'&&'mt-20'}`}>
        <h1 className='text-4xl text-yellow-400 mb-6'><span className='text-black'>My</span> Profile</h1>
        {isSubmitting && <FormSubmitLoader />}
        <div className={`bg-white shadow-lg rounded-lg p-8 w-full ${role==='worker'&&'max-w-4xl'} mx-auto`}>
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {editMode ? (
              <>
                <button
                  type="button" onClick={handleCancel}
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300">
                  {t('cancel')}
                </button>
                <button
                  type="button" onClick={handleSubmit(onSubmit)}
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
                    src={profile?.length>0? URL.createObjectURL(profile[0]) : user?.profile?.url || "https://via.placeholder.com/100"} alt="Profile"
                    className="w-full h-full rounded-full object-fill border-[1.4px] border-yellow-500"
                />
                {editMode && <label htmlFor='uploadImage'
                    className={`absolute bottom-0 right-0 ${editMode&&'cursor-pointer'} bg-yellow-400 text-[#101820] p-2 rounded-full hover:bg-yellow-500`}>
                    <BiPencil/>
                    <input id='uploadImage' type='file' accept='image/*' {...register('profile')} className='hidden' disabled={!editMode} />
                </label>}
                </div>
                <div className="ml-4">
                <p className="text-lg font-semibold">{user?.name}</p>
                </div>
            </div>
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-2 capitalize">{t('fields.name')}</label>
                <input
                  {...register('name')} type={'text'} placeholder={'Enter your Name'} disabled={!editMode}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">{t('fields.password')}</label>
              <Link to={role==='client'? '/client/changePassword' : '/worker/changePassword'} state={{fromProfile: true}} style={{pointerEvents:!editMode&&'none'}}
                className="block bg-gray-200 border border-gray-300 rounded-lg p-2 text-left text-gray-600 hover:bg-gray-300 focus:outline-none">
                {t('fields.changePass')}
              </Link>
            </div>

            <div className='w-full grid md:grid-cols-2 gap-x-3'>
              {/* CNIC */}
              <div>
                <label className="block text-gray-600 mb-2 capitalize">{t('fields.cnic')}</label>
                <input
                  {...register('cnic')} type={'text'} placeholder={'Enter Your Cnic'} disabled={!editMode}
                  className={`w-full border ${errors.cnic ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.cnic && <span className="text-red-500 text-sm">{errors.cnic.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-600 mb-2 capitalize">{t('fields.contact')}</label>
                <input
                  {...register('contact')} type={'text'} placeholder={'Enter Phone number'} disabled={!editMode}
                  className={`w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                />
                {errors.contact && <span className="text-red-500 text-sm">{errors.contact.message}</span>}
              </div>
            </div>


            {/* Address */}
            {role!= 'client' &&
              <div className="my-4">
                <label className="block text-gray-600 mb-2">{t('fields.Address')}</label>
                <textarea
                  {...register('address')}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter Address"
                  rows="3"
                  disabled={!editMode}
                ></textarea>
              </div>
            }
          </form>
        </div>
      </div>
  );
}

export default MyProfile
