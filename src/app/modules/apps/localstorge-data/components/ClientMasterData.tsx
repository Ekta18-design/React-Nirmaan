
import {KTCard} from '../../../../../_metronic/helpers'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Client {
  clientid?: number;
  clientname: string;
  clientreferencename: string;
  clientaddress: string;
  clientphone: string;
  clientemail: string;
  clientpanno: string;
  clientpanphoto: string | null;
  clientaadharno: string;
  clientaadharphoto: string | null;
  isactive: boolean;
  isdeleted: boolean;
   
}

const ClientMasterData: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:5001/clientmaster')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleEdit = (clientid: number) => {
    navigate(`/apps/localstorge-data/editclientmaster/${clientid}`);
  };

  const handleDelete = (clientid: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      axios.delete(`http://localhost:5001/clientmaster/${clientid}`)
        .then(() => {
          setClients(clients.filter(client => client.clientid !== clientid));
        })
        .catch(error => {
          console.error('There was an error deleting the client!', error);
        });
    }
  };

 return(
    <>
      <KTCard>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Client Data</span>
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
                  <th className='ps-4 min-w-50px'>Client Id</th>
                  <th className='min-w-125px'>Client Name</th>
                  <th className='min-w-125px'>Client Reference Name</th>
                  <th className='min-w-125px'>Client Address</th>
                  <th className='min-w-125px'>Client Phone</th>
                  <th className='min-w-125px'>Client Email</th>
                  <th className='min-w-125px'>Client Pan No.</th>
                  <th className='min-w-125px'>Client Pan Photo</th>
                  <th className='min-w-125px'>Client Aadhar No.</th>
                  <th className='min-w-125px'>Client Aadhar Photo</th>
                  <th className='min-w-125px'>Active</th>
                  <th className='min-w-125px'>Deleted</th>
                  <th className='min-w-125px' colSpan={2}>Actions</th>
                </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
                {clients.length > 0 ? (
                  clients.map(client => (
                    <tr key={client.clientid}>
                      <td>{client.clientid}</td>
                      <td>{client.clientname}</td>
                      <td>{client.clientreferencename}</td>
                      <td>{client.clientaddress}</td>
                      <td>{client.clientphone}</td>
                      <td>{client.clientemail}</td>
                      <td>{client.clientpanno}</td>
                      <td>
                        {client.clientpanphoto && (
                          <img src={`http://localhost:5001/${client.clientpanphoto}`} alt="Client Pan Photo" style={{ width: '50px', height: '50px' }} />
                        )}
                      </td>
                      <td>{client.clientaadharno}</td>
                      <td>
                        {client.clientaadharphoto && (
                          <img src={`http://localhost:5001/${client.clientaadharphoto}`} 
                          alt="Client Aadhar Photo" style={{ width: '50px', height: '50px' }} />
                        )}
                      </td>
                       <td>{client.isactive ? 'Yes' : 'No'}</td>
                      <td>{client.isdeleted ? 'Yes' : 'No'}</td>
                      <td>
                        <button onClick={() => client.clientid && handleEdit(client.clientid)} className='btn btn-primary btn-sm me-2'>
                          Edit
                        </button>
                        </td>
                        <td>
                        <button onClick={() => client.clientid && handleDelete(client.clientid)} className='btn btn-danger btn-sm'>
                          Delete
                        </button>
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
      {/* begin::Body */}
      </KTCard>
    
    </>
  )
}
export default ClientMasterData;
