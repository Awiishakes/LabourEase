import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import FormSubmitLoader from "../Loaders/FormSubmitLoader";
import { serviceValidationSchema } from "../../validations";
import { mainCategories } from "../../data/serviceMainCategories";

const NewService = () => {
    
    // React Hook Form
    const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: yupResolver(serviceValidationSchema),
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
        formData.append('subcategory', data.subcategory);
        formData.append('startTime', data.startTime,);
        formData.append('endTime', data.endTime);
        formData.append('image', data.image);

        await axios.post('http://localhost:4000/api/admin/postService', formData,
        {
            withCredentials: true, 
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
        <div className="p-4">
            <div className="min-h-screen flex flex-col items-start gap-y-5">
                <div className="w-full flex justify-between items-center">
                    <h2 className='text-3xl sm:text-4xl text-yellow-500'>
                        <span className='text-black'>Add new </span> Service
                    </h2> 
                    <Link to={'/service-management'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
                        <BiArrowBack />
                    </Link>
                </div>
                <form
                className="bg-[#101820] relative shadow-lg rounded-lg p-6 w-full max-w-full"
                onSubmit={handleSubmit(postService)}
                >
                {isSubmitting && <FormSubmitLoader />}
                <div className='flex max-md:flex-col gap-x-3 mb-4'>
                    {/* Title */}   
                    <Input name={'title'} type={'text'} register={register} errors={errors.title} />

                    {/* City */}   
                    <div className="flex-1">
                        <label className="block text-yellow-400 mb-1">City</label>
                        <select
                        {...register("city")}
                        className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.city ? "border-red-500" : "border-yellow-500"}`}
                        >
                            <option className="text-[#101820]" value="">Choose City</option>
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
                        <label className="block text-yellow-400 mb-1">Category</label>
                        <select
                        {...register("category")}
                        className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.category ? "border-red-500" : "border-yellow-500"}`}
                        >
                            <option className="text-[#101820]" value="">Choose category</option>
                            {mainCategories.map((category, key)=> 
                                <option key={key} className="text-[#101820]" value={category.category}>{category.title}</option>
                            )}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>

                    {/* Sub Category */}
                    <div className="mb-4 flex-1">
                        <label className="block text-yellow-400 mb-1">Sub Category</label>
                        <select
                        {...register("subcategory")}
                        className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.subcategory ? "border-red-500" : "border-yellow-500"}`}
                        >
                        <option value="" className="text-[#101820]">Choose subcategory</option>
                        {mainCategories.filter(item=> item.category === categoryType).at(0)?.subCategories.map((category, key)=>
                            <option key={key} className="text-[#101820]" value={category}>{category}</option>
                        )}
                        </select>
                        {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory.message}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    {/* Available Time */}
                    <label className="block text-yellow-400 mb-1">Available Time</label>
                    <div className="flex space-x-4">
                        {/* Start Time */}
                        <Input name={'startTime'} type={'time'} register={register} errors={errors.startTime} />
                        {/* End Time */}
                        <Input name={'endTime'} type={'time'} register={register} errors={errors.endTime} />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-yellow-400 mb-1">Description</label>
                    <textarea
                    {...register("description")}
                    rows="4"
                    className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors.description ? "border-red-500" : "border-yellow-500"}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Image */}
                <div className="mb-4 flex-1">
                    <label className="block text-yellow-400 mb-1">Image</label>
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
                        <label className="block text-yellow-400 mb-1">Salary Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center text-white">
                            <input
                                type="radio"
                                value="fixed"
                                {...register("salaryType")}
                                className="mr-2"
                            />
                                Fixed Salary
                            </label>
                            <label className="flex items-center text-white">
                            <input
                                type="radio"
                                value="range"
                                {...register("salaryType")}
                                className="mr-2"
                            />
                            Salary Range
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
                        Add new Service
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewService


const Input = ({name, type, register, errors}) =>{
    return(
        <div className="mb- flex-1">
            <label className="block text-yellow-400 mb-1 capitalize">{name}</label>
            <input
                type={type} {...register(name)}
                className={`w-full bg-transparent border focus:outline-yellow-400 focus:outline text-white rounded-md p-2 ${errors ? "border-red-500" : "border-yellow-500"}`}
            />
            {errors && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>
    )
}