import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axios from "axios";
import { mainCategories, singleCategorie } from "../../data/serviceMainCategories";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { ServiceValidationSchema } from "../../validations";
import FormSubmitLoader from "../Loaders/FormSubmitLoader";
import { useTranslation } from "react-i18next";
import UrduFont from "../utills/UrduFont";

const AddService = () => {

    const { t } = useTranslation()
    const validations = ServiceValidationSchema()
    
    // React Hook Form
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: yupResolver(validations),
        defaultValues: { title: "", description: "", category: "", subcategory: "", salaryType: "fixed", fixedSalary: null, salaryFrom: null, salaryTo: null, image: null,}});

    const salaryType = watch("salaryType");
    const categoryType = watch("category");

    const postService = async (data) => {

        const formData = new FormData();

        if (salaryType === 'fixed') {
            formData.append('fixedSalary', data.fixedSalary);
        }else{
            formData.append('salaryFrom', data.salaryFrom);
            formData.append('salaryTo', data.salaryTo);
        }

        // Append all fields to FormData
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('city', data.city);
        formData.append('subcategory', data.subcategory);
        formData.append('startTime', data.startTime,);
        formData.append('endTime', data.endTime);
        formData.append('image', data.image);
        
        await axios.post('https://labourease-production.up.railway.app/api/work/postService', formData,
        {
            withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}, 
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((res)=>{
            toast.success(res.data.message)
            reset()
        })
        .catch ((error)=>toast.error(error.response.data.message))
    };

            
    return (
        <div className="min-h-screen flex flex-col items-start gap-y-5">
            <div className="w-full flex justify-between items-center">
                <h2 className='text-3xl sm:text-4xl text-yellow-500'>
                    <span className='text-black'><UrduFont>{t('newService.newTitleP1')}</UrduFont></span> <UrduFont>{t('newService.newTitleP2')}</UrduFont>
                </h2> 
                <Link to={'/worker/myServices'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
                    <BiArrowBack />
                </Link>
            </div>
            <form
            className="bg-[#101820] relative shadow-lg rounded-lg p-6 w-full max-w-full"
            onSubmit={handleSubmit(postService)}
            >
            {isSubmitting && <FormSubmitLoader text={'Submitting'} />}
            <div className='flex max-md:flex-col gap-x-3 mb-4'>
                {/* Title */}   
                <Input name={'title'} type={'text'} register={register} errors={errors.title} />

                {/* City */}   
                <div className="flex-1">
                    <label className="block text-yellow-400 mb-1"><UrduFont>{t('fields.city')}</UrduFont></label>
                    <select
                    {...register("city")}
                    className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.city ? "border-red-500" : "border-yellow-500"}`}
                    >
                        <option className="text-[#101820]" value="">{t('servicePage.search.city')}</option>
                        <option className="text-[#101820]" value="hyderabad">Hyderabad</option>
                        <option className="text-[#101820]" value="latifabad">Latifabad</option>
                        <option className="text-[#101820]" value="paretabad">Paretabad</option>
                    </select>
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>
            </div>

            <div className='flex max-md:flex-col gap-x-3'>
                {/* Category */}
                <div className="mb-4 flex-1">
                    <label className="block text-yellow-400 mb-1"><UrduFont>{t('fields.category')}</UrduFont></label>
                    <select
                    {...register("category")}
                    className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.category ? "border-red-500" : "border-yellow-500"}`}
                    >
                        <option className="text-[#101820]" value="">{t('servicePage.search.category')}</option>
                        {mainCategories.map((category, key)=> 
                            <option key={key} className="text-[#101820]" value={category.path}>{t(category.title)}</option>
                        )}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                {/* Sub Category */}
                <div className="mb-4 flex-1">
                    <label className="block text-yellow-400 mb-1"><UrduFont>{t('fields.subcategory')}</UrduFont></label>
                    <select
                    {...register("subcategory")}
                    className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.subcategory ? "border-red-500" : "border-yellow-500"}`}
                    >
                    <option value="">{t('servicePage.search.subCategory')}</option>
                    {singleCategorie.filter(item=> item.category === categoryType).map((category, key)=>
                        <option key={key} className="text-[#101820]" value={category.title}>{category.title}</option>
                    )}
                    </select>
                    {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory.message}</p>}
                </div>
            </div>

            <div className="mb-4">
                {/* Available Time */}
                <label className="block text-yellow-400 mb-1"><UrduFont>{t('newService.availableTime')}</UrduFont></label>
                <div className="flex space-x-4">
                    {/* Start Time */}
                    <Input name={'startTime'} type={'time'} register={register} errors={errors.startTime} />
                    {/* End Time */}
                    <Input name={'endTime'} type={'time'} register={register} errors={errors.endTime} />
                </div>
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-yellow-400 mb-1"><UrduFont>{t('fields.description')}</UrduFont></label>
                <textarea
                {...register("description")}
                rows="4"
                className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.description ? "border-red-500" : "border-yellow-500"}`}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Image */}
            <div className="mb-4 flex-1">
                <label className="block text-yellow-400 mb-1"><UrduFont>{t('fields.image')}</UrduFont></label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setValue("image", e.target.files[0])}
                    className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.image ? "border-red-500" : "border-yellow-500"}`}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>

            {/* Price */}
            <div className="mb-4">
                {/* Salary Type */}
                <div>
                    <label className="block text-yellow-400 mb-1"><UrduFont>{t('newService.salaryType')}</UrduFont></label>
                    <div className="flex space-x-4">
                        <label className="flex items-center text-white">
                        <input
                            type="radio"
                            value="fixed"
                            {...register("salaryType")}
                            className="mr-2"
                        />
                        <UrduFont>{t('fields.fixedSalary')}</UrduFont>
                        </label>
                        <label className="flex items-center text-white">
                        <input
                            type="radio"
                            value="range"
                            {...register("salaryType")}
                            className="mr-2"
                        />
                        <UrduFont>{t('newService.rangeSalary')}</UrduFont>
                        </label>
                    </div>
                    {errors.salaryType && <p className="text-red-500 text-sm">{errors.salaryType.message}</p>}
                </div>

                {/* Fixed Salary */}
                {salaryType === "fixed" && (
                    <Input name={'fixedSalary'} type={'number'} register={register} errors={errors.fixedSalary} />
                )}

                {/* Salary Range */}
                {salaryType === "range" && (
                <div className="flex gap-x-4">
                    <Input name={'salaryFrom'} type={'number'} register={register} errors={errors.salaryFrom} />
                    <Input name={'salaryTo'} type={'number'} register={register} errors={errors.salaryTo} />
                </div>
                )}
            </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-max text-white hover:text-[#101820] px-3 py-2 rounded-md border-[1.5px] focus:outline-none border-yellow-400 btn relative overflow-hidden z-[1] transition"
                >
                    <UrduFont>{t('newService.submit')}</UrduFont>
                </button>
            </form>
        </div>
    )
}

export default AddService


const Input = ({name, type, register, errors}) =>{
    const { t } = useTranslation()
    return(
        <div className="mb- flex-1">
            <label className="block text-yellow-400 mb-1 capitalize"><UrduFont>{t("fields."+name)}</UrduFont></label>
            <input
                type={type} {...register(name)}
                className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors ? "border-red-500" : "border-yellow-500"}`}
            />
            {errors && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>
    )
}