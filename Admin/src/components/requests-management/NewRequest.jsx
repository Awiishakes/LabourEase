import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RiImageAddFill } from "react-icons/ri";
import { BiTrash } from "react-icons/bi";
import FormSubmitLoader from "../Loaders/FormSubmitLoader";
import { AiOutlineClose } from "react-icons/ai";
import { RequestValidationSchema } from "../../validations";

const NewRequest = ({ workerAvailability, onClose, onSubmit, workId }) => {

  const { startTime, endTime } = workerAvailability;
  const validations = RequestValidationSchema()
  const [currentStep, setCurrentStep] = useState(1)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting },
        } = useForm({ resolver: yupResolver(validations), defaultValues:{images:[null,null,null]}});

  const selectedTime = watch('time')
  const images = watch('images')

  const generateTimeSlots = useCallback((start, end) => {
    const slots = [];
    let current = new Date(`2024-01-01T${start}`);
    const endDate = new Date(`2024-01-01T${end}`);
    while (current <= endDate) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  }, [])

  const timeSlots = useMemo(() => generateTimeSlots(startTime, endTime), [endTime, generateTimeSlots, startTime])

  const onFormSubmit = useCallback(async (data) => {
    // Remove null sockets
    data.images = data.images.filter(val=> val!=null)
    const formData = new FormData();
    // Append all fields to FormData
    for (const key in data){
      if(key != 'images') formData.append(key, data[key])
    }
    formData.append('workId', workId);
    // Append image files
    data.images.forEach((file) => formData.append('images', file))
    
    const coord = await getCoordinatesFromAddress(data.city+', sindh, pakistan')
    if (coord) {
      formData.append('coord',JSON.stringify(coord))
    }

    const success = await onSubmit(formData);
    if (success) {
      setCurrentStep(1)
      reset()
      onClose(false)
    }
  }, [onClose, onSubmit, reset, workId])
  
  const handleImageUpload = useCallback((event, index) => {
    const file = event.target.files[0];
    const updatedImages = [...images]
    updatedImages[index] = file
    setValue('images', updatedImages)
  }, [images, setValue])

  const handleImageDelete = useCallback((index) => {
    const updatedImages = [...images]
    updatedImages[index] = null
    setValue('images', updatedImages) 
  }, [images, setValue])

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image) URL.revokeObjectURL(image);
      })
    }
  }, [images])

  const handleNextStep = useCallback(() => setCurrentStep((prev) => prev + 1), []);
  const handlePrevStep = useCallback(() => setCurrentStep((prev) => prev - 1), []);
  const handleStateChange = useCallback((time) => setValue('time', time), [setValue])
  const handleOnClose = useCallback(() => onClose(false), [onClose])

  return (
    <div className="fixed inset-0 z-[1001] bg-gray-800 bg-opacity-50 flex justify-center items-center overflow-auto">
      <div className="bg-[#101820] relative rounded-lg shadow-lg px-6 py-5 w-full max-w-lg text-white">
        <div onClick={handleOnClose} className="absolute top-4 right-4 text-lg hover:text-yellow-400 transition cursor-pointer">
          <AiOutlineClose/>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Send New Request</h2>
        {isSubmitting && <FormSubmitLoader />}
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className={`${currentStep === 2 && 'absolute invisible'}`}>
              
              <div className="w-full flex gap-x-2">
                <div className="flex-1">
                  <Input type='text' name='name' register={register} errors={errors.name} />
                </div>

                <div className="flex-1">
                  <Input type='text' name='contact' register={register} errors={errors.contact} />
                </div>
              </div>

              {/* Address */}
              <Input type='text' name='address' register={register} errors={errors.address} />

              <div className="w-full flex gap-x-2">
                <div className="mb-4 flex-1">
                  <label className="block text-sm font-medium mb-1 text-yellow-500">City</label>
                  <select
                    {...register("city")}
                    className={`border bg-transparent rounded w-full px-3 py-2 focus:outline-yellow-400 focus:outline ${errors.city? "border-red-500": "border-yellow-500"}`}
                  >
                    <option></option>
                    <option className="text-[#101820]">Hyderabad</option>
                    <option className="text-[#101820]">Latifabad</option>
                    <option className="text-[#101820]">Paretabad</option>
                  </select>
                  {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>

                <div className="flex-1">
                  <Input type='date' name='date' register={register} errors={errors.date} />
                </div>
              </div>

              <div className="mb-4 h-32 overflow-y-auto" style={{scrollbarWidth: 'thin', scrollbarColor:'#facc15 transparent'}}>
                <label className="block text-sm font-medium mb-1 text-yellow-500">Select Time</label>
                {!selectedTime && (errors.time && <p className="text-red-500 text-sm mb-1">{errors.time.message}</p>)}
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleStateChange(time)}
                      className={`px-4 py-2 rounded bg-transparent border border-yellow-500 text-sm cursor-pointer focus:outline-none ${
                        selectedTime === time
                          ? "bg-yellow-400 text-[#101820]"
                          : "hover:bg-yellow-500"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleOnClose}
                  className="mr-2 px-4 py-2 rounded-md hover:text-[#101820] border border-yellow-400 hover:bg-yellow-400 hover:duration-300"
                >
                  Cancel
                </button>
                <div
                  onClick={handleNextStep}
                  className="px-4 py-2 cursor-pointer bg-yellow-400 text-[#101820] rounded hover:bg-yellow-500 active:bg-yellow-400"
                >
                  Next
                </div>
              </div>
            </div>

          {currentStep === 2 && (
            <>
              {/* Salary */}
              <Input type='number' name='salary' register={register} errors={errors.salary} />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-yellow-500">Description</label>
                <textarea
                  rows={5}
                  {...register("description")}
                  className={`border bg-transparent rounded w-full px-3 py-2 focus:outline-yellow-400 focus:outline ${errors.description? "border-red-500": "border-yellow-500"}`}
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              {/* Image Boxes */}
              <div className="form-group mb-4">
                <label className="block font-medium mb-2 text-yellow-500">Images</label>
                {errors.images && <p className="mb-1 text-red-500 text-sm">{errors.images.message}</p>}
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative border border-dashed border-yellow-500 rounded-md overflow-hidden h-24 bg-transparent flex items-center justify-center">
                      {image ? (
                        <>
                          <img src={URL.createObjectURL(image) || ''} alt={`Uploaded ${index}`} className="w-full h-full object-fill" />
                          <button type="button" onClick={() => handleImageDelete(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                            <BiTrash />
                          </button>
                        </>
                      ) : (
                          <>
                            <input type="file" id={`upload-${index}`} accept="image/*" className="hidden"
                              onChange={(e) => handleImageUpload(e, index)} 
                              />
                            <label htmlFor={`upload-${index}`} className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1 shadow-md cursor-pointer">
                              <RiImageAddFill color="#101820"/>
                            </label>
                          </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`px-4 py-2 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-[#101820] hover:duration-300 ${(errors.name || errors.contact || errors.address || errors.city || errors.date || (!selectedTime && errors.time) )&& 'bg-red-500 border-none'}`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-[#101820] rounded hover:bg-yellow-500 active:bg-yellow-400"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

const getCoordinatesFromAddress = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
    )
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
  } catch (error) {
    console.log(error.message || "Address not found")   
  }
};

const Input = ({type, name, register, errors}) =>{

  return(
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-yellow-500 capitalize">{name}</label>
      <input
        type={type}
        {...register(name)}
        className={`border bg-transparent rounded w-full px-3 py-2 focus:outline-yellow-400 focus:outline ${errors? "border-red-500": "border-yellow-500"}`}
      />
      {errors && <p className="text-red-500 text-sm">{errors.message}</p>}
    </div>
  )
}


export default NewRequest;