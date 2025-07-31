import * as Yup from 'yup';

// Initialize the validation schema using Yup
export const newUserSchema = Yup.object().shape({
role: Yup.string()
    .required('Role is required'),
name: Yup.string()
    .required('Name is required'),
cnic: Yup.string()
    .required('CNIC is required')
    .matches(/^[0-9]{13}$/, 'CNIC must be exactly 13 digits')
    .matches(/^[1-8]+[1-8]+\d/, 'Invalid CNIC'),
contact: Yup.string()
    .required('Contact is required')
    .matches(/^[0][3]+\d/, 'Contact must starts with "03"')
    .matches(/^[0-9]{11}$/, 'Contact must be exactly 11 digits'),
password: Yup.string()
    .required('Password is required')
    .matches(/^(?!.*[\s.])/, 'Please do not enter "." or space in password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\w)/, 'Please enter atlest 1 lowerCase, 1 upperCase, 1 number and 1 special Charachter')
    .min(8, 'password must be atlest 8 Charachters'),
confirmPassword: Yup.string()
    .required('Password is required')
    .oneOf([Yup.ref("password")], "Passwords not matched."),
});