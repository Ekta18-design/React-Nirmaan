
import React from 'react'
import { Formik, Form, Field, ErrorMessage ,FormikHelpers} from 'formik';
import * as Yup from 'yup';


export interface Userdata {
	userid?: number;
	username: string;
	user_firstname: string;
	user_lastname: string;
	user_email: string;
	user_phone: string;
	user_password: string;
	user_confirmpassword: string;
	role: string;
	isactive: boolean;
	isdeleted: boolean;
}
// Define initial form values
interface UserMasterFormProps {
  onSaveUser: (usermas: Userdata) => void;
}
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

const UserMaster : React.FC<UserMasterFormProps> = ({ onSaveUser }) => {


	const handleSubmit = async (values: Userdata, { resetForm }: FormikHelpers<Userdata>) => {


    try {
			const response = await fetch('http://localhost:5001/usermaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Added Data Successfully!');
      onSaveUser(values);
      resetForm();
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding user');
    }
};

	const initialValues: Userdata ={
		username: '',
		user_firstname: '',
		user_lastname: '',
		user_email: '',
		user_phone: '',
		user_password: '',
		user_confirmpassword:'',
		role: '',
		isactive: false,
		isdeleted: false,
	}
	
  return (
    <>
    <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
								<Formik initialValues={initialValues} validationSchema={validationSchema} 
								onSubmit={handleSubmit}>
								
								{({ isSubmitting }) => (
										<Form>	
                  <div className='flex-lg-row-fluid me-0'>
	
                        <div className="row mb-5">
												
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">User Name</label>
														
														<Field type="text" id="username" className="form-control form-control-solid"  name="username"  />
														<ErrorMessage name="username" component="div" className="error" />
														
												</div>
												<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">First Name</label>
														
														<Field type="text" id="user_firstname" className="form-control form-control-solid"  name="user_firstname"  />
														<ErrorMessage name="user_firstname" component="div" className="error" />
													
													</div>
                        </div>

                        <div className="row mb-5">
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Last Name</label>
														
														<Field type="text" id="user_lastname" className="form-control form-control-solid"  name="user_lastname"  />
														<ErrorMessage name="user_lastname" component="div" className="error" />
														
												</div>
												<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Email</label>
														
														<Field type="text" id="user_email" className="form-control form-control-solid"  name="user_email" />
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
														
														<Field as="select" className="form-control form-control-solid" 
														id="role" aria-label="Select example" name="role" >
                                       
                             <option value="admin">Admin</option>
                              <option value="user">User</option>
                                        
                               </Field>
															<ErrorMessage name="role" component="div" className="error" />
													
													</div>
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Password</label>
														
														<Field type="password" id="user_password" className="form-control form-control-solid"  name="user_password"  />
														<ErrorMessage name="user_password" component="div" className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Confirm Password</label>
														
														<Field type="password" id="user_confirmpassword" className="form-control form-control-solid" placeholder="" name="user_confirmpassword" />
														<ErrorMessage name="user_confirmpassword" component="div" className="error" />
														
												</div>
                        </div>
												
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isActive</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive"  />
														
														</div>
														<ErrorMessage name="isactive" component="div"   className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isDeleted</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted" />
														</div>
														<ErrorMessage name="isdeleted" component="div"   className="error" />
												</div>
                        </div>
                        <div className="separator mb-8"></div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
												save </button>
											</div>
											</Form>
													)}
										</Formik>
										
              </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default UserMaster;
