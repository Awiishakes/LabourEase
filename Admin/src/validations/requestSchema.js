import * as Yup from "yup";

// Request Validation schema
export const RequestValidationSchema = () =>{

    const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    return ( 
        Yup.object().shape({
            name: Yup.string()
                .min(3, "Name must be at least 3 characters")
                .max(30, "Name cannot exceed 30 characters")
                .required("Name is required"),    
            address: Yup.string()
                .min(5, "Address must be at least 5 characters")
                .required("Address is required"),    
            city: Yup.string()
                .required("City is required"),    
            contact: Yup.string()
                .required('Contact is required')
                .matches(/^[0][3]+\d/, 'Contact must starts with "03"')
                .matches(/^[0-9]{11}$/, 'Contact must be exactly 11 digits'),
           date: Yup.date()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .required("Please mention Date for your work"),
            time: Yup.string().required("Please select a time for your work"),
            salary: Yup.number()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .required("Please mention salary you want to pay")
                .min(50, "Salary must be at least 50"),
            description: Yup.string()
                .min(10, "Description must be at least 10 characters")
                .max(500, "Description cannot exceed 500 characters")
                .required("Please Mention Description why you want to book"),
            images: Yup.mixed()
                .test('file', 'At least one Image is required', 
                    (file)=> {
                        if(file.every((val)=>val===null)){
                            return false
                        }
                        return true
                    }
                )
                .required("At least one Image is required")
                .test("fileType", "Unsupported file format", 
                    (file) => {
                        for (let i = 0; i < 3; i++) {
                            if ((!file[i]?.public_id && (file[i] != null && !SUPPORTED_FORMATS.includes(file[i].type)))) {
                                return false
                            }
                        }
                        return true
                    }
                )
                .test("fileSize", 'File size is too large (max 2MB)', 
                    (file) => {
                        for (let i = 0; i < file.length; i++) {
                            if (!file[i]?.public_id && (file[i] != null && !(file[i].size <= MAX_FILE_SIZE))) {
                                return false
                            }
                        }
                        return true
                    }
                )
            })
    )
}