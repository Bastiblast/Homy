import React, { MouseEventHandler, useState } from 'react'
import {uzeCPTSelection} from './uzeSelectedCPT'
import { uzeStore } from '../store/uzeStore'



export default function MultiSelectorBtn() {

const CPTtemplate = []
  const dataPick = uzeStore(s => s.dataPick)


  const CPTarray = dataPick ? dataPick.map(cpt =>{ 
    const regexe = /\d{2}:\d{2}/.exec(cpt[0])
  return [regexe[0],cpt[0]]
  }) : CPTtemplate

    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const updateCPTTracking = uzeCPTSelection(s => s.updateCPTTracking)

    const handleClick = (event: MouseEvent) => {
        updateCPTTracking(event)
    }

  return (
    <>
    {CPTarray.map((val,index) => {
        const isActive = CPTlist.includes(val[0]) ? "bg-green-500" : null
        console.log({CPTlist})
        return <button key={val+index}
        className={"btn btn-sm m-1 " + isActive}
        onClick={handleClick}
        >{val[0]}</button>
    })}
    </>
  )
}


