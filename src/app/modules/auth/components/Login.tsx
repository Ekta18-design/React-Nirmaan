import * as Yup from 'yup';
import React ,{useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

const Login = () => {
  const navigate = useNavigate();

  const initialValues: User = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = async (values: User, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const { email, password } = values;
  
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Ensure the response is OK and in JSON format
      if (!response.ok) {
        throw new Error(`Failed to authenticate: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      if (result.message === 'Login successful') {
        const userId = result.user.userid;
  
        // Store the userid in localStorage
        localStorage.setItem('userid', userId);
  
        // Set the cookie with the userid and an expiration time of 1 hour
        const expiryTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from now
        document.cookie = `userid=${userId}; expires=${expiryTime.toUTCString()}; path=/`;
  
        console.log('Login successful:', result);
        navigate('/dashboard'); // Navigate to dashboard on success
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const removeUserId = () => {
      localStorage.removeItem('userid');
      document.cookie = 'userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    window.addEventListener('beforeunload', removeUserId);
    return () => {
      window.removeEventListener('beforeunload', removeUserId);
    };
  }, []);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form className='form w-100' noValidate id='kt_login_signin_form'>
          <div className='text-center mb-11'>
            <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
            <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
          </div>
          <div className='row g-3 mb-9'>
            <div className='col-md-6'>
              <a href='#' className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
                <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')} className='h-15px me-3'/>
                Sign in with Google
              </a>
            </div>
            <div className='col-md-6'>
              <a href='#' className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
                <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')} className='theme-light-show h-15px me-3'/>
                <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')} className='theme-dark-show h-15px me-3'/>
                Sign in with Apple
              </a>
            </div>
          </div>
          <div className='separator separator-content my-14'>
            <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
          </div>
          <div className='fv-row mb-8'>
            <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
            <Field type='email' name='email' className='form-control bg-transparent' autoComplete="new-email"/>
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className='fv-row mb-3'>
            <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
            <Field type='password' name="password" className='form-control bg-transparent' autoComplete="new-password"/>
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
            <div />
            <Link to='/auth/forgot-password' className='link-primary'>
              Forgot Password ?
            </Link>
          </div>
          <div className='d-grid mb-10'>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary'>Continue</button>
          </div>
          <div className='text-gray-500 text-center fw-semibold fs-6'>
            Not a Member yet?{' '}
            <Link to='/auth/registration' className='link-primary'>
              Sign up
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Login;
