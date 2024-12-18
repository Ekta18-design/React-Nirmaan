import { KTCard } from '../../../../../_metronic/helpers';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Upload {
  uploadid?: number;
  builderid?: string;
  projectid?: string;
  buildingid?: string;
  unitcategoryid?: string;
  documentfile: string | null;
  documenttitle: string;
  documentdescription: string;
  documenttags: string;
}

export interface Builder {
  builderid: string;
  companyname: string;
}

export interface Project {
  projectid: string;
  projectname: string;
}

export interface Building {
  buildingid: string;
  buildingname: string;
}

export interface UnitCategory {
  unitcategoryid: string;
  categoryname: string;
}

const UploadMasterData: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [unitCategories, setUnitCategories] = useState<UnitCategory[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<Upload | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uploadsRes, buildersRes, projectsRes, buildingsRes, unitCategoriesRes] = await Promise.all([
          axios.get('http://localhost:5001/uploadmaster'),
          axios.get('http://localhost:5001/buildermaster'),
          axios.get('http://localhost:5001/projectmaster'),
          axios.get('http://localhost:5001/buildingmaster'),
          axios.get('http://localhost:5001/unitcategorymaster'),
        ]);

        setUploads(uploadsRes.data);
        setBuilders(buildersRes.data);
        setProjects(projectsRes.data);
        setBuildings(buildingsRes.data);
        setUnitCategories(unitCategoriesRes.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (uploadid: number) => {
    navigate(`/apps/localstorge-data/edituploadmaster/${uploadid}`);
  };

  const handleDelete = (uploadid: number) => {
    if (window.confirm('Are you sure you want to delete this upload?')) {
      axios.delete(`http://localhost:5001/uploadmaster/${uploadid}`)
        .then(() => {
          setUploads(uploads.filter(upload => upload.uploadid !== uploadid));
        })
        .catch(error => {
          console.error('There was an error deleting the upload!', error);
        });
    }
  };

  const openShareOptions = (upload: Upload) => {
    setCurrentUpload(upload);
    setShowShareOptions(true);
  };

  const handleShare = async (method: 'whatsapp' | 'email') => {
    if (!currentUpload) return;
  
    const fileUrl = currentUpload.documentfile || '';
    const title = currentUpload.documenttitle || '';
    const message = `Check out this document: ${title}\n${fileUrl}`;
  
    if (method === 'whatsapp') {
      const whatsappMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
    } else if (method === 'email') {
      try {
        // Send email via backend
        await axios.post('http://localhost:5001/email/send', {
          email: 'ektabackup1804@gmail.com', // Replace with dynamic email if needed
          subject: `Check out this file: ${title}`,
          message: `Here is the file you requested: ${fileUrl}`,
          fileUrl: fileUrl,
        });
        alert('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email:', error);
        alert('Failed to send email');
      }
    }
  };

  const getBuilderName = (builderid: string | undefined) => {
    const builder = builders.find(b => b.builderid === builderid);
    return builder ? builder.companyname : 'N/A';
  };

  const getProjectName = (projectid: string | undefined) => {
    const project = projects.find(p => p.projectid === projectid);
    return project ? project.projectname : 'N/A';
  };

  const getBuildingName = (buildingid: string | undefined) => {
    const building = buildings.find(b => b.buildingid === buildingid);
    return building ? building.buildingname : 'N/A';
  };

  const getCategoryName = (unitcategoryid: string | undefined) => {
    const category = unitCategories.find(c => c.unitcategoryid === unitcategoryid);
    return category ? category.categoryname : 'N/A';
  };

  return (
    <>
      <KTCard>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Upload Data</span>
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
                  <th className='ps-4 min-w-50px'>Upload Id</th>
                  <th className='min-w-125px'>Builder's Company Name</th>
                  <th className='min-w-125px'>Project Name</th>
                  <th className='min-w-125px'>Building Name</th>
                  <th className='min-w-125px'>Category Name</th>
                  <th className='min-w-125px'>Document File</th>
                  <th className='min-w-125px'>Document Title</th>
                  <th className='min-w-125px'>Document Description</th>
                  <th className='min-w-125px'>Document Tags</th>
                  <th className='min-w-125px' colSpan={4}>Actions</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {uploads.length > 0 ? (
                  uploads.map(upload => (
                    <tr key={upload.uploadid}>
                      <td>{upload.uploadid}</td>
                      <td>{getBuilderName(upload.builderid)}</td>
                      <td>{getProjectName(upload.projectid)}</td>
                      <td>{getBuildingName(upload.buildingid)}</td>
                      <td>{getCategoryName(upload.unitcategoryid)}</td>
                      <td>
                        {upload.documentfile ? (
                          upload.documentfile.endsWith('.jpg') || upload.documentfile.endsWith('.png') || upload.documentfile.endsWith('.jpeg') ? (
                            <img src={`http://localhost:5001/${upload.documentfile}`} alt="Document File" style={{ width: '50px', height: '50px' }}      
                            />
                          ) : (
                            <a href={`http://localhost:5001/${upload.documentfile}`} target="_blank" rel="noopener noreferrer">
                              View File </a>
                          )
                        ) : (
                          <span>No file available</span>
                        )}
                      </td>
                      <td>{upload.documenttitle}</td>
                      <td>{upload.documentdescription}</td>
                      <td>{upload.documenttags}</td>
                      <td>
                        <button onClick={() => upload.uploadid && handleEdit(upload.uploadid)}
                         className='btn btn-primary btn-sm me-2'>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => upload.uploadid && handleDelete(upload.uploadid)} className='btn btn-danger btn-sm me-2'>Delete</button>
                      </td>
                      <td>
                        {upload.documentfile && (
                          <button onClick={() => openShareOptions(upload)} 
                          className='btn btn-info btn-sm'>Share</button>
                        )}
                      </td>
                      <td>
                        {upload.documentfile ? (
                          <a href={upload.documentfile} download 
                          className='btn btn-success btn-sm'>  Download </a>
                        ) : (
                          <span>No file available</span>
                        )}
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

      {/* Share Options Modal */}
      {showShareOptions && currentUpload && (
        <div className='modal show d-block' tabIndex={-1} style={{ display: 'block' }}>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Share Options</h5>
                <button type='button' className='btn-close' onClick={() => setShowShareOptions(false)}>
                </button>
              </div>
              <div className='modal-body'>
                <p>Select how you want to share the document:</p>
                <button onClick={() => handleShare('whatsapp')} className='btn btn-info me-2'>
                Share via WhatsApp</button>
                <button onClick={() => handleShare('email')} className='btn btn-primary'>
                  Share via Email</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadMasterData;
