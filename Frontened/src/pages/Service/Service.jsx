import { useCallback, useEffect, useState } from 'react'
import { mainCategories, singleCategorie } from '../../data/serviceMainCategories'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useGlobal } from '../../context/ContextHolder'
import { SkeletonTheme } from 'react-loading-skeleton'
import HomeLoader from '../../components/Loaders/HomeLoader'
import toast from 'react-hot-toast'
import axios from 'axios'
import ServiceCard from '../../components/Services/ServiceCard'
import { useTranslation } from 'react-i18next'
import UrduFont from '../../components/utills/UrduFont'


const Service = () => {

    const pathname = useLocation().pathname
    const { handleFilter, role, loading } = useGlobal()
    const { t } = useTranslation()
    const navigateTo = useNavigate()
    const show = useCallback((path) => pathname === path ,[pathname])
    const [issearched, setIsSearched] = useState(false)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState({city:'', mainCategory:'', subCategory:''})
    const [posts, setPosts] = useState({results: [], filterResults: []})
    const [visiblePosts, setVisiblePosts] = useState(6)

    const handleSearch = useCallback(async () => {
        if (search.length > 0) {
            scrollTo(0,180)
            !show('/service') && navigateTo('/service')
            setIsSearched(true)
    
            axios.get(`http://localhost:4000/api/work/services?search=${search}`)
            .then((res)=>{
                setPosts({results: res.data.services, filterResults: res.data.services})
            })
            .catch((err)=>toast.error(err.message || 'Error fetching searching Results'))
        }
    }, [navigateTo, search, show])
    

    const handleFilterChange = useCallback((field, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    }, [])
    const clearFilters = useCallback(() => {
        setFilters({city:'', mainCategory:'', subCategory: ''});
    }, [])
    
    useEffect(() => {
        if (posts.results.length > 0) {
            let filtered = posts.results
            if (filters.city) filtered = filtered.filter(service=> service.city === filters.city)
            if (filters.subCategory) filtered = filtered.filter(service=> service.category === filters.subCategory)
            setPosts((prev)=>({...prev, filterResults: filtered}))
        }
    }, [filters.city, filters.subCategory, posts.results]);

    const handleLoadMore = useCallback(()=> setVisiblePosts((prev)=> prev + 6), [])

    if (loading) {
        return <SkeletonTheme highlightColor='#9ca3af' baseColor='#cbd5e1'>
                  <HomeLoader role={role} page={'service'} />
                </SkeletonTheme>
    }

    return (
        <>
            <header className='w-full h-[65svh] min-[500px]:h-[80svh] lg:h-[85svh] relative'>
                <div className='w-full h-full bg-[#101820] mb-4 overflow-hidden'>
                    <div className='w-[calc(100%+25px)] h-1/4 absolute -left-2 bottom-0 rotate-1'>
                        <svg className='absolute bottom-2 min-[692px]:-bottom-5 min-[836px]:-bottom-7 lg:-bottom-9' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#facc15" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                    <svg className='w-[calc(100%+25px)] absolute -bottom-3 min-[692px]:-bottom-10 min-[836px]:-bottom-12 lg:-bottom-14' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#fff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,133.3C672,149,768,235,864,240C960,245,1056,171,1152,160C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </header>

            <section className='absolute top-[16%] min-[500px]:top-1/4 left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center gap-y-8 sm:gap-y-12'>
                <h1 className='text-[clamp(30px,7vw,58px)] text-yellow-500 text-center'><span className='text-white'><UrduFont>{t('servicePage.header.p1')}</UrduFont></span> <UrduFont>{t('servicePage.header.p2')}</UrduFont></h1>
                <div className='w-full px-4'>
                    <div className='flex max-sm:flex-col gap-y-4 justify-center sm:items-center gap-x-4 px-3 lg:px-20'>
                        <input type="search" onChange={(e)=>setSearch(e.target.value)}  placeholder='Find service of your choice'
                            className='px-2 py-3 sm:w-2/3 md:w-7/12 lg:w-[55%] text-sm border-2 border-yellow-400 outline-none rounded-lg' />
                        <button onClick={handleSearch} className='max-sm:w-1/3 max-sm:mx-auto bg-yellow-400 px-4 md:px-10 py-2'>search</button>
                    </div>
                </div>
            </section>

            {issearched?
                <section className='w-full max-sm:px-3 my-14 flex flex-col items-center gap-y-4'>
                    <div className='w-full sm:w-11/12 flex justify-between items-end'>
                        <h1 className='text-lg min-[350px]:text-2xl min-[450px]:text-3xl text-yellow-500'>
                            <span className='text-[#101820]'><UrduFont>{t('servicePage.search.filterP1')}</UrduFont></span> <UrduFont>{t('servicePage.search.filterP2')}</UrduFont>
                        </h1>
                        <div className='flex gap-x-1 min-[350px]:gap-x-2'>
                            <button onClick={()=>setIsSearched(false)} className='py-1 px-2 sm:px-3 max-sm:text-xs bg-yellow-400 rounded-md hover:bg-yellow-500 active:bg-yellow-400'><UrduFont>{t('servicePage.search.back')}</UrduFont></button>
                            <button onClick={clearFilters} className='py-1 px-2 sm:px-3 max-sm:text-xs bg-yellow-400 rounded-md hover:bg-yellow-500 active:bg-yellow-400'><UrduFont>{t('servicePage.search.clear')}</UrduFont></button>
                        </div>
                    </div>
                    <div className='w-full sm:w-11/12 grid grid-cols-2 min-[440px]:grid-cols-3 gap-2'>
                        <select value={filters.city} onChange={(e)=>handleFilterChange('city',e.target.value)} className='px-2 py-3 max-[440px]:col-span-2 bg-[#101820] text-white rounded-md max-sm:text-xs'>
                            <option value=''>{t('servicePage.search.city')}</option>
                            <option value='hyderabad'>{t('footer.city1')}</option>
                            <option value='latifabad'>{t('footer.city2')}</option>
                            <option value='paretabad'>{t('footer.city3')}</option>
                        </select>
                        <select value={filters.mainCategory} onChange={(e)=> handleFilterChange('mainCategory',e.target.value)} className='px-2 py-3 bg-[#101820] text-white rounded-md  max-sm:text-xs'>
                            <option value=''>{t('servicePage.search.category')}</option>
                            {mainCategories.map((category)=> 
                                <option key={category.path} value={category.path}>{t(category.title)}</option>
                            )}
                        </select>
                        <select value={filters.subCategory} onChange={(e)=>handleFilterChange('subCategory',e.target.value)} className='px-2 py-3 bg-[#101820] text-white rounded-md max-sm:text-xs'>
                            <option value=''>{t('servicePage.search.subCategory')}</option>
                            {singleCategorie.filter(val=>val.category=== filters.mainCategory).map((category)=> 
                                <option key={category.title} value={category.title}>{category.title}</option>
                            )}
                        </select>
                    </div>

                    {posts.filterResults.length > 0?
                        <div className='space-y-10'>
                            <div className='sm:px-5 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-10'>
                                {posts.filterResults.slice(0, visiblePosts).map((service, key)=>
                                    <ServiceCard key={key} id={service._id} image={service.image} title={service.title} desc={service.description} startTime={service.startTime} endTime={service.endTime} price={service.fixedSalary || null} priceFrom={service.salaryFrom || null}  priceTo={service.salaryTo || null} />
                                )}
                            </div>
                            {visiblePosts < posts.filterResults.length &&
                                <div className='text-center'>
                                    <button onClick={handleLoadMore}
                                        className='bg-yellow-400 px-3 py-2 rounded-md hover:bg-yellow-600 active:bg-yellow-400'>
                                        Show more
                                    </button>
                                </div>
                            }
                        </div>
                        :
                        <div className='text-3xl text-center mt-12' >
                            <UrduFont>{t('servicePage.noService')}</UrduFont>
                        </div>
                    }
                </section>
            :
                <section className='mt-10 mb-28 px-5 xl:px-20'>
                    <h1 className='text-center text-[clamp(30px,7vw,58px)] text-yellow-500 mb-10'>
                        <span className='text-[#101820]'><UrduFont>{t('servicePage.body.p1')}</UrduFont></span> <UrduFont>{t('servicePage.body.p2')}</UrduFont>
                    </h1>
                    <div className='w-full flex justify-start items-center mb-8 gap-x-1 sm:gap-x-3'>
                        {mainCategories.map((category,key)=>
                            <span key={key} onClick={()=>handleFilter(category.path)} className={` ${show('/service')&& 'hidden'} py-2 px-2 sm:px-4 border-[1.4px] border-yellow-400 hover:bg-yellow-400 text-[#101820] font-medium rounded-3xl text-[clamp(8.5px,1.2vw,40px)] cursor-pointer duration-200`}>{t(category.title)}</span>
                        )}
                    </div>

                    <div className={`service_categories w-full ${!show('/service')&& 'hidden'} grid min-[536px]:grid-cols-2 min-[840px]:grid-cols-3 gap-3`}>
                        {mainCategories.map((item,key) => {
                            return (
                                <Link key={key} to={'subCategories'} onClick={() => handleFilter(item.path)}
                                    className='main_category_card text-center bg-[#101820] h-64 lg:h-72 py-10 px-4 overflow-hidden rounded-2xl'>
                                    {item.icon}
                                    <h2 className='text-white border-b border-b-yellow-400 pb-2 w-full mt-5 text-base lg:text-xl uppercase font-bold'><UrduFont>{t(item.title)}</UrduFont></h2>
                                    <p className='mt-3 hidden font-semibold text-sm'>{t(item.desc)}</p>
                                </Link>
                            )
                        })}
                    </div>
                    <div>
                        <Outlet />
                    </div>

                </section>
            }
        </>
    )
}

export default Service
