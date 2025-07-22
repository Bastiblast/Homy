import React, { useEffect, useRef, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import {GM} from '$'

export default function ActivityDetails() {

    const totalHeadCount = uzeStore(s => s.totalHeadCount)
    const updateTotalHeadCount = uzeStore(s => s.updateTotalHeadCount)
    const updateCapacityDetails = uzeStore(s => s.updateCapacityDetails)

    const UPHRef = useRef<HTMLInputElement>(null)
    const timeBeforeFinishRef = useRef<HTMLInputElement>(null)
    const headcountRef = useRef<HTMLInputElement>(null)

    const [customHC,setCustomHC] = useState<null | number>(totalHeadCount)
    const [UPH,setUPH] = useState<null | number>(null)
    const [timeBeforeFinish,setTimeBeforeFinish] = useState<null | number>(null)

        useEffect(() => {
        
        console.log("Trying cache user preference....")
        GM.getValue("Homy_capacityDetails")
        .then(GMValue => {
            if (!GMValue || GMValue == undefined) {
                setUPH(145)
                setTimeBeforeFinish(45)
            } else {

            console.log('GM_getValue("Homy_capacityDetails")',GMValue)
            const info = GMValue ? JSON.parse(GMValue) : null
            setUPH(isNaN(info.userPreference.UPH) || !info.userPreference.UPH  ? 145 : info.userPreference.UPH )
            setTimeBeforeFinish(isNaN(info.userPreference.TBCPT) || !info.userPreference.TBCPT ? 45 : info.userPreference.TBCPT )
            }
        })
        
    }, [])
    
    
    useEffect(() => {
        if (!UPH || !timeBeforeFinish) return

        updateCapacityDetails({
            dataTime: Date.now(),
            userPreference: {
              UPH: UPH,
              TBCPT: timeBeforeFinish,
            }
          
          })
  
    }, [UPH,timeBeforeFinish])
    

    useEffect(() => {
        setCustomHC(totalHeadCount)
    }, [totalHeadCount])
    
    const emptyInputColor = {
        0: "bg-red-300"
    } 

  return (        
    <div className='grid grid-flow-row grid-cols-2  border-4 px-2 border-violet-100 bg-white h-full'>

        <span className={`flex justify-end items-center pr-3`}>headcount</span>
        <input defaultValue={String(customHC)} ref={headcountRef} 
        onChange={(e) => updateTotalHeadCount(Number(e.target.value))}
        type="number"className={`my-auto input input-xs border-blue-400 m-1 ` + emptyInputColor[customHC]} />

        <div className={'flex justify-end items-center pr-3'}>UPH</div>
        <input defaultValue={UPH} ref={UPHRef} type="number" 
        onChange={(e) => setUPH(Number(e.target.value))}
        className={'my-auto input input-xs border-blue-400 m-1 ' + emptyInputColor[UPH]}/>

        <div className='text-end flex items-center  justify-end pr-3'>Temps avant CPT</div>
        <input defaultValue={timeBeforeFinish} ref={timeBeforeFinishRef} 
        onChange={(e) => setTimeBeforeFinish(Number(e.target.value))}
        type="number"className={`my-auto input input-xs border-blue-400 m-1 ` + emptyInputColor[timeBeforeFinish]}/>

    </div>
  )
}
