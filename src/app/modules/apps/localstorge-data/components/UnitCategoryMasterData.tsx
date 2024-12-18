
import {KTCard} from '../../../../../_metronic/helpers'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UnitCategory } from '../../master/MasterPage';

const UnitCategoryMasterData: React.FC = () => {
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

const handleEdit = (unitcategoryid?: number) => {
  if (unitcategoryid != null) { // checks for both null and undefined
    navigate(`/apps/localstorge-data/editunitcategorymaster/${unitcategoryid}`);
  } else {
    console.error('Unit Category ID is undefined or null');
  }
};
// Handle Delete
const handleDelete = (unitcategoryid?: number) => {
  if (unitcategoryid != null) { // checks for both null and undefined
    if (window.confirm('Are you sure you want to delete this unitcategory?')) {
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

 return(
    <>
      <KTCard>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Data</span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-50px '>Unit Category Id</th>
                <th className='min-w-125px'>Unit Category Name</th>
                <th className='min-w-125px'>Unit Category Reference Name</th>
                <th className='min-w-100px'>Active</th>
                <th className='min-w-100px'>Deleted</th>
                <th className='min-w-125px' colSpan={2}>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                {unitcategorystate.length > 0 ? (
                  unitcategorystate.map(unitcategory => (
                    <tr key={unitcategory.unitcategoryid}>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {unitcategory.unitcategoryid}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {unitcategory.categoryname}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {unitcategory.categoryreferencename}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                        {unitcategory.isactive ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                        {unitcategory.isdeleted ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(unitcategory.unitcategoryid)} className='btn btn-primary btn-sm me-2'>
                          Edit
                        </button>
                        </td>
                        <td>
                        <button onClick={() => handleDelete(unitcategory.unitcategoryid)} className='btn btn-danger btn-sm'>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No data available</td>
                  </tr>
                )}
              </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
      </KTCard>
    
    </>
  )
}
export default UnitCategoryMasterData;
