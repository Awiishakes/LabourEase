import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEye, FaEyeSlash } from 'react-icons/fa'


const Input = ({ type, name, Icon, register, errors }) => {

    const [focus, setFocus] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { t } = useTranslation()

    return (
        <div className=''>
            <div className={`input-div grid grid-cols-[7%,93%] mt-4 mb-1 py-1 border-b-2 ${focus && 'focus'} ${errors ? 'border-b-red-500' : 'border-b-[#d9d9d9]'} relative duration-300`}>
                {<div className='flex justify-center items-center'>
                    <Icon className='icon text-[#d9d9d9] duration-300' />
                </div>}
                <div className='relative h-11'>
                    <h5 className='absolute z-[1] left-[10px] top-1/2 -translate-y-1/2 text-[#999] text:md lg:text-lg capitalize pointer-events-none duration-300 '>{t('fields.'+name)}</h5>
                    <input
                        {...register(name)}
                        onFocus={() => setFocus(true)}
                        onBlur={(e) => e.target.value === '' && setFocus(false)}
                        type={type === 'password' ? showPassword ? 'text' : 'password' : type} 
                        name={name}
                        autoComplete={type === 'password' ? 'current-password' : ' '}
                        className='absolute w-full h-full top-0 left-0 border-none outline-none bg-transparent py-2 px-[0.7rem] text-[1.2rem] text-[#555] remove-input-arrows'
                    />
                    {type === 'password' &&
                        <div className='absolute right-0 bottom-0 w-5 mr-2 my-3 cursor-pointer' onClick={() => register('password') && setShowPassword(!showPassword)}>
                            {showPassword ?
                                <FaEyeSlash className='text-lg text-[#aaa] hover:text-yellow-500 duration-500 cursor-pointer' />
                                :
                                <FaEye className='text-lg text-[#aaa] hover:text-yellow-500 duration-500 cursor-pointer' />
                            }
                        </div>
                    }
                </div>
            </div>
            <p className={`text-red-500 text-sm ${errors ? 'opacity-100' : 'opacity-0'} duration-700`}>{errors?.message}</p>
        </div>
    )
}

export default Input
