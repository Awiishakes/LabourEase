import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { singleCategorie } from "../../data/serviceMainCategories";
import { UpdateServiceSchema } from "../../validations";
import { useGlobal } from "../../context/ContextHolder";
import ServiceDetialsLoader from "../../components/Loaders/ServiceDetialsLoader";
import FormSubmitLoader from "../../components/Loaders/FormSubmitLoader";
import { RiImageAddFill } from "react-icons/ri";
import { BiArrowBack, BiTrash } from "react-icons/bi";
import Request from "../../components/Requests/Request";
import { useTranslation } from "react-i18next";


const ServiceDetials = () => {
  
  const { id } = useParams()
  const { role } = useGlobal()
  const { t } = useTranslation()
  const page = useLocation().state?.page
  const validation = UpdateServiceSchema()
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false)

  // React Hook Form setup
  const { register, handleSubmit, reset, watch, setValue, getValues, 
    formState: { errors, isSubmitting }, } = useForm({resolver:yupResolver(validation)});

  const getMyService = useCallback(async () =>{
    try {
      const { data } = await axios.get(`https://labourease-production.up.railway.app/api/work/getMyService/${id}`, { withCredentials: true })
      const service = data.myService[0]
      reset(service)
      setValue('salaryType',service.fixedSalary? 'fixed':'range')
      setLoading(true)
    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }, [id, reset, setValue])

  useEffect(() => {
    getMyService()
  }, [getMyService, id]);

  const category = watch("category");
  const isActive = watch("active");
  const image = watch("image");
  const salaryType = watch("salaryType");

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (salaryType === 'fixed') {
      formData.append('fixedSalary', data.fixedSalary);
    }else{
      formData.append('salaryFrom', data.salaryFrom);
      formData.append('salaryTo', data.salaryTo);
    }

    const filter = ['salaryType', 'fixedSalary', 'salaryFrom', 'salaryTo']
    for(const key in data){
      if (!filter.includes(key)) {
        if (key === 'image' && data[key]) {
          formData.append(key, data[key][0])
        }else{
          formData.append(key, data[key]);
        }
      }
    }
    
    await axios.put(`https://labourease-production.up.railway.app/api/work/update/${id}`, formData, { withCredentials: true })
    .then((res)=>{
      toast.success(res.data.message)
      setReadOnly(true); // Switch back to read-only mode
    })
    .catch((err)=>toast.error(err.response.data.message))
  };
  
  const handleToggle = async (active) => {
    await axios.patch(`https://labourease-production.up.railway.app/api/work/updateStatus/${id}`, { active }, { withCredentials:true })
    .then((res)=>toast.success(res.data.message))
    .catch((err)=>toast.error(err.response.data.message))   
  }
  
  const handleCancel = () => {
    getMyService()
    setReadOnly(true); // Switch back to read-only mode
  }

  const onRequestSubmit = async (formData) =>{
      try {
          const {data} = await axios.post('https://labourease-production.up.railway.app/api/request/postRequest', formData,
              {
                  withCredentials: true, 
                  headers: { "Content-Type": "multipart/form-data" }
              })
          toast.success(data.message)
          return data.success
      } catch (err) {
          toast.error(err.response.data.message)
          return err.response.data.success
      }
  }

  if (loading) { return <ServiceDetialsLoader /> }
  
  return (
    <div className={role === 'client'? 'mt-20 p-4':''}>
      {isSubmitting && <FormSubmitLoader />}
      <Link to={role==='client'? page==='home'?'/home':'/service/subCategories' : '/worker/myServices'} className="bg-[#101820] text-white px-4 py-2 rounded-md shadow-md">
          <BiArrowBack className='inline' />
      </Link>

      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-semibold">Service Details</h2>
        {readOnly ? (
          role === 'client'?
            <button onClick={()=> setIsModal(true)} className="bg-yellow-400 text-[#101820] hover:bg-yellow-500 active:bg-yellow-400 px-4 py-2 rounded">
              Book Now
            </button>
          :
            <button onClick={() => setReadOnly(false)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Edit
            </button>
        ) : (
          <div>
            <button onClick={handleSubmit(onSubmit)} className="bg-green-500 text-white px-4 py-2 rounded mr-2" disabled={isSubmitting} >
              Save
            </button>
            <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        )}
      </div>

      <form className={`sm:grid sm:grid-cols-2 ${role==='client'&&'sm:grid-cols-3'} gap-4 mt-4`}>
        {/* Service Image */}
        <div className={`relative flex gap-x-4 sm:col-span-3 ${role==='client'&&'md:col-span-3'}`}>
          <div className={`relative ${role==='client'? 'w-[40%] pt-[28.5%]':'w-[45%] pt-[35.5%]'} bg-gray-100 border ${errors.image && 'border border-red-500'} rounded-md overflow-hidden`}>
              {image ? (
                <>
                  <img src={image.url? image.url: URL.createObjectURL(image[0])} alt={'Service Image'} className="absolute top-0 left-0 w-full h-full object-fill" />
                  {!readOnly &&
                    <button type="button" onClick={() => setValue('image',null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                      <BiTrash />
                    </button>
                  }
                </>
              ) : (
                  <>
                    <input type="file" id={'uploadImage'} accept="image/*" className="hidden" {...register('image')}/>
                    <label htmlFor={'uploadImage'} className="absolute top-2 right-2 bg-yellow-400 text-white rounded-full p-1 shadow-md cursor-pointer">
                      <RiImageAddFill color="#101820"/>
                    </label>
                  </>
              )}
            {errors.image && ( <p className="absolute left-0 right-0 bottom-0 z-[1] text-red-500 text-center">{errors.image.message}</p>)}
          </div>

            {role === 'worker' &&
              <div className="flex items-start space-x-2">
                <input type="checkbox" {...register('active')} id="activeToggle" 
                  className="toggle-checkbox" onClick={(e)=> readOnly && handleToggle(e.currentTarget.checked)} />
                <label htmlFor="activeToggle" className="text-sm font-medium">
                  {isActive ? "Active" : "Inactive"}
                </label>
              </div>
            }
        </div>

        <Input name={'title'} type={'text'} register={register} readOnly={readOnly} errors={errors.title} />

        <div className="">
            <label className="block font-semibold">{t('fields.category')}</label>
            <select disabled={readOnly} {...register("category")}
            className={`w-full px-4 py-2 border rounded-md focus:outline outline-2 ${
              readOnly ? "bg-gray-200 cursor-default focus:outline-none" : ""
            } ${errors.category ? "border-red-500" : ""}`}
            >
              <option className="text-[#101820]" value="">{t('servicePage.search.category')}</option>
              {singleCategorie.filter(item=> item.category === singleCategorie.find(val => val.title === category).category)
              .map((category, key)=> 
                  <option key={key} className="text-[#101820]" value={category.title}>{category.title}</option>
              )}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div className={role==='client'?'':'col-span-2'}>
            <label className="block font-semibold">{t('fields.city')}</label>
            <select disabled={readOnly} {...register("city")}
            className={`w-full px-4 py-2 border rounded-md focus:outline outline-2 ${
              readOnly ? "bg-gray-200 cursor-default focus:outline-none" : ""
            } ${errors.city ? "border-red-500" : ""}`}
            >
              <option className="text-[#101820]" value="">{t('servicePage.search.city')}</option>
              <option className="text-[#101820]" value="hyderabad">Hyderabad</option>
              <option className="text-[#101820]" value="latifabad">Latifabad</option>
              <option className="text-[#101820]" value="paretabad">Paretabad</option>
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-x-3">
          {/* Start Time */}
          <Input name={'startTime'} type={'time'} register={register} readOnly={readOnly} errors={errors.startTime} />
          {/* End Time */}
          <Input name={'endTime'} type={'time'} register={register} readOnly={readOnly} errors={errors.endTime} />
        </div>

        {/* Price */}
        <div className="col-span-3">
            {/* Salary Type */}
            {role != 'client' &&
              <div>
                <label className="block font-semibold">{t('newService.salaryType')}</label>
                <div className="flex space-x-4 mb-2">
                    <label className="flex items-center">
                      <input type="radio" value="fixed" disabled={readOnly} {...register("salaryType")} className="mr-2" />
                      {t('fields.fixedSalary')}
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="range" disabled={readOnly} {...register("salaryType")} className="mr-2" />
                      {t('newService.rangeSalary')}
                    </label>
                </div>
                {errors.salaryType && <p className="text-red-500 text-sm">{errors.salaryType.message}</p>}
              </div>
            }

            {/* Fixed Salary */}
            {salaryType == "fixed" && (
              <Input name={'fixedSalary'} type={'number'} register={register} readOnly={readOnly} errors={errors.fixedSalary} />
            )}

            {/* Salary Range */}
            {salaryType === "range" && (
            <div className="sm:flex gap-x-4">
              <div className="flex-1">
                <Input name={'salaryFrom'} type={'number'} register={register} readOnly={readOnly} errors={errors.salaryFrom} />
              </div>
              <div className="flex-1">
                <Input name={'salaryTo'} type={'number'} register={register} readOnly={readOnly} errors={errors.salaryTo} />
              </div>
            </div>
            )}
        </div>

        <div className={`sm:col-span-2 ${role==='client'&&'sm:col-span-3'}`}>
          <label className="block font-semibold">{t('fields.description')}</label>
          <textarea {...register("description")} readOnly={readOnly}
            className={`w-full px-4 py-2 border rounded-md ${
              readOnly ? "bg-gray-200 cursor-default focus:outline-none" : ""
            } ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && ( <p className="text-red-500 text-sm">{errors.description.message}</p> )}
        </div>
      </form>
      <>
          {isModal &&
              <Request workerAvailability={{startTime: getValues('startTime'), endTime: getValues('endTime')}} onClose={setIsModal} onSubmit={onRequestSubmit} workId={id} />
          }
      </>
    </div>
  );
};
export default ServiceDetials;

const Input = ({name, type, register, readOnly, errors}) =>{
  const { t } = useTranslation()
  return(
    <div>
      <label className="block font-semibold capitalize">{t('fields.'+name)}</label>
      <input type={type} {...register(name)} readOnly={readOnly}
        className={`w-full px-4 py-2 border rounded-md ${
          readOnly ? "bg-gray-200 cursor-default focus:outline-none" : ""
        } ${errors ? "border-red-500" : ""}`}
      />  
      {errors && (<p className="text-red-500 text-sm">{errors.message}</p>)}
    </div>
  )
}