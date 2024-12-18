import React , { useRef }from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Client } from '../MasterPage';

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

interface ClientMasterFormProps {
  onSaveClient: (client: Client) => void;
}

const ClientMaster: React.FC<ClientMasterFormProps> = ({ onSaveClient }) => {

const panPhotoRef = useRef<HTMLInputElement>(null);
  const aadharPhotoRef = useRef<HTMLInputElement>(null);
  const initialValues: Client = {
    clientid: 0,
    clientname: '',
    clientpanphoto: null,
    clientaadharphoto: null,
    clientreferencename: '',
    clientaddress: '',
    clientphone: '',
    clientemail: '',
    clientpanno: '',
    clientaadharno: '',
    isactive: false,
    isdeleted: false,
  };

  // Function to handle file changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: 
    (field: string, value: any) => void, fieldName: string) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    setFieldValue(fieldName, file);
  };

  const handleSubmit = async (values: Client, { resetForm }: { resetForm: () => void }) => {
    try {
      const formData = new FormData();
      formData.append('clientname', values.clientname);
      formData.append('clientreferencename', values.clientreferencename);
      formData.append('clientaddress', values.clientaddress);
      formData.append('clientpanno', values.clientpanno);
      formData.append('clientaadharno', values.clientaadharno);
      formData.append('clientemail', values.clientemail);
      formData.append('clientphone', values.clientphone);
      formData.append('isactive', values.isactive? 'true' : 'false');
      formData.append('isdeleted', values.isdeleted? 'true' : 'false');

      if (values.clientpanphoto) {
        formData.append('clientpanphoto', values.clientpanphoto);
      }

      if (values.clientaadharphoto) {
        formData.append('clientaadharphoto', values.clientaadharphoto);
      }

      const response = await axios.post('http://localhost:5001/clientmaster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSaveClient(response.data);
      resetForm();
       // Reset file inputs manually
    if (panPhotoRef.current) panPhotoRef.current.value = '';
      if (aadharPhotoRef.current) aadharPhotoRef.current.value = '';
    alert('Client added successfully');
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error adding client');
    }
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ setFieldValue, isSubmitting }) => (
            <Form>
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
                <div className="col-md-6 fv-row">
                  <label className="fs-5 fw-semibold mb-2">Client Pan No.</label>
                  <Field type="text" id="clientpanno" className="form-control form-control-solid" name="clientpanno" />
                  <ErrorMessage name="clientpanno" component="div" className="error" />
                </div>
              </div>

              <div className="row mb-5">
                <div className="col-md-6 fv-row">
                  <label className="fs-5 fw-semibold mb-2">Client Pan Photo</label>
                  <input type="file" id="clientpanphoto" className="form-control form-control-solid" name="clientpanphoto" ref={panPhotoRef} 
                  onChange={event => handleFileChange(event, setFieldValue, 'clientpanphoto')} />
                  <ErrorMessage name="clientpanphoto" component="div" className="error" />
                </div>
                <div className="col-md-6 fv-row">
                  <label className="fs-5 fw-semibold mb-2">Client Aadhar No.</label>
                  <Field type="text" id="clientaadharno" className="form-control form-control-solid" name="clientaadharno" />
                  <ErrorMessage name="clientaadharno" component="div" className="error" />
                </div>
              </div>

              <div className="row mb-5">
                <div className="col-md-6 fv-row">
                  <label className="fs-5 fw-semibold mb-2">Client Aadhar Photo</label>
                  <input type="file" id="clientaadharphoto" className="form-control form-control-solid" name="clientaadharphoto" ref={aadharPhotoRef} onChange={event => handleFileChange(event, setFieldValue, 'clientaadharphoto')} />
                  <ErrorMessage name="clientaadharphoto" component="div" className="error" />
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
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ClientMaster;
