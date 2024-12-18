import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Builder {
  builderid: number;
  companyname: string;
}

interface Project {
  projectid: number;
  builderid: number;
  projectname: string;
}

interface Building {
  buildingid: number;
  projectid: number;
  buildingname: string;
}

interface UnitCategory {
  unitcategoryid: number;
  categoryname: string;
}

interface Upload {
  uploadid: number;
  builderid?: string | null;
  projectid?: string | null;
  buildingid?: string | null;
  unitcategoryid?: string | null;
  documentfile: File | string | null;
  documenttitle: string;
  documentdescription: string;
  documenttags: string;
}

const validationSchema = Yup.object({
  documentfile: Yup.mixed().required('Document File is required'),
  documenttitle: Yup.string().required('Document Title is required'),
  documentdescription: Yup.string().required('Document Description is required'),
  documenttags: Yup.string().required('Document Tags are required'),
  projectid: Yup.string().nullable(), // Optional
  buildingid: Yup.string().nullable(), // Optional
  unitcategoryid: Yup.string().nullable(), // Optional
});

const EditUploadMaster: React.FC = () => {
  const { uploadid } = useParams<{ uploadid: string }>();
  const [upload, setUpload] = useState<Upload | null>(null);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [unitCategories, setUnitCategories] = useState<UnitCategory[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [selectedBuilder, setSelectedBuilder] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios.get<Upload>(`http://localhost:5001/uploadmaster/${uploadid}`)
      .then(response => {
        setUpload(response.data);
        setSelectedBuilder(response.data.builderid || '');
        setSelectedProject(response.data.projectid || '');
      })
      .catch(error => {
        console.error('There was an error fetching the upload data!', error);
      });

    axios.get<Builder[]>('http://localhost:5001/buildermaster')
      .then(response => setBuilders(response.data))
      .catch(error => console.error('Error fetching builders:', error));

    axios.get<Project[]>('http://localhost:5001/projectmaster')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));

    axios.get<Building[]>('http://localhost:5001/buildingmaster')
      .then(response => setBuildings(response.data))
      .catch(error => console.error('Error fetching buildings:', error));

    axios.get<UnitCategory[]>('http://localhost:5001/unitcategorymaster')
      .then(response => setUnitCategories(response.data))
      .catch(error => console.error('Error fetching unit categories:', error));
  }, [uploadid]);

  useEffect(() => {
    setFilteredProjects(
      projects.filter(project => project.builderid === parseInt(selectedBuilder))
    );
    setFilteredBuildings(
      buildings.filter(building => building.projectid === parseInt(selectedProject))
    );
  }, [selectedBuilder, selectedProject, projects, buildings]);

  const handleSubmit = async (values: Upload, { resetForm }: { resetForm: () => void }) => {
    try {
      const formData = new FormData();
      formData.append('builderid', values.builderid || '');
      formData.append('projectid', values.projectid || '');
      formData.append('buildingid', values.buildingid || '');
      formData.append('unitcategoryid', values.unitcategoryid || '');
      formData.append('documenttitle', values.documenttitle);
      formData.append('documentdescription', values.documentdescription);
      formData.append('documenttags', values.documenttags);

      if (values.documentfile && values.documentfile instanceof File) {
        formData.append('documentfile', values.documentfile);
      }

      await axios.put(`http://localhost:5001/uploadmaster/${uploadid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Upload updated successfully!');
      navigate('/apps/master/upload-master');
      resetForm();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error updating upload:', error);
      alert('Error updating upload');
    }
  }

  const handleCancel = () => {
    navigate('/apps/localstorge-data/uploadmasterdata');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      setFieldValue('documentfile', event.currentTarget.files[0]);
    }
  };

  const handleBuilderChange = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const builderId = event.currentTarget.value;
    setSelectedBuilder(builderId);
    setFieldValue('builderid', builderId);
    setFieldValue('projectid', ''); // Reset project and building selections
    setFieldValue('buildingid', '');
    setFilteredProjects(
      projects.filter(project => project.builderid === parseInt(builderId))
    );
    setFilteredBuildings([]); // Clear buildings
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const projectId = event.currentTarget.value;
    setSelectedProject(projectId);
    setFieldValue('projectid', projectId);
    setFieldValue('buildingid', '');
    setFilteredBuildings(
      buildings.filter(building => building.projectid === parseInt(projectId))
    );
  };

  if (!upload) return <div>Loading...</div>;

  const initialValues: Upload  = upload  || {
    uploadid: 0,
    builderid: null,
    projectid: null,
    buildingid: null,
    unitcategoryid: null,
    documentfile: null,
    documenttitle: '',
    documentdescription: '',
    documenttags: '',
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <Formik initialValues={initialValues} validationSchema={validationSchema}  onSubmit={handleSubmit}
          enableReinitialize={true} >
           {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className='flex-lg-row-fluid me-0'>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Builder</label>
                    <Field  as='select'  name='builderid' className='form-control form-control-solid'
                     onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleBuilderChange(event, setFieldValue)}>
                      <option value=''>Select Builder</option>
                      {builders.map(builder => (
                        <option key={builder.builderid} value={builder.builderid}>
                          {builder.builderid} - {builder.companyname}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name='builderid' component='div' className='text-danger' />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Project</label>
                    <Field as='select' name='projectid' className='form-control form-control-solid'
                       onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleProjectChange(event, setFieldValue)}>
                     <option value=''>Select Project</option>
                      {filteredProjects.map(project => (
                        <option key={project.projectid} value={project.projectid}>
                          {project.projectid} - {project.projectname}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name='projectid' component='div' className='text-danger' />
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Building</label>
                    <Field as='select' name='buildingid' className='form-control form-control-solid'>
                    <option value=''>Select Building</option>
                      {filteredBuildings.map(building => (
                        <option key={building.buildingid} value={building.buildingid}>
                          {building.buildingid} - {building.buildingname}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name='buildingid' component='div' className='text-danger' />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Unit Category</label>
                    <Field  as='select' name='unitcategoryid' className='form-control form-control-solid' >
                     <option value=''>Select Unit Category</option>
                      {unitCategories.map(category => (
                        <option key={category.unitcategoryid} value={category.unitcategoryid}>
                          {category.unitcategoryid} - {category.categoryname}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name='unitcategoryid' component='div' className='text-danger' />
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Document File</label>
                    <input type='file' name='documentfile'  className='form-control form-control-solid'
                       ref={fileInputRef}
                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event, setFieldValue)}/>
                     {upload.documentfile && typeof upload.documentfile === 'string' && (
                      <div>
                        {upload.documentfile.endsWith('.jpg') || upload.documentfile.endsWith('.png') || upload.documentfile.endsWith('.jpeg') ? (
                          <div>
                            <label>Existing File:</label>
                            <img src={upload.documentfile} alt="Uploaded document" style={{ width: '50px', height: '50px' }} />
                          </div>
                        ) : (
                          <div>
                            <label>Existing File:</label>
                            <a href={upload.documentfile} target="_blank" rel="noopener noreferrer">
                              View Document</a>
                          </div>
                        )}
                      </div>
                    )}
                    <ErrorMessage name='documentfile' component='div' className='text-danger' />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Document Title</label>
                    <Field  name='documenttitle'  type='text' className='form-control form-control-solid' />
                   <ErrorMessage name='documenttitle' component='div' className='text-danger' />
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Document Description</label>
                    <Field name='documentdescription'  type='text'  className='form-control form-control-solid'/>
                   <ErrorMessage name='documentdescription' component='div' className='text-danger' />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className='fs-5 fw-semibold mb-2'>Document Tags</label>
                    <Field  name='documenttags' type='text' className='form-control form-control-solid'/>
                   <ErrorMessage name='documenttags' component='div' className='text-danger' />
                  </div>
                </div>
                
                <div className="separator mb-8"></div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Update Upload
                </button>
                <button type="button" className="btn btn-secondary"
                  style={{ marginLeft: '10px', backgroundColor: '#343a40', color: '#ffffff', border: '1px solid #343a40' }} onClick={handleCancel} disabled={isSubmitting}>  Cancel </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUploadMaster;
