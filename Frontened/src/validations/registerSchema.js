import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const RegisterValidationSchema = () =>{
    const { t } =useTranslation()

    return Yup.object().shape({
        role: Yup.string()
            .required('Role is required'),
        name: Yup.string()
            .required(t('validation.required')(t('fields.name')))
            .min(3, t('validation.minLength')(t('fields.name'), 3))
            .max(30, t('validation.maxLength')(t('fields.name'), 30)),
        cnic: Yup.string()
            .required(t('validation.required')(t('fields.cnic')))
            .matches(/^[0-9]{13}$/, t('validation.cnicLength'))
            .matches(/^[1-8]+[1-8]+\d/, t('validation.cnicInvalid')),
        contact: Yup.string()
            .required(t('validation.required')(t('fields.contact')))    
            .matches(/^[0][3]+\d/, t('validation.contactStart'))
            .matches(/^[0-9]{11}$/, t('validation.contactLength')),
        password: Yup.string()
            .required(t('validation.required')(t('fields.password')))
            .matches(/^(?!.*[\s.])/, t('validation.password.noSpecial'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w)/, t('validation.password.strength'))
            .min(8, t('validation.minLength')(t('fields.password'), 8)),
        confirmPassword: Yup.string()
            .required(t('validation.required')(t('fields.confirmPassword')))
            .oneOf([Yup.ref("password")], "Passwords not matched."),
        })
}

