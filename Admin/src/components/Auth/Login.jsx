import { useGlobal } from '../../context/ContextHolder'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { FaIdCard, FaLock } from 'react-icons/fa'
import '../../App.css'
import login_Svg from '../../assets/undraw_secure_login_pdn4.svg'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Input from '../layout/Input'


const Login = () => {

  const { setLoading } = useGlobal()
const navigateTo = useNavigate()
  // Initialize the validation schema using Yup
  const validationSchema = Yup.object().shape({
    cnic: Yup.string()
      .required('CNIC is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Define formStates, submit Function and errorHandling form react-hook-form with yup Shcema 
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(validationSchema), shouldFocusError: false });
  // Handle form submission
  const login = async ({ cnic, password }) => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/admin/login', { cnic, password }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      setLoading(true)
      toast.success(data.message)
      // navigateTo('/')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='max-sm:h-screen md:h-screen flex items-center justify-center'>
      <div className='md:h-[550px] max-sm:w-[90%] text-black flex justify-center items-center px-5 min-[470px]:px-10 min-[520px]:px-16 sm:px-14 md:px-5 min-[860px]:px-20 min-[1132px]:px-36 xl:px-48 py-4 select-none'>
        <div className='w-full md:h-full max-md:pb-[inherit] max-sm:py-10 rounded-xl flex max-md:flex-col max-sm:flex-auto max-md:gap-y-4 justify-end relative overflow-hidden' style={{ boxShadow: '0 0 28px #d9d9d9' }}>
          <div className='max-sm:hidden w-full md:w-1/2 h-full relative bg-yellow-500 left-0 top-0 rounded-br-full px-16 py-12'>
            <div className='md:mt-5'>
              <h1 className='text-[#101820] text-4xl min-[1132px]:text-5xl font-medium mb-6'><span className='text-white/90 text-lg block font-semibold'>Welcome to</span>LabourEase</h1>
              <p className='text-white/90 pr-44 md:pr-8 max-[1132px]:text-sm '>To keep connected with us please login to your account and explore our sevices or provide your services.</p>
              <img className='w-[70%] absolute right-0 bottom-8 max-md:hidden' src={login_Svg} alt='Login' />
            </div>
          </div>
          <div className='w-full md:w-1/2 h-full max-md:px-4 flex flex-col justify-center items-center'>
            <h1 className='text-3xl min-[470px]:text-4xl font-medium tracking-wide mb-8 text-yellow-400'>LOGIN</h1>
            <form onSubmit={handleSubmit(login)} className='w-full max-[470px]:px-6 min-[470px]:w-[300px] lg:w-[360px]'>

              <Input type={'text'} name={'cnic'} Icon={FaIdCard} register={register} errors={errors.cnic} />

              <Input type={'password'} name={'password'} Icon={FaLock} register={register} errors={errors.password} />

              <div className='w-full flex flex-col items-end gap-y-8 mt-2'>
                <Link to={'/forgetPassword'} state={{fromLogin: true}} className='w-fit max-[470px]:text-xs max-lg:text-sm text-[#555] hover:text-yellow-500 duration-300'>Forget Password</Link>
                <button type='submit' className='px-8 lg:px-12 py-2 max-[470px]:text-sm border-[1.2px] border-yellow-400 rounded  relative overflow-hidden text-center outline-none hover:text-white duration-500 z-[1] btn'>LOGIN</button>
              </div>
              {/* <div className='text-xs min-[470px]:text-sm mt-8 text-right'>Want to create Account <Link to={'/register'} className='text-yellow-600 hover:text-yellow-500 underline duration-300'>SignUp</Link></div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login