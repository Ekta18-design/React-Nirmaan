
import React, { FC } from 'react'


const AgreementMaster: FC = () => {
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
													
														<label className="fs-5 fw-semibold mb-2">Agreement Id</label>
														
														<input type="text" id="agreementid" className="form-control form-control-solid" placeholder="" name="agreementid" />
													
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Reference</label>
														
                            <textarea id="agreementreference" className="form-control form-control-solid" placeholder="" name="agreementreference">
														</textarea>
													
												</div>
                        </div>

                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Description</label>
														
														<textarea id="agreementdescription" className="form-control form-control-solid" placeholder="" name="agreementdescription">
														</textarea>
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Type</label>
														<input type="text" id="agreementtype" className="form-control form-control-solid" placeholder="" name="agreementtype" />
													
												</div>
                        </div>
                        
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Unit Id</label>
														
														<select id="unitid" className="form-select form-select-solid" name="unitid" >
														
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														</select>
													</div>
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Client Id</label>
														
                            <select id="clientid" className="form-select form-select-solid" name="clientid" >
														
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option>
														</select>
												</div>
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Date </label>
														
														<input type="text" id="agreementdate" className="form-control form-control-solid" placeholder="" name="agreementdate" />
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreeement Amount 1</label>
														
                            <input type="text" id="agreementamount1" className="form-control form-control-solid" placeholder="" name="agreementamount1" />
													</div>
													
                        </div>
                        <div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Amount 2</label>
														
														<input type="text" id="agreementamount2" className="form-control form-control-solid" placeholder="" name="agreementamount2" />
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Amount 3</label>
														
                            <input type="text" id="agreementamount3" className="form-control form-control-solid" placeholder="" name="agreementamount3" />
													</div>
													
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Payment 1</label>
														
														<input type="text" id="agreementpayment1" className="form-control form-control-solid" placeholder="" name="agreementpayment1" />
													</div>
                          <div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Payment 2</label>
														
                            <input type="text" id="agreementpayment2" className="form-control form-control-solid" placeholder="" name="agreementpayment2" />
													</div>
													
                        </div>
												<div className="row mb-5">
													
													<div className="col-md-6 fv-row">
													
														<label className="fs-5 fw-semibold mb-2">Agreement Payment 3</label>
														
														<input type="text" id="agreementpayment3" className="form-control form-control-solid" placeholder="" name="agreementpayment3" />
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
														<input className="form-check-input w-45px h-30px" type="checkbox" id="flexSwitchDefault" name="isdeleted" checked/>
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

export {AgreementMaster}
