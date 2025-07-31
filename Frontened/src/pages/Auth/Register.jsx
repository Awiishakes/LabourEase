import { useGlobal } from '../../context/ContextHolder'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, Navigate } from 'react-router-dom'
import { FaIdCard, FaLock, FaPhone, FaUser, FaUserTie } from 'react-icons/fa'
import login_Svg from '../../assets/undraw_secure_login_pdn4.svg'
import '../../App.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from './Input'
import { useTranslation } from 'react-i18next'
import { GrUserWorker } from 'react-icons/gr'
import { RegisterValidationSchema } from '../../validations'


const Register = () => {

  const { isAuthorized, setIsAuthorized, role } = useGlobal()
  const { t } = useTranslation()
  const validations = RegisterValidationSchema()

  // Define formStates, submit Function and errorHandling form react-hook-form with yup Shcema 
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(validations), shouldFocusError: false });

  const signUp = async ({ role, name, cnic, contact, password, confirmPassword }) => {
    if (confirmPassword === password) {
      try {
        const { data } = await axios.post('http://localhost:4000/api/user/register', { name, cnic, contact, role, password }, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })
        toast.success(data.message)
        localStorage.setItem('role',data.user.role)
        setIsAuthorized(true)
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error('Please enter the right password')
    }
  }

  // After Login handle index page
  if (isAuthorized && role === 'worker') {
    return <Navigate to={'dashboard'} />
  } else if (isAuthorized) {
    return <Navigate to={'/'} />
  }

  const isErrors = (errors.cnic || errors.password || errors.contact || errors.name)? true : false

  return (
    <>
      <div className={`${isErrors? 'md:h-[820px] duration-200':'md:h-[700px]'} text-[#101820] flex justify-center items-center px-10 min-[470px]:px-14 md:px-5 min-[1000px]:px-20 min-[1132px]:px-36 xl:px-40 py-4 my-24`}>
        <div className='w-full h-full rounded-xl max-md:pt-10 max-sm:pb-14 flex md:flex-row-reverse flex-col-reverse max-md:gap-y-16 justify-start relative overflow-hidden' style={{ boxShadow: '0 0 28px #d9d9d9' }}>
          <div className='max-sm:hidden w-full md:w-1/2 h-full relative bg-yellow-500 right-0 top-0 md:rounded-bl-full max-md:rounded-tr-full px-16 py-12'>
            <div className='mt-16'>
              <h1 className='text-[#101820] text-5xl font-medium mb-6'><span className='text-white/90 text-lg block font-semibold'>New to</span>LabourEase</h1>
              <p className='text-white/90 md:pr-8 pr-28'>Just create your account for secure browsing and explore our sevices or provide your services.</p>
              <img className='w-full absolute bottom-16 right-5 max-md:hidden' src={login_Svg} alt='Login' />
            </div>
          </div>
          <div className='signUp w-full md:w-1/2 max-h-max flex flex-col items-center md:my-9'>
            <h1 className='text-4xl text-yellow-400 font-medium tracking-wide mb-8'>{t('signUp.signUp')}</h1>
            <form onSubmit={handleSubmit(signUp)} className='w-full max-[470px]:px-8 min-[470px]:w-[300px] min-[860px]:w-[360px]'>

              <div className='max-w-[250px] mx-auto min-[470px]:min-w-[280px] sm:w-1/2 grid grid-cols-2 gap-x-3 min-[470px]:gap-x-5 relative'>
                <span>
                  <input type="radio" id='client_box' className='absolute opacity-0 peer' {...register('role')} value={'client'} />
                  <label htmlFor='client_box' className={`w-full h-full flex flex-col items-center peer-checked:bg-yellow-400 hover:bg-yellow-400 border-2 ${errors.role ? 'border-red-500 ' : 'border-yellow-400'} rounded-lg cursor-pointer text-center p-4 duration-500`}>
                    <FaUserTie className='icon text-[#101820] duration-500' />
                    <span>{t('signUp.client')}</span>
                  </label>
                </span>

                <span>
                  <input type="radio" id='worker_box' className='absolute opacity-0 peer' {...register('role')} value={'worker'} />
                  <label htmlFor='worker_box' className={`w-full h-full flex flex-col items-center peer-checked:bg-yellow-400 hover:bg-yellow-400 border-2 ${errors.role ? 'border-red-500' : 'border-yellow-400'}  rounded-lg cursor-pointer text-center p-4 duration-500`}>
                    <GrUserWorker className='icon text-[#101820] duration-500' />
                    <span>{t('signUp.worker')}</span>
                  </label>
                </span>
              </div>

              <Input type={'text'} name={'name'} Icon={FaUser} register={register} errors={errors.name} />

              <Input type={'text'} name={'cnic'} Icon={FaIdCard} register={register} errors={errors.cnic} />

              <Input type={'number'} name={'contact'} Icon={FaPhone} register={register} errors={errors.contact} />

              <Input type={'password'} name={'password'} Icon={FaLock} register={register} errors={errors.password} />

              <Input type={'password'} name={'confirmPassword'} Icon={FaLock} register={register} errors={errors.confirmPassword} />

              <div className='w-full flex flex-col items-end gap-y-4 mt-4'>
                <button type='submit' className='px-8 min-[470px]:px-12 py-2 max-[470px]:text-sm border-[1.2px] border-yellow-500 rounded btn relative overflow-hidden text-center outline-none hover:text-white duration-500 z-[1]'>{t('signUp.signUp')}</button>
                <div className='-mb-8 mt-2 text-xs min-[470px]:text-sm md:text-right text-left'>{t('signUp.alreadyAccP1')} <Link to={'/login'} className='text-yellow-500 hover:text-yellow-500 underline duration-300'>{t('signUp.alreadyAccP2')}</Link></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
