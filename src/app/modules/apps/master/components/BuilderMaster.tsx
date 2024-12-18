
import React   from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Userdata , Builder } from '../MasterPage';

const validationSchema = Yup.object({
  
  userid: Yup.string().required('User ID is required'),
  companyname: Yup.string().required('Company Name is required'),
  companylogo: Yup.mixed().required('Company Logo is required'),
  companyestyear: Yup.string().required('Company Established Year is required'),
  headofficephone: Yup.string().required('Head Office Phone is required'),
  companydescription: Yup.string().required('Company Description is required'),
  headofficeaddress: Yup.string().required('Head Office Address is required'),
  headofficeemail: Yup.string().email('Invalid email address').required('Head Office Email is required'),
  alternateofficeemail: Yup.string().email('Invalid email address'),
  alternateofficephone: Yup.string(),
  alternateofficeaddress: Yup.string(),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
	
});

interface BuilderMasterFormProps {
  user_master: Userdata[];  // Add users to the interface
  onSaveBuilder: (builder: Builder) => void;
}

const BuilderMaster: React.FC<BuilderMasterFormProps> = ({ user_master, onSaveBuilder }) => {

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File | null, shouldValidate?: boolean) => void
  ) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      setFieldValue('companylogo', files[0]);
    }
  };

  const handleSubmit = async (values: Builder, { resetForm }: { resetForm: () => void }) => {
    const formData = new FormData();

    for (const key in values) {
      const value = values[key as keyof Builder];
      if (key === 'companylogo' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    }

    try {
      const response = await fetch('http://localhost:5001/buildermaster', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }
      const data = await response.json();
      alert('Added Data Successfully!');
      onSaveBuilder(data);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding builder');
    }
  };

  const initialValues: Builder = {
    // This will be overwritten by the backend
    userid: '',
    companyname: '',
    companylogo: null,
    companyestyear: '',
    headofficephone: '',
    companydescription: '',
    headofficeaddress: '',
    headofficeemail: '',
    alternateofficeemail: '',
    alternateofficephone: '',
    alternateofficeaddress: '',
    isactive: false,
    isdeleted: false,
  };

  return (
    <> 
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
									<Formik initialValues={initialValues} 
                  validationSchema={validationSchema} onSubmit={handleSubmit}>
														
										{({ setFieldValue, isSubmitting }) => (
											<Form>
	
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
                          <label className="fs-5 fw-semibold mb-2">User Id</label>
														<Field as="select" className="form-select form-select-solid" id="userid" name="userid">
														<option value="">Select User</option>
																{user_master.map(user => (
																	<option key={user.userid} value={user.userid}>{user.userid},{user.username}
																	</option>
																))}
														</Field>
														<ErrorMessage name="userid" component="div" className="error" />
													</div>
													
													<div className="col-md-6 fv-row">
													<label className="fs-5 fw-semibold mb-2">Company Name</label>
														<Field type="text" id="companyname" className="form-control form-control-solid" placeholder="" name="companyname" />
														<ErrorMessage name="companyname" component="div" className="error" />
												</div>
                        </div>

                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
                          <label className="fs-5 fw-semibold mb-2">Company Logo</label>
														
														<input type="file" id="companylogo" className="form-control form-control-solid"  name="companylogo" onChange={event => handleFileChange(event, setFieldValue)} />
														<ErrorMessage name="companylogo" component="div" className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													<label className="fs-5 fw-semibold mb-2">Company Est. Year</label>
														
														<Field type="text" id="companyestyear" className="form-control form-control-solid" placeholder="" name="companyestyear" />
														<ErrorMessage name="companyestyear" component="div" className="error" />
														
												</div>
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
                          <label className="fs-5 fw-semibold mb-2">Head Office Phone</label>
														
														<Field type="text" id="headofficephone" className="form-control form-control-solid" placeholder="" name="headofficephone" />
														<ErrorMessage name="headofficephone" component="div" className="error" />
													</div>
													
													<div className="col-md-6 fv-row">
                          <label className="fs-5 fw-semibold mb-2">Company Description</label>
														
														<Field as="textarea" id="companydescription" className="form-control form-control-solid" placeholder="" name="companydescription" />
														
														<ErrorMessage name="companydescription" component="div" className="error" />
												</div>
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
													<label className="fs-5 fw-semibold mb-2">Head Office Address</label>
														
                            <Field as="textarea" id="headofficeaddress" className="form-control form-control-solid" placeholder="" name="headofficeaddress"/>
														<ErrorMessage name="headofficeaddress" component="div" className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
                          <label className="fs-5 fw-semibold mb-2">Head Office Email</label>
														
														<Field type="text" id="headofficeemail" className="form-control form-control-solid" placeholder="" name="headofficeemail" />
														<ErrorMessage name="headofficeemail" component="div" className="error" />
														
												</div>
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													<label className="fs-5 fw-semibold mb-2">Alternate Office Email</label>
														
														<Field type="text" id="alternateofficeemail" className="form-control form-control-solid" placeholder="" name="alternateofficeemail" />
														<ErrorMessage name="alternateofficeemail" component="div" className="error" />
													</div>
                          <div className="col-md-6 fv-row">
													
                          <label className="fs-5 fw-semibold mb-2">Alternate Office Phone</label>
														
														<Field type="text" id="alternateofficephone" className="form-control form-control-solid" placeholder="" name="alternateofficephone" />
														<ErrorMessage name="alternateofficephone" component="div" className="error" />
													
													</div>
													
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
                          <label className="fs-5 fw-semibold mb-2">Alternate Office Address</label>
														
                            <Field as="textarea" id="alternateofficeaddress" className="form-control form-control-solid" placeholder="" name="alternateofficeaddress" />
														<ErrorMessage name="alternateofficeaddress" component="div" className="error" />
													
													</div>
                          </div>
                      
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isActive</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive" />
														
														</div>
														<ErrorMessage name="isactive" component="div"   className="error" />
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isDeleted</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted"  />
														</div>
														<ErrorMessage name="isdeleted" component="div"   className="error" />
												</div>
                        </div>
                        <div className="separator mb-8"></div>
                        <button type="submit" className="btn btn-primary"  disabled={isSubmitting}>
                          save 
                        </button>
												
                        </Form>
													)}
												</Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default BuilderMaster;