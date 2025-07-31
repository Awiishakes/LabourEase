import { useGlobal } from '../../context/ContextHolder'
import { Navigate } from 'react-router-dom'

const HomeRedirect = () => {

    const { role, isAuthorized} = useGlobal()
    
    if ( role === 'worker') {
        return <Navigate to='worker/dashboard' replace />
    }else if (role==='client' && isAuthorized) {
        return <Navigate to='home' replace />
    }else if(!isAuthorized){
        return <Navigate to='home' replace />
    }else if(isAuthorized && !['client','visitor','worker'].includes(role)){
        return <Navigate to='login' replace />
    }

}

export default HomeRedirect
