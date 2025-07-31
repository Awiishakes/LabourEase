import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';


const ChangePassword = () => {
  // Form validation schema

  const { id } = useParams()
  const isId = id? true : false
  const currentPass = isId? {password: yup.string().notRequired(),}: 
  {password: yup.string()
    .required("Current password is required.")
    .min(8, "Password must be at least 8 characters."),
  }

  const paswwordSchema = yup.object().shape({
    ...({...currentPass}),
    newPassword: yup.string()
    .required('New Password is required')
      .matches(/^(?!.*[\s.])/, 'Please do not enter "." or space in password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w)/, 'Please enter atlest 1 lowerCase, 1 upperCase, 1 number and 1 special Charachter')
      .min(8, 'password must be atlest 8 Charachters'),
    confirmPassword: yup.string()
    .required("Please confirm your new password.")
      .oneOf([yup.ref("newPassword")], "Passwords do not match."),
  });

  const navigateTo = useNavigate()
  const location = useLocation()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (location.state?.fromProfile) 
        setAllowed(true) 
      else
        navigateTo('/')
  }, [location.state?.fromProfile, navigateTo]);

  // React Hook Form
  const {
    register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(paswwordSchema),
  });

  // Form submission handler
  const onSubmit = async (data) => {
    delete data.confirmPassword
    
    axios.patch(`http://localhost:4000/api/admin/changePassword${isId?'/'+id:''}`, data, {withCredentials: true})
    .then((res)=>{
      toast.success(res.data.message)
      reset()
      navigateTo(isId? '/userDetials/'+id:'/my-profile')
    })
    .catch((err)=> toast.error(err.response.data.message))
  }

  if(!allowed) return null

  return (
    <div className='flex flex-col sm:px-6 mt-2'>
      <h1 className='text-4xl text-yellow-400 mb-6'><span className='text-black'>Change</span> Password</h1>
      <div className="w-full bg-[#101820] rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Current Password */}
          {!isId && 
            <div className=''>
              <label htmlFor="currentPassword" className="text-sm font-medium text-yellow-400">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className={`mt-1 block text-white/80 w-full bg-transparent p-2 border rounded-md ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          }

          {/* New Password */}
          <div className=''>
            <label htmlFor="newPassword" className="text-sm font-medium text-yellow-400">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={`mt-1 block text-white/80 w-full bg-transparent p-2 border rounded-md ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className=''>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-yellow-400">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`mt-1 block text-white/80 w-full bg-transparent p-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-48 max-w-lg bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
