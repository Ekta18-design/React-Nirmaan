
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import {Link,useNavigate} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'

export interface Userdata {
  userid?: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  confirmpassword: string;
  role: string;
  isactive: boolean;
  isdeleted: boolean;
}
const Registration = () => {
  const navigate = useNavigate(); 
  
  const initialValues: Omit<Userdata, 'userid' | 'role' | 'isactive' | 'isdeleted'> = {
    username: '', 
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    phone: '',
  };
  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    firstname: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid').required('Phone number is required'),
    
  });

  const onSubmit = async (values: Omit<Userdata, 'userid'  | 'role' | 'isactive' | 'isdeleted'>, { resetForm }: { resetForm: () => void }) => {
    console.log('Form values:', values);
    try {
      const response = await fetch('http://localhost:5001/usermaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        user_firstname: values.firstname,
        user_lastname: values.lastname,
        user_email: values.email,
        user_password: values.password,
        user_confirmpassword: values.confirmpassword,
        username: values.username,
        role: 'user',
        isactive: true,
        isdeleted: false,
        user_phone: values.phone,
        }),
      });

      const contentType = response.headers.get('Content-Type');

      let result;
      if (contentType && contentType.includes('application/json')) {
        // Parse JSON if Content-Type is application/json
        result = await response.json();
      } else {
        // Handle non-JSON response as text
        const text = await response.text();
        result = { message: text };
      }
  
      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }
  
      console.log('Server response:', result);
      resetForm();
      alert('Registration successful!');
      navigate('/auth/login');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
    <Form>
     
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        {/* begin::Title */}
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign Up</h1>
        {/* end::Title */}

        <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
      </div>
      {/* end::Heading */}

      {/* begin::Login options */}
      <div className='row g-3 mb-9'>
        {/* begin::Col */}
        <div className='col-md-6'>
          {/* begin::Google link */}
          <a   href='#'
           className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
           <img alt='Logo'  src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')}
           className='h-15px me-3' /> Sign in with Google
           </a>
           {/* end::Google link */}
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        <div className='col-md-6'>
          {/* begin::Google link */}
          <a href='#' className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
            <img alt='Logo'  src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')}
              className='theme-light-show h-15px me-3' />
             <img alt='Logo'  src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')}
                className='theme-dark-show h-15px me-3' />Sign in with Apple
             </a>
           {/* end::Google link */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Login options */}

      <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div>
      <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>User Name</label>
          <Field type='text' name="username" autoComplete='off' className='form-control bg-transparent'/>
          <ErrorMessage name="username" component="div" className="error" />
        </div>
      {/* begin::Form group Firstname */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>First name</label>
        <Field type='text' name="firstname" autoComplete='off' className='form-control bg-transparent'/>
        <ErrorMessage name="firstname" component="div" className="error" />
      </div>
      {/* end::Form group */}
      <div className='fv-row mb-8'>
        {/* begin::Form group Lastname */}
        <label className='form-label fw-bolder text-gray-900 fs-6'>Last name</label>
        <Field type='text' name="lastname" autoComplete='off'  className='form-control bg-transparent'/>
        <ErrorMessage name="lastname" component="div" className="error" />
        {/* end::Form group */}
      </div>

      {/* begin::Form group Email */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
        <Field type='email' name="email"  autoComplete='off' className= 'form-control bg-transparent'/>
        <ErrorMessage name="email" component="div" className="error" />
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='fv-row mb-8' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <Field type='password' name="password" autoComplete='off'  
            className='form-control bg-transparent'/>
            
            <ErrorMessage name="password" component="div" className="error" />
           
          </div>
          {/* begin::Meter */}
          
          {/* end::Meter */}
        </div>     
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
        <Field
          type='password' name="confirmpassword"  className='form-control bg-transparent' />
          <ErrorMessage name="confirmpassword" component="div" className="error" />
      </div>
      {/* end::Form group */}
      <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Phone</label>
          <Field type='text' name="phone" autoComplete='off' className='form-control bg-transparent'/>
          <ErrorMessage name="phone" component="div" className="error" />
        </div>

      {/* begin::Form group */}
      <div className='text-center'>
        <button  type='submit' className='btn btn-lg btn-primary w-100 mb-5'> Submit </button>
        <Link to='/auth/login'>
          <button type='button'  className='btn btn-lg btn-light-primary w-100 mb-5'> Cancel </button>
        </Link>
      </div>
      {/* end::Form group */}
    </Form>
    </Formik>
  )
}
export default Registration;
