import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// Request Validation schema
export const RequestValidationSchema = () =>{

    const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const { t } = useTranslation()
    return ( 
        Yup.object().shape({
            name: Yup.string()
                .required(t('validation.required')(t('fields.name')))
                .min(3, t('validation.minLength')(t('fields.name'), 3))
                .max(30, t('validation.maxLength')(t('fields.name'), 30)),
            address: Yup.string()
                .min(5, t('validation.minLength')(t('fields.address'), 5))
                .required(t('validation.required')(t('fields.address'))),
            city: Yup.string()
                .required(t('validation.required')(t('fields.city'))),
            contact: Yup.string()
            .required(t('validation.required')(t('fields.contact')))    
            .matches(/^[0][3]+\d/, t('validation.contactStart'))
            .matches(/^[0-9]{11}$/, t('validation.contactLength')),
            date: Yup.date()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .required(t('validation.required')(t('fields.date')))    
                .required(t('validation.reqDate')),
            time: Yup.string().required(t('validation.reqTime')),
            salary: Yup.number()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .required(t('validation.reqSalary'))
                .min(50, t('validation.salary.min')(t('fields.salary'), 50)),
            description: Yup.string()
                .min(10, t('validation.minLength')(t('fields.description'), 10))
                .max(500, t('validation.maxLength')(t('fields.description'), 500))
                .required(t('validation.required')(t('fields.description'))),
            images: Yup.mixed()
                    .test('file', t('validation.images.required'), 
                        (file)=> {
                            if(file.every((val)=>val===null)){
                                return false
                            }
                            return true
                        }
                    )
                    .test("fileType", t('validation.images.unsupported'), 
                        (file) => {
                            for (let i = 0; i < 3; i++) {
                                if ((!file[i]?.public_id && (file[i] != null && !SUPPORTED_FORMATS.includes(file[i].type)))) {
                                    return false
                                }
                            }
                            return true
                        }
                    )
                    .test("fileSize", t('validation.images.tooLarge'), 
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