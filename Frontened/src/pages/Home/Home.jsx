import { useCallback, useEffect, useState } from 'react'
import h4Image from '../../images/h4.jpg'
import ServiceCard from '../../components/Services/ServiceCard'
import { chooseUsCard } from '../../data/chooseUs'
import { mainCategories } from '../../data/serviceMainCategories'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../context/ContextHolder'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SkeletonTheme } from 'react-loading-skeleton'
import HomeLoader from '../../components/Loaders/HomeLoader'
import { useTranslation } from 'react-i18next'
import UrduFont from '../../components/utills/UrduFont'


function Home() {
  
  const { handleFilter, role, loading, setLoading } = useGlobal()
  const { t, i18n } = useTranslation()  
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [posts, setPosts] = useState({services: [], filterServices: []})
  const [city, setCity] = useState(null)

  useEffect(() => {
    const getAllPosts = async ()=>{
      await axios.get('https://labourease-production.up.railway.app/api/work/getAll')
      .then((res)=> {
        setPosts({services: res.data.services, filterServices: res.data.services})
      })
      .catch((err)=>toast.error(err.message))
    } 
    // scrollTo(0,0)
    getAllPosts()
  }, [])

  useEffect(() => {
    if (loading) setLoading(false)
  }, [loading, setLoading]);

useEffect(() => {
    if (posts?.services?.length > 0 && city != null) {
      let filtered = posts.services
      if(city) filtered = posts.services.filter(service=> service.city === city)
      setPosts((prev=> ({...prev, filterServices: filtered})))
    }
  }, [city, posts.services])

  const handleCityChange = useCallback((e)=> setCity(e.target.value), [])
  const handleLoadMore = useCallback(()=> setVisiblePosts((prev)=> prev + 6), [])

  if (loading) {
    return <SkeletonTheme highlightColor='#9ca3af' baseColor='#cbd5e1'>
              <HomeLoader role={role} page={'home'} />
            </SkeletonTheme>
  }

  return (
    <>
      <header className='w-full h-full relative'>
        <div className='h-[52svh] min-[500px]:h-[75svh] sm:h-[85svh] overflow-hidden bg-cover bg-center' style={{ backgroundImage: `url(${h4Image})`}}>
          <div className="overlay absolute top-0 left-0 right-0 bottom-0 bg-opacity-70 bg-[#162330c0]"></div>
            <div className='w-[calc(100%+25px)] h-1/4 absolute -left-2 bottom-0 rotate-2 '>
                <svg className='absolute -bottom-4 min-[400px]:-bottom-5 sm:-bottom-7 min-[954px]:-bottom-9 ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#facc15" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
            <svg className='absolute -bottom-9 min-[400px]:-bottom-10 sm:-bottom-12 min-[954px]:-bottom-14 lg:-bottom-[60px] xl:-bottom-16 min-[1615px]:-bottom-[70px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#fff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <div className="h-full w-full flex justify-center items-center max-[500px]:mt-8">
              <div className="site-heading relative text-center space-y-5">
                <h1 className="max-[400px]:text-3xl max-[400px]:px-1 text-[clamp(20px,6vw,48px)] font-semibold text-yellow-500"><UrduFont>{t('welcome')}</UrduFont></h1>
                <p className="max-[506px]:text-sm max-sm:px-2 sm:w-3/4 lg:w-2/3 mx-auto text-[clamp(18px,1.5vw,30px)] font-semibold text-gray-300"><UrduFont>{t('homePage.des')}</UrduFont></p>
              </div>
            </div>
          </div>
      </header>

      {/* Popular Service Session */}

      <section className='w-full py-8 mt-5'>
        <h1 className='text-center text-6xl text-yellow-500'>
          <span className='text-[#101820]'><UrduFont>{t('homePage.servTitP1')}</UrduFont></span> <UrduFont>{t('homePage.servTitP2')}</UrduFont>
        </h1>
        <div className='w-full flex justify-start px-8 py-8 mt-10'>
          <select onChange={handleCityChange} className='w-3/4 sm:w-1/2 lg:w-1/3 border border-[#101820] rounded-md p-2'>
            <option value=''>Choose a city</option>
            <option value='hyderabad'>Hyderabad</option>
            <option value='latifabad'>Latifabad</option>
            <option value='paretabad'>Paretabad</option>
          </select>
        </div>

        {/* Popular service Cards */}

        <div className="max-w-7xl mx-auto px-3 mb-14 max-sm:overflow-auto max-sm:max-h-[500px]">
          <div className='grid gap-y-2 gap-x-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
            {/* Cards */}
            {posts?.filterServices?.length > 0 ?
              posts.filterServices.slice(0, visiblePosts).map((post, key)=>{
                  return(
                      <ServiceCard key={key} id={post._id} image={post.image} title={post.title} desc={post.description} ratings={post.ratings} startTime={post.startTime} endTime={post.endTime} price={post.fixedSalary || null} priceFrom={post.salaryFrom || null}  priceTo={post.salaryTo || null} />
                  )
              })
              :
              <div className='w-full col-span-4 text-center mt-8'>
                  <h2 className='text-4xl font-mono'><UrduFont>{t('homePage.noData')}</UrduFont></h2>
              </div>
            }
          </div>
        </div>
        {visiblePosts < posts?.filterServices?.length &&
          <div className='text-center'>
              <button onClick={handleLoadMore}
                className='bg-yellow-400 px-3 py-2 rounded-md hover:bg-yellow-600 active:bg-yellow-400'>
                Show more
              </button>
          </div>
        }
      </section>


      {/* Our Services categories */}

      <section className='service_categories mb-6 mt-20 mx-auto space-y-14'>
        <h1 className='text-center text-6xl text-yellow-500'>
          <span className='text-[#101820]'><UrduFont>{t('homePage.catTitP1')}</UrduFont></span> <UrduFont>{t('homePage.catTitP2')}</UrduFont>
        </h1>
        <div className='max-sm:max-w-md max-sm:mx-auto sm:w-full grid sm:grid-cols-2 min-[845px]:grid-cols-3 gap-3 select-none px-6 sm:px-6'>
          {mainCategories.map((item) => {
            return (
              <Link key={item.title} to={'/service/subCategories'} onClick={() => handleFilter(item.path)}
                  className='main_category_card text-center bg-[#101820] h-64 lg:h-72 pb-10 pt-14 px-4 hover:pt-10 overflow-hidden rounded-2xl'>
                  {item.icon}
                  <h2 className='text-white border-b border-b-yellow-400 pb-2 w-full mt-5 text-base lg:text-xl uppercase font-bold'><UrduFont>{t(item.title)}</UrduFont></h2>
                  <p className='mt-3 hidden font-semibold text-sm'>{t(item.desc)}</p>
              </Link>
            )
          })}
        </div>
      </section >


      {/* Why Choose Us */}

      <section className='choose_Us_section bg-[#101820] mb-16 mt-36 py-12 px-10 min-[550px]:px-14 lg:px-24 mx-auto space-y-14'>
        <div className='flex flex-col items-start gap-y-10'>
          <div className='w-full flex flex-col' style={i18n.language === 'ur'? {alignItems: 'end', textAlign:'right'}:{}}>
            <h1 className='text-4xl sm:text-5xl text-yellow-400 mb-6'>
              <span className='text-white'><UrduFont>{t('homePage.whyChooseUs.titleP1')}</UrduFont></span><UrduFont> {t('homePage.whyChooseUs.titleP2')}</UrduFont>
            </h1>
            <p className='w-full md:w-2/3 text-sm sm:text-base leading-snug text-white'>
              <UrduFont>{t('homePage.whyChooseUs.desc')}</UrduFont>
            </p>
          </div>
          <div className='w-full grid min-[550px]:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 select-none'>
            {chooseUsCard.map((item, i) => {
              return (
                <div key={i} className='card flex justify-start items-center gap-x-4 border border-yellow-400 p-3 min-[550px]:p-5 rounded-tl-3xl rounded-br-3xl duration-300 text-sm lg:text-base' style={{flexDirection: i18n.language === 'ur'?'row-reverse':''}}> 
                  <div className='p-2 bg-yellow-400 rounded-full' >{item.icon}</div>
                  <h4 className=' text-white tracking-widest' style={{textAlign: i18n.language === 'ur'?'right':''}}>
                    <UrduFont>{t(item.text)}</UrduFont>
                  </h4>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
