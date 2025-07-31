import { BiTimer } from 'react-icons/bi';
import { GiSpeedometer } from 'react-icons/gi';
import { FaHandHoldingDollar, FaUserCheck, FaUsers, FaUserShield } from 'react-icons/fa6';

export const chooseUsCard = [
    {
        icon: <BiTimer className='icon text-3xl text-black p-1 duration-300' />,
        text: 'homePage.whyChooseUs.reason1'
    },
    {
        icon: <FaUserShield className='text-3xl text-black p-1' />,
        text: 'homePage.whyChooseUs.reason2'
    },
    {
        icon: <GiSpeedometer className='text-3xl text-black p-1' />,
        text: 'homePage.whyChooseUs.reason3'
    },
    {
        icon: <FaHandHoldingDollar className='text-3xl text-black p-1' />,
        text: 'homePage.whyChooseUs.reason4'
    },
    {  
        icon: <FaUserCheck className='text-3xl text-black p-1' />,
        text: 'homePage.whyChooseUs.reason5'
    },
    {
        icon: <FaUsers className='text-3xl text-black p-1' />,
        text: 'homePage.whyChooseUs.reason6'
    },
]