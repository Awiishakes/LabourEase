import logo from '../../images/labourEase.png'
import { BiLogoFacebook, BiLogoInstagram, BiLogoTwitter, BiLogoYoutube } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UrduFont from '../utills/UrduFont'

function Footer() {

  const { t, i18n } = useTranslation()

  return (
    <div className='footer w-full flex flex-col justify-center gap-y-5 bg-[#101820] px-5 lg:px-10 pt-10 pb-5'>
      <div className='w-full grid sm:grid-cols-3 md:grid-cols-5 max-md:gap-y-8 lg:px-10 md:px-7 px-5 py-10'>
        <div className='col-span-2 sm:col-span-3 md:col-span-2 p-2 w-11/12'>
          <img src={logo} alt="" className='w-36 mb-1' />
          <p className='text-white/80 text-xs md:text-sm'>Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim.</p>
          <div className='text-yellow-400 flex justify-start items-center gap-x-3 mt-6'>
            <a className='p-2 md:p-3 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-[#101820] hover:-translate-y-1 duration-500'><BiLogoFacebook className='text-lg'/></a>
            <a className='p-2 md:p-3 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-[#101820] hover:-translate-y-1 duration-500'><BiLogoInstagram className='text-lg'/></a>
            <a className='p-2 md:p-3 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-[#101820] hover:-translate-y-1 duration-500'><BiLogoYoutube className='text-lg'/></a>
            <a className='p-2 md:p-3 border border-yellow-400 rounded-full hover:bg-yellow-400 hover:text-[#101820] hover:-translate-y-1 duration-500'><BiLogoTwitter className='text-lg'/></a>
          </div>
        </div>
        <div className='links p-2 text-sm'>
          <h5 className='tracking-widest text-yellow-400 font-semibold' style={{textAlign: i18n.language === 'ur'?'right':''}}>
            <UrduFont>{t('footer.col1')}</UrduFont>
          </h5>
          <div className='text-white flex flex-col gap-y-3 mt-8' style={{alignItems: i18n.language === 'ur'?'end':''}}>
            {Array(3).fill(0).map((_,i)=><Link key={i}><UrduFont>{t('footer.city'+(i+1))}</UrduFont></Link>)}
          </div>
        </div>
        <div className='links p-2 text-sm'>
          <h5 className='tracking-widest text-yellow-400 font-semibold' style={{textAlign: i18n.language === 'ur'?'right':''}}>
            <UrduFont>{t('footer.col2')}</UrduFont>
          </h5>
          <div className='text-white flex flex-col gap-y-3 mt-8' style={{alignItems: i18n.language === 'ur'?'end':''}}>
            {Array(3).fill(0).map((_,i)=><Link key={i}><UrduFont>{t('footer.serv'+(i+1))}</UrduFont></Link>)}
          </div>
        </div>
        <div className={`links p-2 text-sm ${i18n.language==='ur'&&'max-sm:col-span-2'}`}>
          <h5 className='tracking-widest text-yellow-400 font-semibold' style={{textAlign: i18n.language === 'ur'?'right':''}}>
            <UrduFont>{t('footer.col3')}</UrduFont>
          </h5>
          <div className='text-white flex flex-col gap-y-3 mt-8' style={{alignItems: i18n.language === 'ur'?'end':''}}>
            {Array(4).fill(0).map((_,i)=><Link key={i}><UrduFont>{t('footer.help'+(i+1))}</UrduFont></Link>)}
          </div>
        </div>
      </div>
      <div className='text-xs sm:text-sm text-white text-center'>
        &copy; {new Date().getFullYear()} LabourEase &nbsp; &nbsp; All rights reserved by Awais and only Awais not Hassan or Asim
      </div>
    </div>
  )
}

export default Footer
