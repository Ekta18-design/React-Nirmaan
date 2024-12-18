
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Builder,Project } from '../MasterPage';
import DatePickerField from './DatePickerField' // Import the DatePickerField component

const validationSchema = Yup.object({
  
  builderid: Yup.string().required('Builder ID is required'),
  projectname: Yup.string().required('Project Name is required'),
  projectstartdate: Yup.date().required('Project Start Date is required').typeError('Invalid date format'),
  projectenddate: Yup.date().required('Project End Date is required').typeError('Invalid date format'),
  projectarea: Yup.string().required('Project Area is required'),
  projectsiteaddress: Yup.string().required('Project Site Address is required'),
  surveyno: Yup.string().required('Survey No is required'),
  hissano: Yup.string().required('Hissa No is required'),
    isactive: Yup.boolean().required('Please select active status'),
    isdeleted: Yup.boolean().required('Please select delete status'),
	
});
interface ProjectMasterFormProps {
  builders: Builder[];
  onSaveProject: (project: Project) => void;
}

const ProjectMaster: React.FC<ProjectMasterFormProps> = ({ builders, onSaveProject })  => {

	const handleSubmit = async (values: Omit<Project, 'projectid'>, { resetForm }: { resetForm: () => void }) => {
    try {
      // Send a POST request to your API to save the project
      const response = await fetch('http://localhost:5001/projectmaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const savedProject = await response.json();
        // Call the onSaveProject prop with the saved project, including its ID from the database
        onSaveProject(savedProject);
				// Show success alert
				alert('Project added successfully');

        // Reset form
        resetForm();
      } else {
				// Show error alert if the response is not OK
				alert('Error saving project');
        console.error('Error saving project');
      }
    } catch (error) {
			// Show error alert if there is an exception
			alert('Error saving project');
      console.error('Error saving project:', error);
    }
  };

  const initialValues: Omit<Project, 'projectid'> = {
    builderid: '',
    projectname: '',
    projectstartdate: '',
    projectenddate: '',
    projectarea: '',
    projectsiteaddress: '',
    surveyno: '',
    hissano: '',
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
									
									{({ isSubmitting }) => (
											<Form>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
													<label className="fs-5 fw-semibold mb-2">Builder Id</label>
														
														<Field as="select" id="builderid" className="form-select form-select-solid" name="builderid" >
														<option value="">Select Builder</option>
															{builders.map(builder => (
																<option key={builder.builderid} value={builder.builderid}>
																	{builder.builderid},{builder.companyname}</option>
															))}
														</Field>
														<ErrorMessage name="builderid" component="div" className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
													<label className="fs-5 fw-semibold mb-2">Project Name</label>
														
														<Field type="text" id="projectname" className="form-control form-control-solid"  name="projectname" />
														<ErrorMessage name="projectname" component="div" className="error" />
														</div>
														</div>
 <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													<label className="fs-5 fw-semibold mb-2"></label>
													<DatePickerField name="projectstartdate" label="Project Start Date" />
                          </div>
													
													<div className="col-md-6 fv-row">
													<label className="fs-5 fw-semibold mb-2"></label>
													<DatePickerField name="projectenddate" label="Project End Date"/>	
													</div>	
												
												</div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Project Area</label>
														
														<Field as="textarea" id="projectarea" className="form-control form-control-solid" placeholder="" name="projectarea" />
														<ErrorMessage name="projectarea" component="div" className="error" />
													
														</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Project Site Address</label>
														
                            <Field as="textarea" id="projectsiteaddress" className="form-control form-control-solid" placeholder="" name="projectsiteaddress" />
														
														<ErrorMessage name="projectsiteaddress" component="div" className="error" />
														
												</div>
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Survey No.</label>
														
														<Field type="text" id="surveyno" className="form-control form-control-solid" placeholder="" name="surveyno" />
														<ErrorMessage name="surveyno" component="div" className="error" />
													
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Hissa No.</label>
														
														<Field type="text" id="hissano" className="form-control form-control-solid" placeholder="" name="hissano" />
														<ErrorMessage name="hissano" component="div" className="error" />
													
													</div>
													
                        </div>
                        
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isActive</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive" />
														
														</div>
														<ErrorMessage name="isactive" component="div"   className="error" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">isDeleted</label>
														
														<div className="form-check form-check-solid form-switch form-check-custom fv-row">
														<Field className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted"  />
														</div>
														<ErrorMessage name="isdeleted" component="div"   className="error" />
												</div>
                        </div>
                        <div className="separator mb-8"></div>
                        <button type="submit" name="submit" className="btn btn-primary"  
												disabled={isSubmitting}> save </button>
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

export default ProjectMaster;
