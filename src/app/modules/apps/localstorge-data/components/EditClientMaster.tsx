import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Client {
  clientname: string;
  clientreferencename: string;
  clientaddress?: string;
  clientphone: string;
  clientemail: string;
  clientpanno: string;
  clientpanphoto: File | string;
  clientaadharno: string;
  clientaadharphoto: File | string;
  isactive: boolean;
  isdeleted: boolean;
}

const validationSchema = Yup.object({
  clientname: Yup.string().required('Client Name is required'),
  clientreferencename: Yup.string().required('Client Reference Name is required'),
  clientaddress: Yup.string().required('Client Address is required'),
  clientpanno: Yup.string().required('Client Pan no. is required'),
  clientpanphoto: Yup.mixed().required('Client Pan Photo is required'),
  clientaadharno: Yup.string().required('Client Aadhar no. is required'),
  clientaadharphoto: Yup.mixed().required('Client Aadhar Photo is required'),
  clientemail: Yup.string().email('Invalid email address').required('Client Email is required'),
  clientphone: Yup.string(),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
});

const EditClientMaster: React.FC = () => {
  const { clientid } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get<Client>(`http://localhost:5001/clientmaster/${clientid}`)
      .then(response => {
        setClient(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the client data!', error);
        setLoading(false);
      });
  }, [clientid]);

  const handleSubmit = async (values: Client) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'clientpanphoto' || key === 'clientaadharphoto') {
          const value = values[key as keyof Client];
          if (value instanceof File) {
            formData.append(key, value); // Append file if it's a new one
          } else {
            formData.append(key, value as string); // Append existing file path
          }
        } else {
          formData.append(key, values[key as keyof Client] as any); // Append other fields
        }
      });

      await axios.put(`http://localhost:5001/clientmaster/${clientid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Client updated successfully!');
      navigate('/apps/master/client-master');
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client');
    }
  };

  const handleCancel = () => {
    navigate('/apps/localstorge-data/clientmasterdata');
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    field: keyof Client
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue(field, file); // Set the file object
    }
  };

  if (loading) return <div>Loading...</div>;

  const initialValues: Client = client || {
    clientname: '',
    clientreferencename: '',
    clientaddress: '',
    clientpanno: '',
    clientpanphoto: '',
    clientaadharno: '',
    clientaadharphoto: '',
    clientemail: '',
    clientphone: '',
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
                    <label className="fs-5 fw-semibold mb-2">Client Name</label>
                    <Field type="text" id="clientname" className="form-control form-control-solid" name="clientname" />
                    <ErrorMessage name="clientname" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Reference Name</label>
                    <Field type="text" id="clientreferencename" className="form-control form-control-solid" name="clientreferencename" />
                    <ErrorMessage name="clientreferencename" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Address</label>
                    <Field as="textarea" id="clientaddress" className="form-control form-control-solid" name="clientaddress" />
                    <ErrorMessage name="clientaddress" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Phone</label>
                    <Field type="text" id="clientphone" className="form-control form-control-solid" name="clientphone" />
                    <ErrorMessage name="clientphone" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Email</label>
                    <Field type="text" id="clientemail" className="form-control form-control-solid" name="clientemail" />
                    <ErrorMessage name="clientemail" component="div" className="error" />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Pan No.</label>
                    <Field type="text" id="clientpanno" className="form-control form-control-solid" name="clientpanno" />
                    <ErrorMessage name="clientpanno" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Pan Photo</label>
                    <input
                      type="file"
                      id="clientpanphoto"
                      className="form-control form-control-solid"
                      name="clientpanphoto"
                      onChange={event => handleFileChange(event, setFieldValue, 'clientpanphoto')}
                    />
                    <ErrorMessage name="clientpanphoto" component="div" className="error" />
                    {typeof values.clientpanphoto === 'string' && values.clientpanphoto && !values.clientpanphoto.startsWith('data:') && (
                      <img src={`http://localhost:5001/${values.clientpanphoto}`} alt="Client Pan Photo" style={{ maxWidth: '100px', marginTop: '10px' }} />
                    )}
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Aadhar No.</label>
                    <Field type="text" id="clientaadharno" className="form-control form-control-solid" name="clientaadharno" />
                    <ErrorMessage name="clientaadharno" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">Client Aadhar Photo</label>
                    <input
                      type="file"
                      id="clientaadharphoto"
                      className="form-control form-control-solid"
                      name="clientaadharphoto"
                      onChange={event => handleFileChange(event, setFieldValue, 'clientaadharphoto')}
                    />
                    <ErrorMessage name="clientaadharphoto" component="div" className="error" />
                    {typeof values.clientaadharphoto === 'string' && values.clientaadharphoto && !values.clientaadharphoto.startsWith('data:') && (
                      <img src={`http://localhost:5001/${values.clientaadharphoto}`} alt="Client Aadhar Photo" style={{ maxWidth: '100px', marginTop: '10px' }} />
                    )}
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
                  Update Client
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

export default EditClientMaster;
