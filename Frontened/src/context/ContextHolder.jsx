import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Context = createContext();

export default function ContextHolder (props) {

    // const [isAuthorized, setIsAuthorized] = useState(document.cookie.includes('checkToken'))
    // const [loading, setLoading] = useState(document.cookie.includes('checkToken') || true)
    const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('token')?.length>0)
    const [loading, setLoading] = useState(localStorage.getItem('token')?.length>0 || true)
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(localStorage.getItem('role')? ['client','worker'].includes(localStorage.getItem('role'))&& localStorage.getItem('role') : 'visitor')
    const [filter, setFilter] = useState({type:'', indicator:false})

    const handleFilter = (type) =>{
        localStorage.setItem('type',type)
        setFilter({type:type})
    }

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             setLoading(true)
    //             const response = await axios.get('https://labourease-production.up.railway.app/api/user/getuser', { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
    //             setUser(response.data.user)
    //             setIsAuthorized(['client','worker','visitor'].includes(response.data.user.role)?true:false)
    //             localStorage.setItem('role',['client','worker','visitor'].includes(response.data.user.role)? response.data.user.role : '')
    //             setRole(response.data.user.role)
    //         } catch (error) {
    //             toast.error(error.response?.data.message || error.message)
    //             if(error.response?.data.message.includes('banned')) {
    //                 localStorage.removeItem('role')
    //                 setIsAuthorized(false)
    //             }
    //         } finally {
    //         setLoading(false)
    //       }
    //     }
    //     if (document.cookie.includes('checkToken')) {
    //       fetchUser()
    //     }
    //   }, [document.cookie.includes('checkToken')])


    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                const response = await axios.get('https://labourease-production.up.railway.app/api/user/getuser', { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
                setUser(response.data.user)
                setIsAuthorized(['client','worker'].includes(response.data.user.role)?true:false)
                localStorage.setItem('role',['client','worker','visitor'].includes(response.data.user.role)? response.data.user.role : '')
                setRole(response.data.user.role)
            } catch (error) {
                toast.error(error.response?.data.message || error.message)
                if(error.response?.data.message.includes('banned')) {
                    localStorage.removeItem('role')
                    setIsAuthorized(false)
                }
            } finally {
            setLoading(false)
          }
        }
        if (localStorage.getItem('token')?.length>0) {
          fetchUser()
        }
      }, [localStorage.getItem('token')?.length>0])

return (
    <Context.Provider value={{isAuthorized, setIsAuthorized, user, setUser, filter, setFilter, handleFilter, setRole, role, loading, setLoading }}>
        {props.children}
    </Context.Provider>
)
}


export const useGlobal = () => React.useContext(Context)