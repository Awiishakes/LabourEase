import React from 'react'
import { BsArrowRight } from 'react-icons/bs'


const CategoryCard = ({category, handleFilter}) => {
    return (
        <div onClick={()=>handleFilter(category.title)} className='single_category_card w-full h-[350px] p-3 flex flex-col justify-center items-center border-2 rounded-2xl hover:border-[#101820] duration-500 cursor-pointer'>
            <div className='w-full h-4/5'>
                {category.img}
            </div>
            <div className='w-full h-1/4 flex justify-around items-center'>
                <h2 className='text-[#101820] text-lg uppercase font-bold'>{category.title}</h2>
                <span className='duration-500'><BsArrowRight className='text-xl' /></span>
            </div>
        </div>
    )
}

export default CategoryCard
