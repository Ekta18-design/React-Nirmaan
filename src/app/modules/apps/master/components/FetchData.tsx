
import {KTCard} from '../../../../../_metronic/helpers'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
interface Address{
  street: string;
  suite: string;
  city: string;
  zipcode:string;
}
interface UserData {
  id: number;
  name: string;
  username: string;
  email:string;
  phone: string;
  address: Address;
}

const FetchData = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserData[]>('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                <th className='ps-4 min-w-50px '>Id</th>
                <th className='min-w-125px'>Name</th>
                <th className='min-w-125px'>User Name</th>
                <th className='min-w-125px'>Email</th>
                <th className='min-w-125px'>phone</th>
                <th className='min-w-200px'>Address</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {user.id}
                  </div>
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                {user.name}
                  </div>
                 </td>
                <td>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {user.username}
                  </div>
                </td>
                <td>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {user.email}
                  </div>
                </td>
                <td>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {user.phone}
                  </div>
                </td>
                <td>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                  {`${user.address.street}, ${user.address.suite}, ${user.address.city},
                   ${user.address.zipcode}`}
                  </div>
                </td>
                </tr>
              ))}
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
export default FetchData;
