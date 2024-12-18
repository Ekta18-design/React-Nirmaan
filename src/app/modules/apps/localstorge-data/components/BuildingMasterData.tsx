import { KTCard } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Builder, Project } from '../../master/MasterPage';

const BuildingMasterData: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingResponse = await fetch('http://localhost:5001/buildingmaster');
        const buildingsData = await buildingResponse.json();
        setBuildings(buildingsData);

        const builderResponse = await fetch('http://localhost:5001/buildermaster');
        const buildersData = await builderResponse.json();
        setBuilders(buildersData);

        const projectResponse = await fetch('http://localhost:5001/projectmaster');
        const projectsData = await projectResponse.json();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (buildingid: number) => {
    if (buildingid === undefined) return;
    try {
      const response = await fetch(`http://localhost:5001/buildingmaster/${buildingid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBuildings(prevBuildings => prevBuildings.filter(building => building.buildingid !== buildingid));
      } else {
        console.error('Error deleting Building');
      }
    } catch (error) {
      console.error('Error deleting Building:', error);
    }
  };

  const handleEdit = (buildingid: number) => {
    if (buildingid === undefined) return;
    navigate(`/apps/localstorge-data/editbuildingmaster/${buildingid}`);
  };

  const getBuilderName = (builderid: string) => {
    console.log('Builder ID:', builderid); // Debugging line
    const builder = builders.find(b => b.builderid.toString() === builderid);
    console.log('Found Builder:', builder); // Debugging line
    return builder ? builder.companyname : 'Unknown';
  };

  const getProjectName = (projectid: string) => {
    console.log('Project ID:', projectid); // Debugging line
    const project = projects.find(p => p.projectid.toString() === projectid);
    console.log('Found Project:', project); // Debugging line
    return project ? project.projectname : 'Unknown';
  };

  return (
    <>
      <KTCard>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Building Data</span>
          </h3>
        </div>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='ps-4 min-w-50px'>Building Id</th>
                  <th className='min-w-125px'>Building Name</th>
                  <th className='min-w-125px'>Builder's Company Name</th>
                  <th className='min-w-125px'>Project Name</th>
                  <th className='min-w-125px'>Building Site Address</th>
                  <th className='min-w-125px'>Building Description</th>
                  <th className='min-w-125px'>Building Reference Name</th>
                  <th className='min-w-125px'>Building Wing Name</th>
                  <th className='min-w-125px'>Building Area</th>
                  <th className='min-w-125px'>No. of Floors</th>
                  <th className='min-w-125px'>No. of Flats</th>
                  <th className='min-w-125px'>No. of Shops</th>
                  <th className='min-w-125px'>No. of Other Units</th>
                  <th className='min-w-125px'>No. of Parking</th>
                  <th className='min-w-125px'>Active</th>
                  <th className='min-w-125px'>Deleted</th>
                  <th className='min-w-125px' colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((building, index) => (
                  <tr key={index}>
                    <td>{building.buildingid}</td>
                    <td>{building.buildingname}</td>
                    <td>{getBuilderName(building.builderid.toString())}</td>
                    <td>{getProjectName(building.projectid.toString())}</td>
                    <td>{building.buildingsiteaddress}</td>
                    <td>{building.buildingdescription}</td>
                    <td>{building.buildingreferencename}</td>
                    <td>{building.buildingwingname}</td>
                    <td>{building.buildingarea}</td>
                    <td>{building.nooffloors}</td>
                    <td>{building.noofflats}</td>
                    <td>{building.noofshops}</td>
                    <td>{building.noofotherunits}</td>
                    <td>{building.noofparking}</td>
                    <td>{building.isactive ? 'Yes' : 'No'}</td>
                    <td>{building.isdeleted ? 'Yes' : 'No'}</td>
                    <td>
                      <button className='btn btn-primary btn-sm me-2'
                              onClick={() => handleEdit(building.buildingid)}> Edit </button>
                    </td>
                    <td>
                      <button className='btn btn-danger btn-sm'
                              onClick={() => handleDelete(building.buildingid)}> Delete </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </KTCard>
    </>
  );
};

export default BuildingMasterData;
