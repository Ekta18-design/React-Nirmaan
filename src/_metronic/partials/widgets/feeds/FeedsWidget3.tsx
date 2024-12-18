
import { FC } from 'react'

type Props = {
  className: string
}

const FeedsWidget3: FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      FeedsWidget3
      {/* end::Body */}
    </div>
  )
}

export {FeedsWidget3}
