import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UnitCategory {
  unitcategoryid: number;
  categoryname: string;
  categoryreferencename: string;
  isactive: boolean;
  isdeleted: boolean;
}

const validationSchema = Yup.object({
  categoryname: Yup.string().required('Category name is required'),
  categoryreferencename: Yup.string().required('Category reference name is required'),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
});

const UnitCategoryMaster: React.FC = () => {
  const [unitcategorystate, setUnitCategorys] = useState<UnitCategory[]>([]);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    axios.get('http://localhost:5001/unitcategorymaster')
      .then(response => {
        setUnitCategorys(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (values: UnitCategory, { resetForm }: any) => {
    try {
      const response = await fetch('http://localhost:5001/unitcategorymaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful response
      alert('Added Data Successfully!');
      setUnitCategorys([...unitcategorystate, values]);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding unit category');
    }
  };

  const handleEdit = (unitcategoryid?: number) => {
    if (unitcategoryid != null) {
      navigate(`/apps/localstorge-data/editunitcategorymaster/${unitcategoryid}`);
    } else {
      console.error('Unit Category ID is undefined or null');
    }
  };

  const handleDelete = (unitcategoryid?: number) => {
    if (unitcategoryid != null) {
      if (window.confirm('Are you sure you want to delete this unit category?')) {
        axios.delete(`http://localhost:5001/unitcategorymaster/${unitcategoryid}`)
          .then(() => {
            setUnitCategorys(unitcategorystate.filter(unitcategory => unitcategory.unitcategoryid !== unitcategoryid));
          })
          .catch(error => {
            console.error('There was an error deleting the unit category!', error);
          });
      }
    } else {
      console.error('Unit category ID is undefined or null');
    }
  };

  const initialValues: UnitCategory = {
    unitcategoryid: 0,
    categoryname: '',
    categoryreferencename: '',
    isactive: false,
    isdeleted: false,
  };

  return (
    <div className='card'>
      <div className='card-body'>
        {/* Form Section */}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
              <button type="submit" name="submit" className="btn btn-primary" disabled={isSubmitting}>
                Save  </button> 
            </Form>
          )}
        </Formik>

        {/* Table Section */}
        <div className="table-responsive mt-5">
          <table className='table align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-50px'>Unit Category Id</th>
                <th className='min-w-125px'>Unit Category Name</th>
                <th className='min-w-125px'>Unit Category Reference Name</th>
                <th className='min-w-100px'>Active</th>
                <th className='min-w-100px'>Deleted</th>
                <th className='min-w-125px' colSpan={2}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unitcategorystate.length > 0 ? (
                unitcategorystate.map(unitcategory => (
                  <tr key={unitcategory.unitcategoryid}>
                    <td>{unitcategory.unitcategoryid}</td>
                    <td>{unitcategory.categoryname}</td>
                    <td>{unitcategory.categoryreferencename}</td>
                    <td>{unitcategory.isactive ? 'Yes' : 'No'}</td>
                    <td>{unitcategory.isdeleted ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => handleEdit(unitcategory.unitcategoryid)} className='btn btn-primary btn-sm me-2'>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(unitcategory.unitcategoryid)} className='btn btn-danger btn-sm'>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnitCategoryMaster;
