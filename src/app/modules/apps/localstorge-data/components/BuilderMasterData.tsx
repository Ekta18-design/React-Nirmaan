import { KTCard } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Builder {
  builderid?: number;
  userid: string;
  companyname: string;
  companylogo: string | null; // The logo will be stored as a base64 string
  companyestyear: string;
  headofficephone: string;
  companydescription: string;
  headofficeaddress: string;
  headofficeemail: string;
  alternateofficeemail: string;
  alternateofficephone: string;
  alternateofficeaddress: string;
  isactive: boolean;
  isdeleted: boolean;
}

export interface Userdata {
  userid: string;
  username: string;
  // Other user-related fields
}

const BuilderMasterData: React.FC = () => {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [users, setUsers] = useState<Userdata[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
         // Fetch builder data without authentication headers
         const builderResponse = await axios.get('http://localhost:5001/buildermaster');
         setBuilders(builderResponse.data);
 
         // Fetch user data without authentication headers
         const userResponse = await axios.get('http://localhost:5001/usermaster');
         setUsers(userResponse.data);
  
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };
  
    fetchData();
  }, []);

  const handleEdit = (builderid: number) => {
    navigate(`/apps/localstorge-data/editbuildermaster/${builderid}`);
  };

  const handleDelete = (builderid: number) => {
    if (window.confirm('Are you sure you want to delete this builder?')) {
      axios.delete(`http://localhost:5001/buildermaster/${builderid}`)
        .then(() => {
          setBuilders(builders.filter(builder => builder.builderid !== builderid));
        })
        .catch(error => {
          console.error('There was an error deleting the builder!', error);
        });
    }
  };

  // Function to get username by userid
  const getUsernameByUserid = (userid: string) => {
    const user = users.find(user => user.userid === userid);
    return user ? user.username : 'Unknown User';
  };

  return (
    <>
      <KTCard>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Builder Data</span>
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
                  <th className='ps-4 min-w-50px'>Builder Id</th>
                  <th className='min-w-125px'>User Name</th>
                  <th className='min-w-125px'>Company Name</th>
                  <th className='min-w-125px'>Company Logo</th>
                  <th className='min-w-125px'>Company Est. Year</th>
                  <th className='min-w-125px'>Head Office Phone</th>
                  <th className='min-w-125px'>Company Description</th>
                  <th className='min-w-125px'>Head Office Address</th>
                  <th className='min-w-125px'>Head Office Email</th>
                  <th className='min-w-125px'>Alternate Office Email</th>
                  <th className='min-w-125px'>Alternate Office Phone</th>
                  <th className='min-w-125px'>Alternate Office Address</th>
                  <th className='min-w-125px'>isActive</th>
                  <th className='min-w-125px'>isDeleted</th>
                  <th className='min-w-125px' colSpan={2}>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {builders.length > 0 ? (
                  builders.map(builder => (
                    <tr key={builder.builderid}>
                      <td>{builder.builderid}</td>
                      <td>{getUsernameByUserid(builder.userid)}</td> {/* Display username */}
                      <td>{builder.companyname}</td>
                      <td>
                        {builder.companylogo && (
                          <img src={`http://localhost:5001/${builder.companylogo}`} alt="Company Logo" style={{ width: '50px', height: '50px' }} />
                        )}
                      </td>
                      <td>{builder.companyestyear}</td>
                      <td>{builder.headofficephone}</td>
                      <td>{builder.companydescription}</td>
                      <td>{builder.headofficeaddress}</td>
                      <td>{builder.headofficeemail}</td>
                      <td>{builder.alternateofficeemail}</td>
                      <td>{builder.alternateofficephone}</td>
                      <td>{builder.alternateofficeaddress}</td>
                      <td>{builder.isactive ? 'Yes' : 'No'}</td>
                      <td>{builder.isdeleted ? 'Yes' : 'No'}</td>
                      <td>
                        <button onClick={() => builder.builderid && handleEdit(builder.builderid)} className='btn btn-primary btn-sm me-2'>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => builder.builderid && handleDelete(builder.builderid)} className='btn btn-danger btn-sm'>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={17}>No data available</td>
                  </tr>
                )}
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* end::Body */}
      </KTCard>
    </>
  );
};

export default BuilderMasterData;
