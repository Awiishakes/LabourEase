import { BsCarFront, BsTools } from 'react-icons/bs'
import { GiLipstick } from 'react-icons/gi'
import ac from '../assets/ac mechanic.jpg'
import car from '../assets/car mechanic 2.jpg'
import electrician from '../assets/electrician vector.jpg'
import maid from '../assets/maid vector .jpg'
import painter from '../assets/painter vector .jpg'
import plumber from '../assets/plumber vector.jpg'

export const mainCategories = [
    {
        icon: <BsTools className='icon text-yellow-400 text-6xl lg:text-7xl pb-2 mx-auto' />,
        title: 'mainCategory.cat1',
        path: 'dailyServices',
        desc: 'mainCategory.cat1Des'
    },
    {
        icon: <BsCarFront className='icon text-yellow-400 text-6xl lg:text-7xl pb-2 mx-auto' />,
        title: 'mainCategory.cat2',
        path: 'vehicleServices',
        desc: 'mainCategory.cat2Des'
    },
    {
        icon: <GiLipstick className='icon text-yellow-400 text-6xl lg:text-7xl pb-2 mx-auto' />,
        title: 'mainCategory.cat3',
        path: 'beautyServices',
        desc: 'mainCategory.cat3Des'
    }
]



export const singleCategorie = [
    {
        img: <img src={ac} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Ac Mechanic',
        category: 'dailyServices',
        path: 'acMechanic'
    },
    {
        img: <img src={car} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Car Mechanic',
        category: 'vehicleServices'
    },
    {
        img: <img src={electrician} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Electrician',
        category: 'dailyServices'
    },
    {
        img: <img src={painter} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Painter',
        category: 'dailyServices'
    },
    {
        img: <img src={maid} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Maid Service',
        category: 'dailyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Plumber',
        category: 'dailyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Carpenter',
        category: 'dailyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Hair dresser',
        category: 'beautyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Beautician',
        category: 'beautyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Masseuse',
        category: 'beautyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Makeup Artist',
        category: 'beautyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'Nail care',
        category: 'beautyServices'
    },
    {
        img: <img src={plumber} alt="Ac Mechanic" className='w-full h-full object-fill object-center' />,
        title: 'bike Mechanic',
        category: 'vehicleServices'
    },

]
