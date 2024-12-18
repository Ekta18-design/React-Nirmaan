
import React from 'react'

type Props = {
  className: string
}

const FeedsWidget4: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      FeedsWidget4
      {/* end::Body */}
    </div>
  )
}

export {FeedsWidget4}
