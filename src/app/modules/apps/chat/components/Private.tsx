
import React from 'react';
import { Formik, Form, Field, ErrorMessage,FormikHelpers } from 'formik';
import * as Yup from 'yup';

 
export interface FormValues {
  userId: string;
  title: string;
  body: string;
}

const initialValues: FormValues = {
  userId: '',
  title: '',
  body: '',
};
interface PrivateProps {
  onSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => void;
}

const validationSchema = Yup.object({
  userId: Yup.number().required('User ID is required'),
  title: Yup.string().required('Title is required'),
  body: Yup.string().required('Body is required'),
});

const Private: React.FC<PrivateProps> = ({ onSubmit }) => {
	
  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
									<Formik initialValues={initialValues} validationSchema={validationSchema} 
									onSubmit={onSubmit}>
									{({ isSubmitting }) => (
									<Form>
										<div className="mb-3">
											<label htmlFor="userId" className="form-label">User ID</label>
											<Field type="text" className="form-control" id="userId" name="userId" />
											<ErrorMessage name="userId" component="div" className="error" />
										</div>
										<div className="mb-3">
											<label htmlFor="title" className="form-label">Title</label>
											<Field type="text" className="form-control" id="title" name="title" />
											<ErrorMessage name="title" component="div" className="error" />
										</div>
										<div className="mb-3">
											<label htmlFor="body" className="form-label">Body</label>
											<Field as="textarea" className="form-control" id="body" name="body" />
											<ErrorMessage name="body" component="div" className="error" />
										</div>
										<button type="submit" className="btn btn-primary"  disabled={isSubmitting}>Submit</button>
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

export default Private;
