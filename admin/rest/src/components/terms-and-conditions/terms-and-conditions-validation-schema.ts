import * as yup from 'yup';

export const termsAndConditionsValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-notice-title-required'),
  description: yup
    .string()
    .required('form:error-notice-description-required'),
});
