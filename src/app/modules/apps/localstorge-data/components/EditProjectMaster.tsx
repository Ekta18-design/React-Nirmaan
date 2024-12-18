import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Project } from '../../master/MasterPage';
import DatePickerField from '../../master/components/DatePickerField';

interface Builder {
  builderid: string;
  companyname: string;
}

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

const EditProjectMaster: React.FC = () => {
  const { projectid } = useParams();
  const [project, setProject] = useState<Project | null>(null); // Initialize as null
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/projectmaster/${projectid}`);
        setProject(response.data);
      } catch (error) {
        console.error('There was an error fetching the project data!', error);
        setError('Project not found');
      }
    };

    const fetchBuilders = async () => {
      try {
        const response = await axios.get('http://localhost:5001/buildermaster');
        setBuilders(response.data);
      } catch (error) {
        console.error('There was an error fetching the builders data!', error);
        setError('Error fetching builders data');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchProject();
      await fetchBuilders();
      setLoading(false);
    };

    fetchData();
  }, [projectid]);

  const handleSubmit = async (values: Project) => {
    try {
      await axios.put(`http://localhost:5001/projectmaster/${projectid}`, values);
      alert('Project updated successfully!');
      navigate('/apps/master/project-master');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const handleCancel = () => {
    navigate('/apps/localstorge-data/projectmasterdata');
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  const initialValues: Project = project || {
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
    <div className='card'>
      <div className='card-body'>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}
         enableReinitialize={true} // Reinitialize form when initialValues change
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='flex-lg-row-fluid me-0'>
                <div className="row mb-5">
                  <div className="col-md-6 fv-row">
                        <label className="fs-5 fw-semibold mb-2">Builder Id</label>
														<Field as="select" id="builderid" className="form-select form-select-solid" name="builderid" >
														<option value="">Select Builder</option>
															{builders.map(builder => (
																<option key={builder.builderid} value={builder.builderid}>{builder.builderid},{builder.companyname}</option>
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
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isactive" name="isactive" />
                    </div>
                    <ErrorMessage name="isactive" component="div" className="error" />
                  </div>
                  <div className="col-md-6 fv-row">
                    <label className="fs-5 fw-semibold mb-2">isDeleted</label>
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                      <Field className="form-check-input w-45px h-30px" type="checkbox" id="isdeleted" name="isdeleted" />
                    </div>
                    <ErrorMessage name="isdeleted" component="div" className="error" />
                  </div>
                </div>
                <div className="separator mb-8"></div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Update Project
                </button>
                 <button type="button" className="btn btn-secondary" style={{ marginLeft: '10px', backgroundColor: '#343a40',color: '#ffffff', border: '1px solid #343a40' }}
                  onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProjectMaster;
