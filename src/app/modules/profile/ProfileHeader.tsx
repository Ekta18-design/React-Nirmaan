
import React from 'react'

const ProfileHeader: React.FC = () => {
  

  return (
    <>
     <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      ></form>
    
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body pt-9 pb-0'>
          <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
            <div className='flex-grow-1'>
              <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                <div className='d-flex flex-column'>
                  <div className='d-flex align-items-center mb-2'>
                    <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                      Max Smith
                    </a>
                    
                  </div>

                  
                </div>

               
              </div>

              
            </div>
          </div>

          
        </div>
      </div>
    </>
  )
}

export {ProfileHeader}
