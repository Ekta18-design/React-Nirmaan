
import React from 'react'

type Props = {
  className: string
}

const ListsWidget2: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      ListWidget2
      {/* end::Body */}
    </div>
  )
}

export {ListsWidget2}
