import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Builder {
  userid: string;
  companyname: string;
  companylogo: File | string; // URL or path to the logo
  companyestyear: string;
  headofficephone: string;
  companydescription: string;
  headofficeaddress: string;
  headofficeemail: string;
  alternateofficeemail?: string;
  alternateofficephone?: string;
  alternateofficeaddress?: string;
  isactive: boolean;
  isdeleted: boolean;
}

const validationSchema = Yup.object({
  userid: Yup.string().required('User ID is required'),
  companyname: Yup.string().required('Company Name is required'),
  companylogo: Yup.mixed(),
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

const EditBuilderMaster: React.FC = () => {
  const { builderid } = useParams();
  const [builder, setBuilder] = useState<Builder | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMaster, setUserMaster] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Builder>(`http://localhost:5001/buildermaster/${builderid}`)
      .then(response => {
        setBuilder(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the builder data!', error);
        setLoading(false);
      });

    axios.get<any[]>(`http://localhost:5001/usermaster`)
      .then(response => {
        setUserMaster(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, [builderid]);

  const handleSubmit = async (values: Builder) => {
    try {
      const formData = new FormData();
       // Append file and other fields to FormData
    Object.keys(values).forEach(key => {
      if (key === 'companylogo') {
        if (values[key] instanceof File) {
          formData.append(key, values[key] as File); // Type assertion to File
        } else {
          formData.append(key, values[key] as string); // Handle existing logo
        }
      } else {
        formData.append(key, values[key] as any); // Use 'any' for other fields
      }
    });

      await axios.put(`http://localhost:5001/buildermaster/${builderid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Builder updated successfully!');
      navigate('/apps/master/builder-master');
    } catch (error) {
      console.error('Error updating builder:', error);
      alert('Error updating builder');
    }
  };

  const handleCancel = () => {
    navigate('/apps/localstorge-data/buildermasterdata');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue('companylogo', file); // Set the file object
    }
  };

  if (loading) return <div>Loading...</div>;

  const initialValues: Builder = builder || {
    userid: '',
    companyname: '',
    companylogo: '',
    companyestyear: '',
    headofficephone: '',
    companydescription: '',
    headofficeaddress: '',
    headofficeemail: '',
    alternateofficeemail: '',
    alternateofficephone: '',
    alternateofficeaddress: '',
    isactive: false,
    isdeleted: false
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className='flex-lg-row-fluid me-0'>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">User Id</label>
                    <Field as="select" className="form-select form-select-solid" id="userid" name="userid">
                      <option value="">Select User</option>
                      {userMaster.map(user => (
                        <option key={user.userid} value={user.userid}>
                          {user.userid}, {user.username}
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
                    <input
                      type="file"
                      id="companylogo"
                      className="form-control form-control-solid"
                      name="companylogo"
                      onChange={event => handleFileChange(event, setFieldValue)}
                    />
                    <ErrorMessage name="companylogo" component="div" className="error" />
                    {typeof values.companylogo === 'string' && values.companylogo && !values.companylogo.startsWith('data:') && (
                      <img src={`http://localhost:5001/${values.companylogo}`} alt="Company Logo" style={{ maxWidth: '100px', marginTop: '10px' }} />
                    )}
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
                    <Field as="textarea" id="headofficeaddress" className="form-control form-control-solid" placeholder="" name="headofficeaddress" />
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
                    <label className="fs-5 fw-semibold mb-2">Is Active</label>
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isactive" name="isactive" />
                    </div>
                    <ErrorMessage name="isactive" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Is Deleted</label>
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isdeleted" name="isdeleted" />
                    </div>
                    <ErrorMessage name="isdeleted" component="div" className="error" />
                  </div>
                </div>
                <div className="separator mb-8"></div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Update Builder
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginLeft: '10px', backgroundColor: '#343a40', color: '#ffffff', border: '1px solid #343a40' }}
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
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

export default EditBuilderMaster;
