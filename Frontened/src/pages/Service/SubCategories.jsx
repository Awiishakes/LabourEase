import { useCallback, useEffect, useState } from 'react'
import { singleCategorie } from '../../data/serviceMainCategories'
import { useGlobal } from '../../context/ContextHolder'
import axios from 'axios'
import toast from 'react-hot-toast'
import CategoryCard from '../../components/Services/categoryCard'
import ServiceCard from '../../components/Services/ServiceCard'
import { useTranslation } from 'react-i18next'
import UrduFont from '../../components/utills/UrduFont'


const SubCategories = () => {

    const { filter, setFilter } = useGlobal()
    const { t } = useTranslation()
    const [visiblePosts, setVisiblePosts] = useState(6)
    const [posts, setPosts] = useState([])
    const [show, setShow] = useState(false)
    
    useEffect(() => {
        setFilter({type:localStorage.getItem('type')})
    }, [setFilter]);

    const filterData = singleCategorie.filter((item) => item.category === filter.type)
    const getAllPosts = useCallback(async ()=>{
        await axios.get('http://localhost:4000/api/work/getAll')
        .then((res)=> setPosts(res.data.services))
        .catch((err)=>toast.error(err.response?.data.message || err.message))
    }, [])
    
    useEffect(() => {
        getAllPosts()
        setShow(false)
    }, [filter, getAllPosts]);
    
    
    const handleFilter = useCallback((category) =>{
        setPosts(posts=> posts.filter(post=> post.category === category))
        setShow(true)
    }, [])

    const handleLoadMore = useCallback(()=> setVisiblePosts((prev)=> prev + 6), [])

    return (
        <div className='w-full'>
            {!show?
                <div className='grid gap-3 min-[500px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4'>
                    {filterData.length !== 0 ?
                            filterData.map((item, key) => {
                            return(
                            <CategoryCard key={key} category={item} handleFilter={handleFilter} />
                        )})
                    :
                        <div className='absolute w-full text-center mt-8'>
                            <h2 className='text-4xl font-mono'><UrduFont>{t('servicePage.noService')}</UrduFont></h2>
                        </div>
                    }
                </div>
                :
                posts.length !== 0 ?
                <div className='space-y-10'>
                    <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                        {posts.slice(0, visiblePosts).map((post, key)=>{
                            return(
                                <ServiceCard key={key} id={post._id} image={post.image} title={post.title} desc={post.description} ratings={post.ratings} startTime={post.startTime} endTime={post.endTime} price={post.fixedSalary || null} priceFrom={post.salaryFrom || null}  priceTo={post.salaryTo || null} />
                            )})
                        }
                    </div>
                    {visiblePosts < posts.length &&
                        <div className='text-center'>
                            <button onClick={handleLoadMore}
                            className='bg-yellow-400 px-3 py-2 rounded-md hover:bg-yellow-600 active:bg-yellow-400'>
                            Show more
                            </button>
                        </div>
                    }
                </div>
                :
                <div className='absolute w-full text-center left-0 right-0 px-3'>
                    <h2 className='text-4xl font-mono'><UrduFont>{t('servicePage.noService')}</UrduFont></h2>
                </div>
            }
        </div>
    )
}

export default SubCategories
