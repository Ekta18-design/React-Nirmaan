
import React, { FC } from 'react'


const AgreementTemplates: FC = () => {
  return (
    <>
     <form className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'  noValidate id='kt_login_signup_form'>
     
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex flex-wrap flex-sm-nowrap'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap'>
                <div className='d-flex flex-column flex-column-fluid'>
                  <div className='flex-lg-row-fluid me-0'>
	
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Template Id</label>
														
														<input type="text" id="agreementtemplaateid" className="form-control form-control-solid" placeholder="" name="agreementtemplateid" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Template Name</label>
														
                            <input type="text" id="templatename" className="form-control form-control-solid" placeholder="" name="templatename" />
													
													
												</div>
                        </div>

                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Template Code</label>
														
                            <input type="text" id="templatecode" className="form-control form-control-solid" placeholder="" name="templatecode" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Template File Path</label>
														<input type="text" id="templatefilepath" className="form-control form-control-solid" placeholder="" name="templatefilepath" />
													
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
												
													<span className="indicator-label">Save</span>
													
												</button>
                        
                </div>

              </div>

            </div>
          </div>

          
        </div>
      </div>
      </div>
      </form>
     
    </>
  );
}

export {AgreementTemplates}
