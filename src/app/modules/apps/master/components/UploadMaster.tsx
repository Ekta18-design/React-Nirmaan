import React, { FC, useState, useEffect, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage,FormikHelpers} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface Upload {
  uploadid: number;
  builderid?: string;
  projectid?: string;
  buildingid?: string;
  unitcategoryid?: string;
  documentfile: File | null;
  documenttitle: string;
  documentdescription: string;
  documenttags: string;
}

interface Builder {
  builderid: number;
  companyname: string;
}

interface Project {
  projectid: number;
  builderid: number; // Added builderid to link project to builder
  projectname: string;
}

interface Building {
  buildingid: number;
  projectid: number; // Added projectid to link building to project
  buildingname: string;
}

interface UnitCategory {
  unitcategoryid: number;
  categoryname: string;
}

interface UploadMasterProps {
  builders: Builder[];
  projects: Project[];
  buildings: Building[];
  unitCategories: UnitCategory[];
  onSaveUpload: (upload: Upload) => void;
}

const validationSchema = Yup.object({
  documentfile: Yup.mixed()
  .required('Document File is required')
  .test('fileFormat', 'Unsupported File Format', value => {
    if (value) {
      return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
    }
    return false;
  }),
  documenttitle: Yup.string().required('Document Title is required'),
  documentdescription: Yup.string().required('Document Description is required'),
  documenttags: Yup.string().required('Document Tags are required'),
  projectid: Yup.string(), // Optional
  buildingid: Yup.string(), // Optional
  unitcategoryid: Yup.string(),
});

