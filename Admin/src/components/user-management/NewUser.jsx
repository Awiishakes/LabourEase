import axios from 'axios'
import toast from 'react-hot-toast'
import { FaIdCard, FaLock, FaPhone, FaUser, FaUserTie } from 'react-icons/fa'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { GrUserWorker } from 'react-icons/gr'
import { newUserSchema } from '../../validations'
import Input from '../layout/Input'
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';


const NewUser = () => {

  // Define formStates, submit Function and errorHandling form react-hook-form with yup Shcema 
  const { register, handleSubmit, reset, formState: { errors }, } = useForm({ resolver: yupResolver(newUserSchema), shouldFocusError: false });

  const registerUser = async ({ role, name, cnic, contact, password, confirmPassword }) => {
    if (confirmPassword === password) {
      try {
        const { data } = await axios.post('http://localhost:4000/api/admin/newUser', { name, cnic, contact, role, password }, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        })
        toast.success(data.message)
        reset()
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else {
      toast.error('Please enter the right password')
    }
  }

  return (
    <div className='p-4'>
        <div className='w-full flex flex-col'>
            <div className="w-full flex justify-between items-center mb-8">
                <h1 className='text-3xl sm:text-4xl text-yellow-500'>
                    <span className='text-black'>Add new </span> User
                </h1> 
                <Link to={'/user-management'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
                    <BiArrowBack />
                </Link>
            </div>
            <form onSubmit={handleSubmit(registerUser)} className='px-3'>
                <div className='grid min-[500px]:grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-4'>
                    <div className='w-full max-w-xl mx-auto grid grid-cols-2 gap-x-5 relative min-[500px]:col-span-2 xl:col-span-3'>
                        <span>
                            <input type="radio" id='client_box' className='absolute opacity-0 peer' {...register('role')} value={'client'} />
                            <label htmlFor='client_box' className={`w-full h-full flex flex-col items-center peer-checked:bg-yellow-400 hover:bg-yellow-400 border-2 ${errors.role ? 'border-red-500 ' : 'border-yellow-400'} rounded-lg cursor-pointer text-center p-4 duration-500`}>
                                <FaUserTie className='icon text-[#101820] duration-500' />
                                <span>client</span>
                            </label>
                        </span>

                        <span>
                            <input type="radio" id='worker_box' className='absolute opacity-0 peer' {...register('role')} value={'worker'} />
                            <label htmlFor='worker_box' className={`w-full h-full flex flex-col items-center peer-checked:bg-yellow-400 hover:bg-yellow-400 border-2 ${errors.role ? 'border-red-500' : 'border-yellow-400'}  rounded-lg cursor-pointer text-center p-4 duration-500`}>
                                <GrUserWorker className='icon text-[#101820] duration-500' />
                                <span>worker</span>
                            </label>
                        </span>
                    </div>

                    <Input type={'text'} name={'name'} Icon={FaUser} register={register} errors={errors.name} />

                    <Input type={'text'} name={'cnic'} Icon={FaIdCard} register={register} errors={errors.cnic} />

                    <Input type={'number'} name={'contact'} Icon={FaPhone} register={register} errors={errors.contact} />

                    <Input type={'password'} name={'password'} Icon={FaLock} register={register} errors={errors.password} />

                    <Input type={'password'} name={'confirmPassword'} Icon={FaLock} register={register} errors={errors.confirmPassword} />
                </div>

                <div className='w-full mt-4'>
                    <button type='submit' className='px-12 py-2 border-[1.2px] border-yellow-500 rounded btn relative overflow-hidden text-center outline-none hover:text-white duration-500 z-[1]'>Register User</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewUser
