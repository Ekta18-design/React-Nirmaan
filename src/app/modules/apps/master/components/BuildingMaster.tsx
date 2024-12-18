
import React, { FC,useState,useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Builder,Project,Building } from '../MasterPage';



// Define the validation schema
const validationSchema = Yup.object({
  
  buildingname: Yup.string().required('Building Name is required'),
  builderid: Yup.string().required('Builder Id is required'),
  projectid: Yup.string().required('Project Id is required'),
  buildingsiteaddress: Yup.string().required('Building Site Address is required'),
  buildingdescription: Yup.string().required('Building Description is required'),
  buildingreferencename: Yup.string().required('Building Reference Name is required'),
  buildingwingname: Yup.string().required('Building Wing Name is required'),
  buildingarea: Yup.string().required('Building Area is required'),
  nooffloors: Yup.string().required('Number of Floors is required'),
  noofflats: Yup.string().required('Number of Flats is required'),
  noofshops: Yup.string().required('Number of Shops is required'),
  noofotherunits: Yup.string().required('Number of Other Units is required'),
  noofparking: Yup.string().required('Number of Parking is required'),
  isactive: Yup.boolean().required('Please select active status'),
  isdeleted: Yup.boolean().required('Please select delete status'),
	
});

interface BuildingMasterProps {
	builders: Builder[];
  projects: Project[];
  
	onSaveBuilding: (building: Building) => void;
}

const BuildingMaster:FC<BuildingMasterProps> = ({  onSaveBuilding }) => {
	const [builders, setBuilders] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedBuilder, setSelectedBuilder] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

	
  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildersResponse = await fetch('http://localhost:5001/buildermaster');
        const buildersData = await buildersResponse.json();
        setBuilders(buildersData);

        const projectsResponse = await fetch('http://localhost:5001/projectmaster');
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        console.log('Fetched Projects:', projectsData); // Debug statement
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

	useEffect(() => {
		if (selectedBuilder) {
			// Convert selectedBuilder to a number if needed
			const selectedBuilderId = Number(selectedBuilder);
	
			// Filter projects based on the selected builder ID
			const projectsForBuilder = projects.filter(project => project.builderid === selectedBuilderId);
			setFilteredProjects(projectsForBuilder);
			console.log('Filtered Projects:', projectsForBuilder); // Debug statement
		} else {
			setFilteredProjects(projects);
		}
	}, [selectedBuilder, projects]);

  const handleSubmit = async (values: Building, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await fetch('http://localhost:5001/buildingmaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

       // Check if the response is JSON
    if (!response.ok) {
      const errorText = await response.text(); // Get the raw response text
      console.error('Error response:', errorText); // Log raw response for debugging
      throw new Error('Failed to save building');
    }
      const result = await response.json();
      alert('Building added successfully');
      console.log(result.message);

      onSaveBuilding(values);
      resetForm();
    } catch (error) {
      alert('Error adding building');
      console.error('Error:', error);
    }
  };
	
	const initialValues: Building = {
		
		buildingname: '',
		builderid: '',
		projectid: '',
		buildingsiteaddress: '',
		buildingdescription: '',
		buildingreferencename: '',
		buildingwingname: '',
		buildingarea: '',
		nooffloors: '',
		noofflats: '',
		noofshops: '',
		noofotherunits: '',
		noofparking: '',
    isactive: false,
		isdeleted: false,
		
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
									
									{({ isSubmitting ,setFieldValue}) => (
											<Form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'  noValidate>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
													<label className="fs-5 fw-semibold mb-2">Building Name</label>
														
                            <Field type="text" id="buildingname" className="form-control form-control-solid"  name="buildingname" />
														<ErrorMessage name="buildingname" component="div" className="text-danger" />
													
													</div>
													
													</div>

                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Builder Id</label>
														
														<Field as="select" id="builderid" className="form-select form-select-solid" name="builderid" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
														const value = e.target.value; 
														setFieldValue('builderid', value);
														setSelectedBuilder(value);}} >
															<option value="">Select Builder</option>
                              {builders.map(builder => (
                                <option key={builder.builderid} value={builder.builderid}>
                                  {builder.builderid} - {builder.companyname}
                                </option>
                              ))}
                            </Field>					
															
                            <ErrorMessage name="builderid" component="div" className="text-danger" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Project Id</label>
														<Field as="select" id="projectid" className="form-select form-select-solid" name="projectid">
                              <option value="">Select Project</option>
															{filteredProjects.map(project => (
                                <option key={project.projectid} value={project.projectid}>
                                  {project.projectid} - {project.projectname}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="projectid" component="div" className="text-danger" />
														
												</div>
                        </div>
                        
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Building Site Address</label>
														
														<Field as="textarea" id="buildingsiteaddress" className="form-control form-control-solid" name="buildingsiteaddress"/>
														<ErrorMessage name="buildingsiteaddress" component="div" className="text-danger" />
														
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Building Description</label>
														
                            <Field as="textarea" id="buildingdescription" className="form-control form-control-solid" name="buildingdescription"/>
														<ErrorMessage name="buildingdescription" component="div" className="text-danger" />
												</div>
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Building Reference Name</label>
														
														<Field type="text" id="buildingreferencename" className="form-control form-control-solid" name="buildingreferencename" />
														<ErrorMessage name="buildingreferencename" component="div" className="text-danger" />
													
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Building Wing Name</label>
														
														<Field type="text" id="buildingwingname" className="form-control form-control-solid" name="buildingwingname" />
														<ErrorMessage name="buildingwingname" component="div" className="text-danger" />
														</div>
													
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Building Area</label>
														
														<Field type="text" id="buildingarea" className="form-control form-control-solid" name="buildingarea" />
														<ErrorMessage name="buildingarea" component="div" className="text-danger" />
													
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">No. Of Floors</label>
														
                            <Field type="text" id="nooffloors" className="form-control form-control-solid" placeholder="" name="nooffloors" />
														<ErrorMessage name="nooffloors" component="div" className="text-danger" />
														
													</div>
													
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">No.Of Flats</label>
														
														<Field type="text" id="noofflats" className="form-control form-control-solid" placeholder="" name="noofflats" />
														<ErrorMessage name="noofflats" component="div" className="text-danger" />
													
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">No. Of Shops</label>
														
                            <Field type="text" id="noofshops" className="form-control form-control-solid" placeholder="" name="noofshops" />
														<ErrorMessage name="noofshops" component="div" className="text-danger" />
														
													</div>
													
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">No. Of Other Units</label>
														
														<Field type="text" id="noofotherunits" className="form-control form-control-solid" placeholder="" name="noofotherunits" />
														<ErrorMessage name="noofotherunits" component="div" className="text-danger" />
													
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">No. Of Parking</label>
														
                            <Field type="text" id="noofparking" className="form-control form-control-solid" placeholder="" name="noofparking" />
														<ErrorMessage name="noofparking" component="div" className="text-danger" />
														
													</div>
													
                        </div>
                      
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isActive</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive"/>
														</div>
														<ErrorMessage name="isactive" component="div"   className="error" />
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isDeleted</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted"/>
														</div>
														<ErrorMessage name="isdeleted" component="div"   className="error" />
												</div>
                        </div>
                        <div className="separator mb-8"></div>
                        <button type="submit" name="submit" className="btn btn-primary" 
												disabled={isSubmitting}> Save </button>
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

export {BuildingMaster}
