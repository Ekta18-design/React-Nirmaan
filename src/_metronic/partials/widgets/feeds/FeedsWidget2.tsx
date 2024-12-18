
import React from 'react'

type Props = {
  className: string
}

const FeedsWidget2: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      FeedsWidget 2
        {/* end::Body */}
    </div>
  )
}

export {FeedsWidget2}
