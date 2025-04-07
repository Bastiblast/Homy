import React, { useRef, useState } from 'react'
import { uzeCPTSelection } from '../Header/uzeSelectedCPT'
import { uzeRodeo } from '../Header/uzeRodeo'
import { uzeStore } from '../store/uzeStore'

export default function RenderPoste({dropzone,day,infoBoxRef}) {
    
    const data = uzeRodeo(s => s.data)
    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const updateIBC = uzeStore(s => s.updateIBC)

   // console.log("rendering : ",data)

   if (!data) return

   const someData = data[dropzone] ?? false
   
   if (!someData) return
   
   const render = Object.keys(data[dropzone]).map(totes => {

   let activeTote = "bg-blue-500"

   const handleToteLook = (totes,event) => {
     console.log({event})
     const renderInInfoBox = event && Object.entries(event).map((entries) => {
      const [cpt,quantity] = entries
      return (
        <div key={cpt+quantity} >
            <span className='px-1'>{cpt.substring(5)}</span>
            <span className='px-1'>{quantity}</span>
        </div>)
    })
  
    updateIBC(<><div  className='grid grid-rows-4 grid-cols-4 grid-flow-row m-3 mb-5 bg-slate-100'><div className="col-span-4 text-center font-bold bg-slate-200">{totes}</div>{renderInInfoBox}</div></>)
    
   }
   
     if (CPTlist.length > 0) {
       CPTlist.forEach(selector => {

        if (activeTote === "bg-red-500") return
         const stringToSearch = `${day} ${selector}`
           JSON.stringify(data[dropzone][totes]).includes(stringToSearch) ? 
           activeTote = "bg-red-500" : activeTote = "bg-blue-500"
         }
         )
     }

   return (
   <div onClick={() => handleToteLook(totes,data[dropzone][totes])} className={activeTote + ' m-1 p-1 rounded'} key={totes}>{totes.substring(8,11)}
              
   </div>)
 })

   
   if (!data?.[dropzone]) return 
   
      // console.log({data})

   return <>
   {render}
   </>
}

