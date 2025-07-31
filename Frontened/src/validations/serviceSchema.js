import { useTranslation } from "react-i18next";
import * as Yup from "yup";

// Service Validation schema
export const ServiceValidationSchema = () =>{
    const { t } = useTranslation()
    return(
        Yup.object().shape({
            title: Yup.string()
                .required(t('validation.required')(t('fields.title')))
                .min(3, t('validation.minLength')(t('fields.title'), 3))
                .max(100, t('validation.maxLength')(t('fields.title'), 100)),
            description: Yup.string()
                .required(t('validation.required')(t('fields.description')))
                .min(10, t('validation.minLength')(t('fields.description'), 10))
                .max(500, t('validation.maxLength')(t('fields.description'), 500)),
            city: Yup.string().required(t('validation.required')(t('fields.city'))),
            category: Yup.string().required(t('validation.required')(t('fields.category'))),
            subcategory: Yup.string().required(t('validation.required')(t('fields.subcategory'))),    
            startTime: Yup.string()
                .required(t('validation.time.start'))
                .test("is-valid-time", t('validation.time.between')(t('fields.startTime'),"8:00","23:00"), 
                (value) => {
                    return value >= "08:00" && value <= "23:00";
                }),
            endTime: Yup.string()
                .required(t('validation.time.end'))
                .test("is-valid-time", t('validation.time.between')(t('fields.endTime'),"8:00","23:00"), 
                (value) => {
                    return value >= "08:00" && value <= "23:00";
                })
            .test("is-after-start", t('validation.time.after'), function (value) {
                const { startTime } = this.parent; // Access other fields
                return startTime && value > startTime;
            }),
            salaryType: Yup.string()
                .oneOf(["fixed", "range"], "Invalid salary type")
                .required("Salary type is required"),
            fixedSalary: Yup.number()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .when("salaryType", { is: "fixed",
                    then: (schema) => schema
                        .required(t('validation.required')(t('fields.fixedSalary')))
                        .min(50, t('validation.salary.min')(t('fields.fixedSalary'), 50)),
                    otherwise: (schema) =>schema.notRequired(),
                }),    
            salaryFrom: Yup.number()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .when("salaryType", {
                is: (salaryType) => salaryType === 'range',
                    then: (schema) => schema
                        .required(t('validation.required')(t('fields.salaryFrom')))
                        .min(50, t('validation.salary.min')(t('fields.salaryFrom'), 50)),
                    otherwise: (schema) =>schema.notRequired(),
                    }),
            salaryTo: Yup.number()
                .transform((value, originalValue)=> originalValue === ""? null : value)
                .nullable()
                .when(["salaryType","salaryFrom"], {
                    is: (salaryType, salaryFrom) => salaryType === 'range' && salaryFrom != null,
                        then: (schema) => schema
                            .required(t('validation.required')(t('fields.salaryTo')))
                            .moreThan(Yup.ref("salaryFrom"), t('validation.salary.rangeEndGreater')),
                        otherwise: (schema) =>schema.notRequired(),
                }),    
            image: Yup.mixed()
                .required(t('validation.required')(t('fields.image')))
                .test("fileType", t('validation.images.unsupported'),
                (value) => value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
                .test( "fileSize", t('validation.images.tooLarge'),
                (value) => value && value.size <= 2 * 1024 * 1024),
            })
    )
}