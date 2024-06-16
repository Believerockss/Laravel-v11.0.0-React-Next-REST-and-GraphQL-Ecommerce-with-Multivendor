import * as yup from 'yup';

export const termsValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-term-title-required'),
  description: yup.string().required('form:error-term-description-required'),
});
