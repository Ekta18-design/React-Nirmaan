import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Project, Building, UnitCategory, BuildingUnit } from '../../master/MasterPage';
import { useNavigate, useParams } from 'react-router-dom';

// Validation Schema using Yup
const validationSchema = Yup.object({
  projectid: Yup.string().required('Project ID is required'),
  buildingid: Yup.string().required('Building ID is required'),
  unitcategoryid: Yup.string().required('Unit Category ID is required'),
  unitshortname: Yup.string().required('Unit Short Name is required'),
  unitreferencename: Yup.string().required('Unit Reference is required'),
  unitarea: Yup.string().required('Unit Area is required'),
  unitareareference: Yup.string().required('Unit Area Reference is required'),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
});

const EditBuildingUnitMaster: React.FC = () => {
  const [buildingOptions, setBuildingOptions] = useState<Building[]>([]);
  const [unitCategories, setUnitCategories] = useState<UnitCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [initialValues, setInitialValues] = useState<BuildingUnit | null>(null);
  const { buildingunitid } = useParams<{ buildingunitid: string }>(); // Get the ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects and unit categories on component mount
    axios.get('http://localhost:5001/projectmaster')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));

    axios.get('http://localhost:5001/unitcategorymaster')
      .then(response => setUnitCategories(response.data))
      .catch(error => console.error('Error fetching unit categories:', error));

    // Fetch the existing building unit data if id is provided
    if (buildingunitid) {
      axios.get(`http://localhost:5001/buildingunitmaster/${buildingunitid}`)
        .then(response => {
          setInitialValues(response.data);
           // Fetch buildings based on the existing projectid
           if (response.data.projectid) {
            axios.get(`http://localhost:5001/buildingunitmaster/project/${response.data.projectid}/buildings`)
              .then(buildingResponse => {
                setBuildingOptions(buildingResponse.data);
              })
              .catch(error => {
                console.error("There was an error fetching the buildings!", error);
              });
          }
        })
        .catch(error => console.error('Error fetching building unit data:', error));
    }
  }, [buildingunitid]);

  const handleSubmit = async (values: BuildingUnit, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await axios.put(`http://localhost:5001/buildingunitmaster/${buildingunitid}`, values);
      if (response.status === 200) {
        alert('Building unit updated successfully!');
        resetForm();
        navigate('/apps/master/buildingunit-master'); // Redirect on successful update
      }
    } catch (error) {
      alert('There was an error updating the building unit. Please try again.');
      console.error('There was an error updating the building unit!', error);
    }
  };

  const handleCancel = () => {
    navigate('/apps/localstorge-data/buildingunitmasterdata'); // Redirect to another page on cancel
  };

  if (initialValues === null) {
    // Render a loading spinner or message while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
                      {({ isSubmitting, setFieldValue }) => (
                        <Form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework' noValidate>
                          <div className="row mb-5">
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Project Id</label>
                              <Field as="select" id="projectid" className="form-select form-select-solid" name="projectid"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                  const projectId = e.target.value;
                                  setFieldValue('projectid', projectId);

                                  // Fetch buildings based on selected project
                                  axios.get(`http://localhost:5000/buildingunitmaster/project/${projectId}/buildings`)
                                    .then(response => {
                                      setBuildingOptions(response.data);
                                      
                                    })
                                    .catch(error => {
                                      console.error("There was an error fetching the buildings!", error);
                                    });
                                }}>
                                <option value="">Select Project...</option>
                                {projects.map(project => (
                                  <option key={project.projectid} value={project.projectid}>
                                    {project.projectid} - {project.projectname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="projectid" component="div" className="text-danger" />
                            </div>
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Building Id</label>
                              <Field as="select" id="buildingid" className="form-select form-select-solid" name="buildingid">
                                <option value="">Select Building...</option>
                                {buildingOptions.map(building => (
                                  <option key={building.buildingid} value={building.buildingid}>
                                    {building.buildingid} - {building.buildingname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="buildingid" component="div" className="text-danger" />
                            </div>
                          </div>

                          <div className="row mb-5">
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Unit Category Id</label>
                              <Field as="select" id="unitcategoryid" className="form-select form-select-solid" name="unitcategoryid">
                                <option value="">Select Unit Category</option>
                                {unitCategories.map(category => (
                                  <option key={category.unitcategoryid} value={category.unitcategoryid}>
                                    {category.unitcategoryid} - {category.categoryname}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="unitcategoryid" component="div" className="text-danger" />
                            </div>
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Unit Short Name</label>
                              <Field type="text" id="unitshortname" className="form-control form-control-solid" placeholder="" name="unitshortname" />
                              <ErrorMessage name="unitshortname" component="div" className="text-danger" />
                            </div>
                          </div>

                          <div className="row mb-5">
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Unit Reference Name</label>
                              <Field as="textarea" id="unitreferencename" className="form-control form-control-solid" placeholder="" name="unitreferencename" />
                              <ErrorMessage name="unitreferencename" component="div" className="text-danger" />
                            </div>
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Unit Area</label>
                              <Field type="text" id="unitarea" className="form-control form-control-solid" placeholder="" name="unitarea" />
                              <ErrorMessage name="unitarea" component="div" className="text-danger" />
                            </div>
                          </div>

                          <div className="row mb-5">
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">Unit Area Reference</label>
                              <Field type="text" id="unitareareference" className="form-control form-control-solid" placeholder="" name="unitareareference" />
                              <ErrorMessage name="unitareareference" component="div" className="text-danger" />
                            </div>
                          </div>

                          <div className="row mb-5">
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">isActive</label>
                              <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                                <Field className="form-check-input w-45px h-30px" type="checkbox" id="isactive" name="isactive" />
                              </div>
                              <ErrorMessage name="isactive" component="div" className="text-danger" />
                            </div>
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">isDeleted</label>
                              <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                                <Field className="form-check-input w-45px h-30px" type="checkbox" id="isdeleted" name="isdeleted" />
                              </div>
                              <ErrorMessage name="isdeleted" component="div" className="text-danger" />
                            </div>
                          </div>

                          <div className="separator mb-8"></div>
                          <button type="submit" name="submit" className="btn btn-primary" disabled={isSubmitting}>
                            Update Building Unit
                          </button>
                          <button type="button" className="btn btn-secondary" style={{ marginLeft: '10px', backgroundColor: '#343a40', color: '#ffffff', border: '1px solid #343a40' }}
                            onClick={handleCancel} disabled={isSubmitting}> Cancel</button>
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
}

export default EditBuildingUnitMaster;