const UploadMaster: FC<UploadMasterProps> = ({
  builders,
  projects,
  buildings,
  unitCategories,
  onSaveUpload,
}) => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [selectedBuilder, setSelectedBuilder] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialValues: Upload = {
    uploadid: 0,
    builderid: '',
    projectid: '',
    buildingid: '',
    unitcategoryid: '',
    documentfile: null,
    documenttitle: '',
    documentdescription: '',
    documenttags: '',
  };

  const handleSubmit = ( values: Upload,
    { resetForm }: FormikHelpers<Upload>) => {
    const formData = new FormData();
    formData.append('builderid', values.builderid || '');
    formData.append('projectid', values.projectid || '');
    formData.append('buildingid', values.buildingid || '');
    formData.append('unitcategoryid', values.unitcategoryid || '');
    formData.append('documenttitle', values.documenttitle);
    formData.append('documentdescription', values.documentdescription);
    formData.append('documenttags', values.documenttags);
  
    if (values.documentfile) {
      formData.append('documentfile', values.documentfile);
    }
  
    console.log('Form Data:', formData); // Log form data for debugging
  
    axios
      .post('http://localhost:5001/uploadmaster', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        alert('Form submitted successfully');
        onSaveUpload(values);
        resetForm();
  
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((error) => {
        console.error('There was an error submitting the form!', error);
      });
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setFieldValue('documentfile', file);
      } else {
        alert('Unsupported file format. Please upload JPG, PNG, or PDF files only.');
        event.currentTarget.value = ''; // Clear the file input
      }
    }
  };

  const handleBuilderChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const builderId = event.currentTarget.value;
    setSelectedBuilder(builderId);
    setFieldValue('builderid', builderId);
    setFieldValue('projectid', ''); // Reset project and building selections
    setFieldValue('buildingid', '');
    setFilteredProjects(
      projects.filter((project) => project.builderid === parseInt(builderId))
    );
    setFilteredBuildings([]); // Clear buildings
  };

  const handleProjectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const projectId = event.currentTarget.value;
    setSelectedProject(projectId);
    setFieldValue('projectid', projectId);
    setFieldValue('buildingid', '');
    setFilteredBuildings(
      buildings.filter((building) => building.projectid === parseInt(projectId))
    );
  };

  useEffect(() => {
    // Initialize filtered projects and buildings when the component mounts
    setFilteredProjects(
      projects.filter((project) => project.builderid === parseInt(selectedBuilder))
    );
    setFilteredBuildings(
      buildings.filter((building) => building.projectid === parseInt(selectedProject))
    );
  }, [selectedBuilder, selectedProject, projects, buildings]);

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, setFieldValue }) => (
                        <Form
                          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
                          noValidate
                        >
                          <div className='row mb-5'>
                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>Builder</label>
                               <Field as='select'  name='builderid' className='form-control form-control-solid'
                                 onChange={(event) =>
                                  handleBuilderChange(event, setFieldValue)
                                }>
                                <option value=''>Select Builder</option>
                                {builders.map((builder) => (
                                  <option
                                    key={builder.builderid}
                                    value={builder.builderid}
                                  >
                                    {builder.builderid} - {builder.companyname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name='builderid' component='div' className='text-danger'/>
                              </div>

                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'> Project</label>
                                <Field as='select'  name='projectid' className='form-control form-control-solid'  onChange={(event) =>
                                  handleProjectChange(event, setFieldValue)
                                }
                              >
                               <option value=''>Select Project</option>
                                {filteredProjects.map((project) => (
                                  <option  key={project.projectid} value={project.projectid}>
                                     {project.projectid} - {project.projectname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage  name='projectid'  component='div'  className='text-danger' />
                               </div>
                          </div>

                          <div className='row mb-5'>
                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>Building </label>
                              <Field as='select'  name='buildingid'
                                className='form-control form-control-solid'
                               >
                                <option value=''>Select Building</option>
                                {filteredBuildings.map((building) => (
                                  <option
                                    key={building.buildingid}
                                    value={building.buildingid}
                                  >
                                    {building.buildingid} - {building.buildingname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name='buildingid'
                                component='div'
                                className='text-danger'
                              />
                            </div>

                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>
                                Unit Category
                              </label>
                              <Field
                                as='select'
                                name='unitcategoryid'
                                className='form-control form-control-solid'
                              >
                                <option value=''>Select Unit Category</option>
                                {unitCategories.map((unitCategory) => (
                                  <option
                                    key={unitCategory.unitcategoryid}
                                    value={unitCategory.unitcategoryid}
                                  >
                                    {unitCategory.unitcategoryid} - {unitCategory.categoryname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name='unitcategoryid'
                                component='div'
                                className='text-danger'
                              />
                            </div>
                          </div>

                          <div className='row mb-5'>
                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>Document File</label>
                               <input  type='file' id='documentfile'  name='documentfile'
                                className='form-control form-control-solid'
                                   ref={fileInputRef} // Attach the ref to the input 
                                  onChange={(event) => handleFileChange(event, setFieldValue)}
                                    accept=".jpg, .jpeg, .png, .pdf" // Acceptable file types
                                  />  
                                <ErrorMessage name='documentfile' component='div' className='text-danger'/>
                                </div>

                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>  Document Title </label>
                               <Field type='text' name='documenttitle' 
                               className='form-control form-control-solid'/>
                                 
                              <ErrorMessage name='documenttitle' component='div' className='text-danger' />
                             </div>
                          </div>

                          <div className='row mb-5'>
                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>  Document Description </label>
                               <Field type='text'  name='documentdescription'
                                className='form-control form-control-solid'/>
                               
                              <ErrorMessage  name='documentdescription' component='div' className='text-danger' />
                               </div>

                            <div className='col-md-6 fv-row'>
                              <label className='fs-5 fw-semibold mb-2'>
                                Document Tags
                              </label>
                              <Field
                                type='text'
                                name='documenttags'
                                className='form-control form-control-solid'
                              />
                              <ErrorMessage
                                name='documenttags'
                                component='div'
                                className='text-danger'
                              />
                            </div>
                          </div>

                          <div className='separator mb-8'></div>
                          <button
                            type='submit'
                            className='btn btn-primary'
                            disabled={isSubmitting}
                          >
                            Save
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { UploadMaster };
