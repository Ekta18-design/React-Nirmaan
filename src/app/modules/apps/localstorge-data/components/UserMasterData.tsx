
import {KTCard} from '../../../../../_metronic/helpers'
import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Userdata } from '../../master/components/UserMaster';// Import the Userdata type if needed

const UserMasterData: React.FC = () => {
  const [usersmasstate, setUsers] = useState<Userdata[]>([]);
  const navigate = useNavigate();

  
   // Fetch data from API
   useEffect(() => {
    // Fetch data from API
    axios
    .get('http://localhost:5001/usermaster')
    .then((response) => {
      setUsers(response.data);
    })
    .catch((error) => {
      console.error('There was an error fetching the data!', error);
    });
  }, []);

  const handleEdit = (userid?: number) => {
    if (userid != null) { // checks for both null and undefined
      navigate(`/apps/localstorge-data/editusermaster/${userid}`);
    } else {
      console.error('User ID is undefined or null');
    }
  };
  // Handle Delete
  const handleDelete = (userid?: number) => {
    if (userid != null) { // checks for both null and undefined
      if (window.confirm('Are you sure you want to delete this user?')) {
        axios.delete(`http://localhost:5001/usermaster/${userid}`)
          .then(() => {
            setUsers(usersmasstate.filter(user => user.userid !== userid));
          })
          .catch(error => {
            console.error('There was an error deleting the user!', error);
          });
      }
    } else {
      console.error('User ID is undefined or null');
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
                <th className='ps-4 min-w-50px '>User Id</th>
                <th className='min-w-125px'>User Name</th>
                <th className='min-w-125px'>User First Name</th>
                <th className='min-w-125px'>User Last Name</th>
                <th className='min-w-125px'>User Email</th>
                <th className='min-w-125px'>User phone</th>
                <th className='min-w-125px'>User Password</th>
                <th className='min-w-125px'>User Confirm Password</th>
                <th className='min-w-100px'>Role</th>
                <th className='min-w-100px'>Active</th>
                <th className='min-w-100px'>Deleted</th>
                <th className='min-w-125px' colSpan={2}>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                {usersmasstate.length > 0 ? (
                  usersmasstate.map(user => (
                    <tr key={user.userid}>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.userid}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.username}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_firstname}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_lastname}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_email}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_phone}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_password}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.user_confirmpassword}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                          {user.role}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                        {user.isactive ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                        {user.isdeleted ? 'Yes' : 'No'}
                        </div>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(user.userid)} className='btn btn-primary btn-sm me-2'>
                          Edit
                        </button>
                        </td>
                        <td>
                        <button onClick={() => handleDelete(user.userid)} className='btn btn-danger btn-sm'>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11}>No data available</td>
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
export default UserMasterData;
