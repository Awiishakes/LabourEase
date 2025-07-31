import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigateTo = useNavigate()
  const intervalId = useRef(null)
  const secureEntry = useLocation().state
  const [allowed, setAllowed] = useState(false)
  const [state, setState] = useState({
    step:1, 
    number:'', 
    otpSent: false, 
    otp: null, 
    timer:null
  });

  useEffect(() => {
    if (secureEntry?.fromLogin) 
      setAllowed(true)
    else
      navigateTo('/login')
  }, [navigateTo, secureEntry?.fromLogin])

  useEffect(() => {
    if (state.otp) {
      setTimeout(() => {
        setState((prev)=>({...prev, otp: null}))
      }, 60000);
    }
  }, [state.otp]);

  const cnicSchema = yup.object().shape({
    cnic: yup.string()
        .required('CNIC is required')
        .matches(/^[0-9]{13}$/, 'CNIC must be exactly 13 digits')
        .matches(/^[1-8]+[1-8]+\d/, 'Invalid CNIC')
  });

  const otpSchema = yup.object().shape({
    otp: yup.string()
      .required('OTP is required')
      .length(6, 'Otp must be 6 characters')
  });
 
  const passwordSchema = yup.object().shape({
    newPassword: yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
  });

  const validationSchemas = [cnicSchema, otpSchema, passwordSchema]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchemas[state.step-1]),
  });


  // Handle National ID submission
  const handleCnicSubmit = async ({cnic}) => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/user/forgetPassword/verifyId", { cnic });
      setState((prev)=>({...prev, number: data.contact, step: 2}))
    } catch (error) {
      toast.error(error.response.data.message|| "Something went wrong")
    }
  }

  const startTimer = useCallback(() => {
    setState((prev)=>({...prev, timer: 60}))
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }
    intervalId.current = setInterval(() => {
      setState((prev) => {
        if (prev.timer <= 1) {
          clearInterval(intervalId.current);
          intervalId.current = null
          return { ...prev, timer: 0};
        }
        return { ...prev, timer: prev.timer - 1 };
      })
    }, 1000);
  }, [])

  const cleaTimer = useCallback(() =>{
    if (intervalId.current) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }, [])

  const handleSendOtp = useCallback(() => {
    axios.post('http://localhost:4000/api/user/forgetPassword/sendOtp',{ number: state.number })
    .then((res)=>{
      toast.success(res.data.message)
      setState((prev)=>({...prev, otp: res.data.otp, otpSent: true}))
      startTimer()
    })
    .catch((err)=>toast.error(err.response.data.message || 'Something went Wrong'))
  }, [startTimer, state.number])

  const handleOtpVerification = useCallback((data) => {
    if (parseInt(data.otp) === state.otp) {
      setState((prev)=> ({...prev, step: 3}))
      cleaTimer()
    }else{toast.error("Otp doesn't match")}
  }, [cleaTimer, state.otp])

  const handlePasswordReset = useCallback(({cnic, newPassword}) => {
    axios.post('http://localhost:4000/api/user/forgetPassword/resetPassword',{ cnic, newPassword })
    .then((res)=>{
      toast.success(res.data.message)
      navigateTo('/login')
    })
    .catch((err)=>toast.error(err.response.data.message || 'Something went Wrong'))
  }, [navigateTo])

  if (!allowed) return <div className="w-screen h-screen text-4xl flex justify-center items-center">LOADING...</div>

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-[#101820] p-6 sm:p-8 shadow-md rounded">
        {state.step === 1 && (
          <form onSubmit={handleSubmit(handleCnicSubmit)}>
            <h2 className='text-xl text-yellow-400 mb-4'><span className='text-white'>Enter </span>Your Cnic</h2>
            {/* <h2 className="text-xl font-semibold mb-4">Enter Your Cnic</h2> */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-yellow-400">Cnic</label>
              <input type="text" {...register('cnic')}
                className="w-full border border-yellow-400 bg-transparent rounded px-3 py-2 text-white/90 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-[#101820] py-2 rounded hover:bg-yellow-600"
            >
              Submit
            </button>
          </form>
        )}

        {state.step === 2 && (
          <form onSubmit={handleSubmit(handleOtpVerification)}>
            {/* <h2 className="text-xl font-semibold mb-4">Verify OTP</h2> */}
            <h2 className='text-xl text-yellow-400 mb-4'><span className='text-white'>Verify </span>OTP</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-yellow-400">OTP will be sent to:</label>
              <div className="flex items-center gap-x-2">
                <input type="text" disabled value={state.number.replace(state.number.slice(4,9),'*****')}
                  className="w-1/2 border border-yellow-400 bg-transparent text-white/90 rounded px-3 py-2"/>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="flex-1 text-white/85 border hover:text-yellow-400 disabled:text-white/85 py-2 rounded"
                  disabled={state.otpSent && state.timer > 0}
                  >
                  {state.otpSent && state.timer >= 0 ? `Resend OTP ${state.timer > 0? `in ${state.timer}s`:''}` : 'Send OTP'}
                </button>
              </div>
              {/* <p className="text-sm">OTP will be sent to: <span className="font-medium">{number}</span></p> */}
            </div>

            {state.otpSent && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-yellow-400">Enter OTP</label>
                <input
                  type="text"
                  {...register('otp')}
                  className="w-full border border-yellow-400 bg-transparent rounded px-3 py-2 text-white/90 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-500 text-[#101820] py-2 rounded hover:bg-yellow-600"
              disabled={!state.otpSent}
            >
              Verify OTP
            </button>
          </form>
        )}

        {state.step === 3 && (
          <form onSubmit={handleSubmit(handlePasswordReset)}>
            <h2 className='text-xl text-yellow-400 mb-4'><span className='text-white'>Set New </span>Password</h2>
            {/* <h2 className="text-xl font-semibold mb-4">Set New Password</h2> */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-yellow-400">New Password</label>
              <input
                type="password"
                {...register('newPassword')}
                className="w-full border border-yellow-400 bg-transparent rounded px-3 py-2 text-white/90 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-yellow-400">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full border border-yellow-400 bg-transparent rounded px-3 py-2 text-white/90 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-[#101820] py-2 rounded hover:bg-yellow-600"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgetPassword
