import React, { PropsWithChildren } from 'react'

export default function Loader(props: PropsWithChildren) {
    const children = props.children
  return (
    <div className='flex justify-center items-center h-full'><span className='mx-10'>{children}</span><span className="loading loading-spinner loading-xl"></span></div>
  )
}
