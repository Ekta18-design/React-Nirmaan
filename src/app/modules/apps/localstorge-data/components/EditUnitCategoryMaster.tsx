import React , { useEffect, useState }from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UnitCategory } from '../../master/MasterPage';

const validationSchema = Yup.object({
  categoryname: Yup.string().required('Category name is required'),
  categoryreferencename: Yup.string().required('Category reference name is required'),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
});

const EditUnitCategoryMaster: React.FC = () => {
  const { unitcategoryid } = useParams();
  const [unitcategory, setUnitCategory] = useState<UnitCategory | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    axios.get(`http://localhost:5001/unitcategorymaster/${unitcategoryid}`)
      .then(response => {
        setUnitCategory(response.data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
        setLoading(false); // Set loading to false even if there is an error
      });
  }, [unitcategoryid]);

  // Handle form submission
  const handleSubmit = async (values: UnitCategory) => {
    try {
      await axios.put(`http://localhost:5001/unitcategorymaster/${unitcategoryid}`, values);
      alert('Unit Category updated successfully!');
      navigate('/apps/master/unitcategory-master');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating unit category');
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate('/apps/master/unitcategory-master');
  };

  // Render loading state
  if (loading) return <div>Loading...</div>;

  const initialValues: UnitCategory = unitcategory || {
    unitcategoryid: 0,
    categoryname: '',
    categoryreferencename: '',
    isactive: false,
    isdeleted: false,
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='d-flex flex-wrap flex-sm-nowrap'>
          <div className='flex-grow-1'>
            <div className='d-flex justify-content-between align-items-start flex-wrap'>
              <div className='d-flex flex-column flex-column-fluid'>
                <div className='flex-lg-row-fluid me-0'>
                  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true} // Reinitialize form when initialValues change
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="row mb-5">
                          <div className="col-md-6 fv-row">
                            <label className="fs-5 fw-semibold mb-2">Category Name</label>
                            <Field type="text" id="categoryname" className="form-control form-control-solid" name="categoryname" />
                            <ErrorMessage name="categoryname" component="div" className="error" />
                          </div>
                          <div className="col-md-6 fv-row">
                            <label className="fs-5 fw-semibold mb-2">Category Reference Name</label>
                            <Field type="text" id="categoryreferencename" className="form-control form-control-solid" name="categoryreferencename" />
                            <ErrorMessage name="categoryreferencename" component="div" className="error" />
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
                  Update Unit Category
                </button>
                 <button type="button" className="btn btn-secondary" style={{ marginLeft: '10px', backgroundColor: '#343a40',color: '#ffffff', border: '1px solid #343a40' }}
                  onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
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
  );
};

export default EditUnitCategoryMaster;
