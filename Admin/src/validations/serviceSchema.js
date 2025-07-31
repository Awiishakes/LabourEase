import * as Yup from "yup";

// Service Validation schema
export const serviceValidationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters")
        .required("Title is required"),    
    description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description cannot exceed 500 characters")
        .required("Description is required"),    
    city: Yup.string().required("City is required"),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),    
    startTime: Yup.string()
        .required("Start time is required")
        .test("is-valid-time", "Start time must be between 08:00 and 23:00", (value) => {
            return value >= "08:00" && value <= "23:00";
        }),
    endTime: Yup.string()
        .required("End time is required")
        .test("is-valid-time", "End time must be between 08:00 and 23:00", (value) => {
        return value >= "08:00" && value <= "23:00";
        })
    .test("is-after-start", "End time must be after start time", function (value) {
        const { startTime } = this.parent; // Access other fields
        return startTime && value > startTime;
    }),
    salaryType: Yup.string()
        .oneOf(["fixed", "range"], "Invalid salary type")
        .required("Salary type is required"),
    fixedSalary: Yup.number()
        .transform((value, originalValue)=> originalValue === ""? null : value)
        .nullable()
        .when("salaryType", {
        is: "fixed",
        then: (schema) => schema
        .required("Fixed salary is required")
        .min(1, "Fixed salary must be at least 1"),
        otherwise: (schema) =>schema.notRequired(),
        }),    
    salaryFrom: Yup.number()
        .transform((value, originalValue)=> originalValue === ""? null : value)
        .nullable()
        .when("salaryType", {
        is: (salaryType) => salaryType === 'range',
        then: (schema) => schema
        .required("Salary range start is required")
        .min(1, "Salary range start must be at least 1"),
        otherwise: (schema) =>schema.notRequired(),
        }),
    salaryTo: Yup.number()
        .transform((value, originalValue)=> originalValue === ""? null : value)
        .nullable()
        .when(["salaryType","salaryFrom"], {
        is: (salaryType, salaryFrom) => salaryType === 'range' && salaryFrom != null,
        then: (schema) => schema
        .required("Salary range end is required")
        .moreThan(Yup.ref("salaryFrom"), "Salary range end must be greater than start"),
        otherwise: (schema) =>schema.notRequired(),
        }),    
    image: Yup.mixed()
        .required("Image is required")
        .test("fileType", "Only image files are allowed",
        (value) => value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
        .test( "fileSize", "File size must be less than 2MB",
        (value) => value && value.size <= 2 * 1024 * 1024),
    });