
import {KTCard} from '../../../../../_metronic/helpers'
import {KTIcon} from '../../../../../_metronic/helpers'

type Props = {
  className: string
}


const TasksList:React.FC<Props>= ({className}) => {
 return(
    <>
      <KTCard>
      <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Data</span>
         
        </h3>
       
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-200px rounded-start'>Supervisor</th>
                <th className='min-w-125px'>Home State</th>
                <th className='min-w-125px'>Home District</th>
                <th className='min-w-125px'>Assigned State</th>
                <th className='min-w-125px'>Assigned District	</th>
                <th className='min-w-125px'>Assigned Task</th>
                <th className='min-w-125px'>Start Date</th>
                <th className='min-w-125px'>End Date</th>
                <th className='min-w-150px'>Status</th>
                <th className='min-w-200px rounded-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>
                  <div className='d-flex align-items-center'>
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    AAA
                  </div>
                  </div>
                </td>
                <td >
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    GGG
                  </div>
                 </td>
                   
                <td >
                  <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                  
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                </td>
                <td>
                <div className='text-gray-900 fw-bold d-block mb-1 fs-6'>
                    RRR
                  </div>
                </td>
                <td>
                  <span className='badge badge-light-success fs-7 fw-semibold'>isActive</span>
                </td>
                <td>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='switch' className='fs-3' />
                  </a>
                  <a
                    href='#'
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                  >
                    <KTIcon iconName='pencil' className='fs-3' />
                  </a>
                  <a href='#' className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                    <KTIcon iconName='trash' className='fs-3' />
                  </a>
                </td>
              </tr>
             
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>

      </KTCard>
    
    </>
  )
}

const TasksListWrapper = () => (
  
        <TasksList />
     
)

export {TasksListWrapper}
