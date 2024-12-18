
import React from 'react'

type Props = {
  className: string
}

const ListsWidget5: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      ListWidget5
      {/* end: Card Body */}
    </div>
  )
}

export {ListsWidget5}
