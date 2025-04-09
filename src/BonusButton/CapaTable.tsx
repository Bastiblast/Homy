import React, { RefObject, useEffect, useRef, useState } from 'react'
import { uzeStore } from '../store/uzeStore'

export default function CapaTable(data) {
    
    const UPHRef = useRef<HTMLInputElement>(null)
    const timeBeforeFinishRef = useRef<HTMLInputElement>(null)
    const headcountRef = useRef<HTMLInputElement>(null)

    const totalHeadCount = uzeStore(s => s.totalHeadCount)
    const noPackerWarning = totalHeadCount === 0 && <span className='col-span-full'>Indiquer un nombre de pack pour calculer la capacité.</span>

    const [UPH,setUPH] = useState(145)
    const [timeBeforeFinish,setTimeBeforeFinish] = useState(45)
    const [customHC,setCustomHC] = useState<null | number>(totalHeadCount)

    useEffect(() => {
        setCustomHC(totalHeadCount)
    }, [totalHeadCount])
    
    console.log("CapaTable HC ",totalHeadCount,"custom",customHC)

    const dataObject = data.data
    console.log("CapaTable data ",dataObject)
    const noDataWarning = dataObject.size === 0 && <span className='col-span-full'>Il n'y a pas de CPT dans les 4 prochaines heures.</span>

    if (!dataObject) return
//    const array = await (await csv().fromString(responseText)).sort((a,b) => Date.parse(a["Expected Ship Date"]) - Date.parse(b["Expected Ship Date"]))

    const mapToArray = [...dataObject.entries()].sort()

    console.log("CapaTable array ",mapToArray)

    const capaTable = (UPH,timeBeforeFinish) => mapToArray.map(CPT => {


        if (!UPH || !timeBeforeFinish) return 

        const [cpt,listValue] = CPT

        console.log("CapaTable listValue ", listValue)

        const dateCPT = Date.parse(cpt)

        const dateAct = Date.now()

        const remainingTime = Math.round((dateCPT - dateAct) / 60 / 1000)

        const deadLineTime = remainingTime - timeBeforeFinish

        const btNumber = listValue.size
        const unitNumber = btNumber > 1 ? [...listValue].reduce((acc,val) => {
            return acc + val[1]
        },0) : [...listValue][0][1]
        const header = cpt.substring(11,16)

        const packerNeeded = Math.round(Number(unitNumber)/UPH/(deadLineTime/60))
        console.log("CapaTable headers ",header)

        const riskStyle = () =>  {
            const color = {
                "": "",
                danger: "bg-red-500",
                high: "bg-amber-500",
                medium: "bg-amber-300",
                carefull: "bg-amber-100",
                peace: "bg-lime-300",
            }
            if (!customHC) return color[""]
            const percentRisk = customHC / packerNeeded
            console.log("CapaTable risk calculating ",percentRisk)
            if (percentRisk < 0.5) return color["danger"]
            if (percentRisk < 0.75) return color["high"]
            if (percentRisk < 0.90) return color["medium"]
            if (percentRisk < 1.1) return color["carefull"]
            return color["peace"] 
        }
        
        const colorRisk = riskStyle()

            return <>

                    <div className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{header}</div>
                    <div className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{btNumber}</div>
                    <div className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{unitNumber}</div>
                    <div className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{deadLineTime}min</div>
                    <div className={'border-b-2 justify-center flex items-center '+colorRisk}>{packerNeeded}pack</div>
            

            </>
    })


  return (
    <div className='flex flex-row h-full w-full items-center bg-violet-100'>
        <div className='grid grid-flow-row grid-cols-5 border-4 p-2 border-violet-100 bg-white'>
            

            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>CPT</div>
            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>BT</div>
            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>Units</div>
            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>Remain</div>
            <div className='text-center px-4 font-bold border-b-2 h-8'>Attendu</div>
        

            {capaTable(UPH,timeBeforeFinish)}
           
           {noDataWarning || noPackerWarning}
           
        </div>

        <div className='grid grid-flow-row grid-cols-2  border-4 px-2 border-violet-100 bg-white h-full'>

                <span className='flex justify-end items-center pr-3'>headcount</span><input defaultValue={String(customHC)} ref={headcountRef} 
                onChange={(e) => setCustomHC(Number(e.target.value))}
                type="number"className='my-auto input input-xs border-blue-400 m-1' />

                <div className='flex justify-end items-center pr-3'>UPH</div>
                <input defaultValue={UPH} ref={UPHRef} type="number" 
                onChange={(e) => setUPH(Number(e.target.value))}
                className='my-auto input input-xs border-blue-400 m-1'/>

                <div className='text-end flex items-center  justify-end pr-3'>Temps avant CPT</div>
                <input defaultValue={timeBeforeFinish} ref={timeBeforeFinishRef} 
                onChange={(e) => setTimeBeforeFinish(Number(e.target.value))}
                type="number"className='my-auto input input-xs border-blue-400 m-1'/>

        </div>

    </div>
  )
}
