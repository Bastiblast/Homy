import React, { useEffect, useState } from 'react'
import {uzeCPTSelection} from '../Header/uzeSelectedCPT'
import { uzeRodeo } from '../Header/uzeRodeo'
import { uzeStore } from '../store/uzeStore'
import RenderTote from './Tote'
import RenderBuffer from './Buffer'
import HeadCount from './HeadCount'
import AssociateInput from './AssociateInput'

export default function PackLine() {

    const posteMapping = uzeStore(s => s.singleLaneMapping)
    
    const getRodeoData = uzeRodeo(s => s.getRodeoData)

    useEffect(() => {
      getRodeoData()
    }, [])
    
    const day = uzeCPTSelection(s => s.day)
    const infoBoxRef = uzeStore(s => s.infoBoxRef)

    const headcount = uzeStore(s => s.headcount)
    const updateTotalHeadCount = uzeStore(s => s.updateTotalHeadCount)

    const valuesArray = Object.values(headcount)
    
    const newTotalHeadCount = valuesArray.reduce((acc,val) => acc + val.size,0)

    useEffect(() => {
      updateTotalHeadCount(newTotalHeadCount)

    }, [newTotalHeadCount])
    

  return (
    <>
    {
        Object.keys(posteMapping).map(ligne => {
         const lineNumber = ligne.substring(5,6)
        return (
        <div key={ligne} className='text-center'>
          <div className='flex flex-row justify-evenly'>
            <span className='font-bold'>{"Ligne " + lineNumber}</span> 
            <HeadCount headcount={headcount} ligne={"ligne" + lineNumber}/>
            {lineNumber === "3" ? <RenderBuffer dz={"dz-P-OB-Single-CartRunMove"} /> : <RenderBuffer dz={"dz-P-OB-Single-Line" + lineNumber} /> }
          </div>
        {
          Object.values(posteMapping[ligne]).map(poste => {
            return (
            <div className='flex flex-row shrink items-center bg-violet-400 p-1 m-1 justify-between rounded-md' key={"L1" + "-" + poste}>
              <div className='flex flex-row w-full items-center'>

                <span className='p-2 bg-lime-400 rounded-md'>{String(poste)}</span>
                <div className='flex flex-row'>

                <AssociateInput poste={poste} />
                </div>
                
                <div className='flex flex-row'>

                  <RenderTote dropzone={"ws_Singles_0" + poste} day={day} infoBoxRef={infoBoxRef}/>
                  <div className="divider divider-horizontal p-0 mx-0"></div>
                  <RenderTote dropzone={"dz-P-OB-Single-cvg-" + poste} day={day} infoBoxRef={infoBoxRef}/>

                </div>
              </div>            
            </div>)
          })

          }</div>)
        })
      }
    </>
  )
}
