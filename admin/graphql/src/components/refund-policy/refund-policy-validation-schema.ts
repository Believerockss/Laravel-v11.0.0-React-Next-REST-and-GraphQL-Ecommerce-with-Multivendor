import * as yup from 'yup';

export const refunPolicyValidationSchema = yup.object().shape({
  title: yup.string().required('form:error-refund-policy-title-required'),
  status: yup.string().required('form:error-status-required'),
  
});
