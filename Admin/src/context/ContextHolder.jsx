import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Context = createContext();

export default function ContextHolder (props) {

    const [isAuthorized, setIsAuthorized] = useState(document.cookie.includes('checkToken'))
    const [loading, setLoading] = useState(document.cookie.includes('checkToken'))
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:4000/api/user/getuser', { withCredentials: true })
                setUser(response.data.user)
                setIsAuthorized(response.data.user.role==='admin'?true:false)
            } catch (error) {
                toast.error(error.message)
                setIsAuthorized(false)
            } finally {
            setLoading(false)
          }
        }
        if (document.cookie.includes('checkToken')) {
          fetchUser()
        }
      }, [document.cookie.includes('checkToken')])

return (
    <Context.Provider value={{isAuthorized, setIsAuthorized, user, setUser, loading, setLoading }}>
        {props.children}
    </Context.Provider>
)
}


export const useGlobal = () => React.useContext(Context)