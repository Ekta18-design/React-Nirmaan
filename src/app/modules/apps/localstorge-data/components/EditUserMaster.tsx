import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Userdata } from '../../master/components/UserMaster';

const validationSchema = Yup.object({
  username: Yup.string().required('UserName is required'),
  user_firstname: Yup.string().required('FirstName is required'),
  user_lastname: Yup.string().required('LastName is required'),
  user_phone: Yup.string().required('Phone is required'),
  user_email: Yup.string().email('Invalid email address').required('Email is required'),
  user_password: Yup.string().required('Password is required'),
  user_confirmpassword: Yup.string()
    .oneOf([Yup.ref('user_password')], 'Passwords must match')
    .required('Confirm Password is required'),
  role: Yup.string().required('Role selection is required'),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
});

const EditUserMaster: React.FC = () => {
  const { userid } = useParams();
  const [user, setUser] = useState<Userdata | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Get the token

  // Fetch user data
  useEffect(() => {
    axios.get(`http://localhost:5001/usermaster/${userid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
        setLoading(false);
      });
  }, [userid, token]);

   // Handle form submission
   const handleSubmit = async (values: Userdata) => {
    try {
      await axios.put(`http://localhost:5001/usermaster/${userid}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated successfully!');
      navigate('/apps/master/user-master');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };
  // Handle cancel action
  const handleCancel = () => {
    navigate('/apps/localstorge-data/usermasterdata');
  };

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Define initial values for Formik
  const initialValues: Userdata = user || {
    username: '',
    user_firstname: '',
    user_lastname: '',
    user_phone: '',
    user_email: '',
    user_password: '',
    user_confirmpassword: '',
    role: 'user',
    isactive: false,
    isdeleted: false
  };

  // Render form when user data is available

  return (
    <div className='card'>
      <div className='card-body'>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}
         enableReinitialize={true} // Reinitialize form when initialValues change
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='flex-lg-row-fluid me-0'>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">User Name</label>
                    <Field type="text" id="username" className="form-control form-control-solid" name="username" />
                    <ErrorMessage name="username" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">First Name</label>
                    <Field type="text" id="user_firstname" className="form-control form-control-solid" name="user_firstname" />
                    <ErrorMessage name="user_firstname" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Last Name</label>
                    <Field type="text" id="user_lastname" className="form-control form-control-solid" name="user_lastname" />
                    <ErrorMessage name="user_lastname" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Email</label>
                    <Field type="text" id="user_email" className="form-control form-control-solid" name="user_email" />
                    <ErrorMessage name="user_email" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Phone</label>
                    <Field type="text" id="user_phone" className="form-control form-control-solid" name="user_phone" />
                    <ErrorMessage name="user_phone" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Role</label>
                    <Field as="select" className="form-control form-control-solid" id="role" name="role">
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Field>
                    <ErrorMessage name="role" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Password</label>
                    <Field type="password" id="user_password" className="form-control form-control-solid" name="user_password" />
                    <ErrorMessage name="user_password" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Confirm Password</label>
                    <Field type="password" id="user_confirmpassword" className="form-control form-control-solid" name="user_confirmpassword" />
                    <ErrorMessage name="user_confirmpassword" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">isActive</label>
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isactive" name="isactive" />
                    </div>
                    <ErrorMessage name="isactive" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">isDeleted</label>
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isdeleted" name="isdeleted" />
                    </div>
                    <ErrorMessage name="isdeleted" component="div" className="error" />
                  </div>
                </div>
                <div className="separator mb-8"></div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Update User
                </button>
                 <button type="button" className="btn btn-secondary" style={{ marginLeft: '10px', backgroundColor: '#343a40',color: '#ffffff', border: '1px solid #343a40' }}
                  onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUserMaster;
