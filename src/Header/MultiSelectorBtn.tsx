import React, { MouseEventHandler, useState } from 'react'
import {uzeCPTSelection} from './uzeSelectedCPT'
const CPTarray = [
  "02:30","03:00","09:00","11:45","12:15","12:45","15:30","16:15","17:00","20:00","20:30","23:30","23:55"
]

export default function MultiSelectorBtn() {

    const [selectorList,SetSelectorList] = useState([])

    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const updateCPTTracking = uzeCPTSelection(s => s.updateCPTTracking)

    const handleClick = (event: MouseEvent) => {
        updateCPTTracking(event)
    }

  return (
    <>
    {CPTarray.map((val,index) => {
        const isActive = CPTlist.includes(val) ? "bg-green-500" : null
        return <button key={val+index}
        className={"btn btn-sm m-1 " + isActive}
        onClick={handleClick}
        >{val}</button>
    })}
    </>
  )
}


