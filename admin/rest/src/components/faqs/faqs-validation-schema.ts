import * as yup from 'yup';

export const faqsValidationSchema = yup.object().shape({
  faq_title: yup.string().required('form:error-faq-title-required'),
  faq_description: yup.string().required('form:error-faq-description-required'),
});
