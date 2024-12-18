
import {FC} from 'react'

const Group: FC = () => {
  return (
    <>
    
      <div className='d-flex flex-column flex-lg-row'>
        <div className='flex-column flex-lg-row flex-column-fluid'>
          <div className='card card-flush'>
           
            <div className='card-body' id='kt_chat_contacts_body'>
            <form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'  noValidate id='kt_login_signup_form'>
     
               <div className='flex-lg-row-fluid me-0'>
	
                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Select Supervisor</label>
                    
                    <select className="form-control form-control-solid" id="selectsupervisor" aria-label="Select example" name="selectsupervisor">
                              
                                <option value="1">1</option>
                                <option value="2">2</option>
                                
                              </select>
                  </div>
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign Project</label>
                    
                    <input type="text" id="assignproject" className="form-control form-control-solid" placeholder="" name="assignproject" />
                    
                </div>
                </div>

                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign PC</label>
                    
                    <input type="text" id="assignpc" className="form-control form-control-solid" placeholder="" name="assignpc" />
                  
                  </div>
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign Vendor</label>
                    
                    <input type="text" id="assignvendor" className="form-control form-control-solid" placeholder="" name="assignvendor" />
                    
                </div>
                </div>
                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign State</label>
                    <select className="form-control form-control-solid" id="assignstate" aria-label="Select example" name="assignstate">
                              
                                <option value="G">G</option>
                                <option value="M">M</option>
                                
                              </select>
                  </div>
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign District</label>
                    
                    <select className="form-control form-control-solid" id="assigndistrict" aria-label="Select example" name="assigndistrict">
                              
                              <option value="L">L</option>
                              <option value="K">K</option>
                              
                            </select>
                    
                </div>
                </div>
                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Assign Task Type</label>
                    
                    <select className="form-control form-control-solid" id="assigntasktype" aria-label="Select example" name="assigntasktype">
                              
                              <option value="M">M</option>
                              <option value="N">N</option>
                              
                            </select>
                  </div>
                  
                </div>
                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">Start Date</label>
                    
                    <input type="date" id="startdate" name="startdate" />
                  </div>
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">End Date</label>
                    <input type="date" id="enddate" name="enddate" />
                </div>
                </div>
                
                <div className="row mb-5">
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">isActive</label>
                    
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                    <input className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isactive"/>
                    </div>
                  
                  </div>
                  
                  <div className="col-md-6 fv-row">
                  
                    <label className="fs-5 fw-semibold mb-2">isDeleted</label>
                    
                    <div className="form-check form-check-solid form-switch form-check-custom fv-row">
                    <input className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted"/>
                    </div>
                  
                </div>
                </div>
                <div className="separator mb-8"></div>
                <button type="submit" name="submit" className="btn btn-primary" id="">
                
                  <span className="indicator-label">Submit</span>
                  
                </button>
                
              </div>
              </form>
            </div>
            <div className="card-header card-header-stretch">
									
									<div className="card-title">
										<h3 className="m-0 text-gray-800">Standard Allowance</h3>
									</div>
								
								</div>
                <div id="kt_referred_users_tab_content" className="tab-content">
								
									<div id="kt_referrals_1" className="card-body p-0 tab-pane fade show active" role="tabpanel">
										<div className="table-responsive">
											
											<table className="table align-middle table-row-bordered table-row-solid gy-4 gs-9">
										
												<thead className="border-gray-200 fs-5 fw-semibold bg-lighten">
													<tr>
														<th className="min-w-150px ps-9">Project Name</th>
														<th className="min-w-175px ps-9">Start Date</th>
														<th className="min-w-175px ps-9">End Date</th>
														<th className="min-w-100px ps-9">isActive</th>
														<th className="min-w-100px ps-9">isDeleted</th>
													</tr>
												</thead>
										
												<tbody className="fs-6 fw-semibold text-gray-600">
													<tr>
														<td className="min-w-150px ps-9">AAA</td>
														<td className="min-w-175px ps-9">03-12-2022</td>
														<td className="min-w-175px ps-9">06-05-2024</td>
														
														<td className="min-w-100px ps-9">yes</td>
														<td className="min-w-100px ps-9">no</td>
													</tr>
													
												</tbody>
												
											</table>
										
										</div>
									</div>
									
								</div>
          </div>
        </div>

        
      </div>
     
     
    </>
  )
}

export {Group}
