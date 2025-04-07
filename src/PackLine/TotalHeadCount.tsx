import React, { useEffect, useState } from 'react'
import { uzeStore } from '../store/uzeStore'

export default function TotalHeadCount() {
    const headcount = uzeStore(s => s.headcount)
    const [headcountTotal,setHeadcountTotal] = useState(0)

   useEffect(() => {
    let totalHC = 0
    Object.values(headcount).forEach(line => {
        totalHC += line.size 
    })
    setHeadcountTotal(totalHC)
   }, [headcount])
   

  return (
    <h2 className='text-3xl'>TotalHeadCount: {headcountTotal}</h2>
  )
}
