import { KTCard } from '../../../../../_metronic/helpers'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // for redirecting
import { Project, Builder } from '../../master/MasterPage';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
};

const ProjectMasterData: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch data from API
    const fetchProjectsAndBuilders = async () => {
      try {
        const [projectResponse, builderResponse] = await Promise.all([
          fetch('http://localhost:5001/projectmaster'),
          fetch('http://localhost:5001/buildermaster')
        ]);

        const projectData = await projectResponse.json();
        const builderData = await builderResponse.json();
        setProjects(projectData);
        setBuilders(builderData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProjectsAndBuilders();
  }, []);

  const getBuilderCompanyName = (builderId: string) => { // Accept string since project.builderid is string
    const builder = builders.find(b => b.builderid === builderId);
    return builder ? builder.companyname : 'Unknown';
  };

  const handleDelete = async (projectid: number) => {
    if (projectid === undefined) return;
    try {
      const response = await fetch(`http://localhost:5001/projectmaster/${projectid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted project from the state
        setProjects(prevProjects => prevProjects.filter(project => project.projectid !== projectid));
      } else {
        console.error('Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (projectid: number) => {
    if (projectid === undefined) return; 
    navigate(`/apps/localstorge-data/editprojectmaster/${projectid}`); // Adjust the route as needed
  };

  return (
    <>
      <KTCard>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Project Data</span>
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
                  <th className='ps-4 min-w-50px'>Project Id</th>
                  <th className='min-w-125px'>Builder's Company Name</th>
                  <th className='min-w-125px'>Project Name</th>
                  <th className='min-w-125px'>Project Start Date</th>
                  <th className='min-w-125px'>Project End Date</th>
                  <th className='min-w-125px'>Project Area</th>
                  <th className='min-w-125px'>Project Site Address</th>
                  <th className='min-w-125px'>Survey No</th>
                  <th className='min-w-125px'>Hissa No</th>
                  <th className='min-w-125px'>Active</th>
                  <th className='min-w-125px'>Deleted</th>
                  <th className='min-w-125px' colSpan={2}>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {projects.length > 0 ? (
                  projects.map(project => (
                    <tr key={project.projectid}>
                      <td>{project.projectid}</td>
                      <td>{getBuilderCompanyName(project.builderid)}</td> {/* Show company name */}
                      <td>{project.projectname}</td>
                      <td>{formatDate(project.projectstartdate)}</td>
                      <td>{formatDate(project.projectenddate)}</td>
                      <td>{project.projectarea}</td>
                      <td>{project.projectsiteaddress}</td>
                      <td>{project.surveyno}</td>
                      <td>{project.hissano}</td>
                      <td>{project.isactive ? 'Yes' : 'No'}</td>
                      <td>{project.isdeleted ? 'Yes' : 'No'}</td>
                      <td>
                        <button   className='btn btn-primary btn-sm me-2' 
                        onClick={() => handleEdit(project.projectid)}> Edit </button>
                       </td>
                      <td>
                        <button className='btn btn-danger btn-sm'
                          onClick={() => handleDelete(project.projectid)} >Delete </button>
                       </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12}>No data available</td>
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

export default ProjectMasterData;
