import React, { useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Project, Building, UnitCategory, BuildingUnit } from '../MasterPage';

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

interface BuildingUnitMasterFormProps {
  projects: Project[];
  unitcategorys: UnitCategory[];
  onSaveBuildingUnit: (buildingunit: BuildingUnit) => void;
}

const BuildingUnitMaster: React.FC<BuildingUnitMasterFormProps> = ({ projects, unitcategorys, onSaveBuildingUnit }) => {
  const [buildingOptions, setBuildingOptions] = useState<Building[]>([]);

  const initialValues: BuildingUnit = {
    buildingunitid: 0,
    projectid: '',
    buildingid: '',
    unitcategoryid: '',
    unitshortname: '',
    unitreferencename: '',
    unitarea: '',
    unitareareference: '',
    isactive: false,
    isdeleted: false,
  };

  // Function to handle form submission
  const handleSubmit = async (values: BuildingUnit, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await axios.post('http://localhost:5001/buildingunitmaster', values);
      if (response.status === 201) {
        onSaveBuildingUnit(values); // Callback to parent or any additional logic
        resetForm(); // Reset the form after successful submission
        alert('Building unit added successfully!');
      }
    } catch (error) {
      alert('There was an error saving the building unit. Please try again.');
      console.error('There was an error saving the building unit!', error);
    }
  };

  return (
    <>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                                  axios.get(`http://localhost:5001/buildingunitmaster/project/${projectId}/buildings`)
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
                                {unitcategorys.map(category => (
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
                                <Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive" />
                              </div>
                              <ErrorMessage name="isactive" component="div" className="error" />
                            </div>
                            <div className="col-md-6 fv-row">
                              <label className="fs-5 fw-semibold mb-2">isDeleted</label>
                              <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                                <Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted" />
                              </div>
                              <ErrorMessage name="isdeleted" component="div" className="error" />
                            </div>
                          </div>

                          <div className="separator mb-8"></div>
                          <button type="submit" name="submit" className="btn btn-primary" disabled={isSubmitting}>
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
}

export default BuildingUnitMaster;
