
import { FC } from 'react'


type Props = {
  className: string
}

const FeedsWidget5: FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      FeedsWidget5
      {/* end::Body */}
    </div>
  )
}

export {FeedsWidget5}
