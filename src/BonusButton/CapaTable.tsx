import React, { RefObject, useEffect, useRef, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import {GM_getValue,GM_deleteValue,GM} from '$'

export default function CapaTable(data) {
    
    const UPHRef = useRef<HTMLInputElement>(null)
    const timeBeforeFinishRef = useRef<HTMLInputElement>(null)
    const headcountRef = useRef<HTMLInputElement>(null)

    const totalHeadCount = uzeStore(s => s.totalHeadCount)
    
    const [UPH,setUPH] = useState<null | number>(null)
    const [timeBeforeFinish,setTimeBeforeFinish] = useState<null | number>(null)

    const [customHC,setCustomHC] = useState<null | number>(totalHeadCount)
    
    const updateCapacityDetails = uzeStore(s => s.updateCapacityDetails)

    const procced = useRef(new Map())
    
    useEffect(() => {
    
    }, [])
    
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
    
    const noPackerWarning = customHC === 0 && <span className='col-span-full'>Indiquer un nombre de pack pour calculer la capacité.</span>

    //console.log("CapaTable HC ",totalHeadCount,"custom",customHC)

    const dataObject = data.data
    //console.log("CapaTable data ",dataObject)

    if (!dataObject) return

    const noDataWarning = dataObject.size === 0 && <span className='col-span-full'>Il n'y a pas de CPT dans les 4 prochaines heures.</span>


    const mapToArray = [...dataObject.entries()].sort()

    //console.log("CapaTable array ",mapToArray)


    const capaTable = (UPH,timeBeforeFinish) => mapToArray.map((CPT,index) => {

        
        //console.log("CapaTable CPT ",CPT)

        if (!UPH || !timeBeforeFinish) return 

        const [cpt,listValue] = CPT

        
        procced.current = index !== 0 ? new Map([...listValue,...procced.current]) : listValue

        //console.log("CapaTable listValue ", listValue)
        //console.log("CapaTable procced.current ", procced.current)

        const dateCPT = Date.parse(cpt)

        const dateAct = Date.now()

        const remainingTime = Math.round((dateCPT - dateAct) / 60 / 1000)

        const deadLineTime = remainingTime - timeBeforeFinish > 0 ? remainingTime - timeBeforeFinish : 0

        const btNumber = listValue.size
        const allBtNumber = procced.current.size

        const unitNumber = btNumber > 1 ? [...listValue].reduce((acc,val) => {
            return acc + val[1]
        },0) : [...listValue][0][1]
        const allUnitNumber = allBtNumber > 1 ? [...procced.current].reduce((acc,val) => {
            return acc + val[1]
        },0) : [...procced.current][0][1]

        const header = cpt.substring(11,16)

        const packCalculation = Math.ceil(Number(allUnitNumber)/UPH/(deadLineTime/60))
        const packerNeeded = deadLineTime === 0 ? "Finish" : (String(packCalculation) + " pack")
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
            console.log("CapaTable risk calculating ",customHC,packerNeeded)

            const percentRisk = customHC / packCalculation
            console.log("CapaTable risk calculating ",percentRisk)
            if (percentRisk < 0.5) return color["danger"]
            if (percentRisk < 0.75) return color["high"]
            if (percentRisk < 0.90) return color["medium"]
            if (percentRisk < 1.1) return color["carefull"]
            return color["peace"] 
        }
        
        const colorRisk = riskStyle()

            return <>

                    <div key={index} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{header}</div>
                    <div key={index +1} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{btNumber}{index > 0 && "-"+allBtNumber}</div>
                    <div key={index+2} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{unitNumber}{index > 0 && "-"+allUnitNumber}</div>
                    <div key={index+3} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{deadLineTime}min</div>
                    <div key={index+4} className={'border-b-2 justify-center flex items-center '+colorRisk}>{packerNeeded}</div>
            

            </>
    })

    const emptyInputColor = {
        0: "bg-red-300"
    } 

  return (
    <div className='flex flex-row h-full w-full items-center bg-violet-100'>
        <div className='grid grid-flow-row grid-cols-5 border-4 p-2 border-violet-100 bg-white'>
            

            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>CPT</div>
            <div className='text-xs text-center px-4 border-r-2 font-bold border-b-2 h-8 w-full'>
                BT
                <div className='flex justify-between'>

                <span className='text-xs'>Prio</span>
                <span className='text-xs'>Sum</span>
                </div>
                
            </div>
            <div className='text-xs text-center px-4 border-r-2 font-bold border-b-2 h-8 w-full'>
                Units
                <div className='flex justify-between'>

                <span className='text-xs'>Prio</span>
                <span className='text-xs'>Sum</span>
                </div>
                
            </div>
            <div className='text-center px-4 border-r-2 font-bold border-b-2 h-8'>Remain</div>
            <div className='text-center px-4 font-bold border-b-2 h-8'>Attendu</div>
        

            {dataObject.size > 0 && capaTable(UPH,timeBeforeFinish)}
           
           {noDataWarning || noPackerWarning}
           
        </div>

        <div className='grid grid-flow-row grid-cols-2  border-4 px-2 border-violet-100 bg-white h-full'>

                <span className={`flex justify-end items-center pr-3`}>headcount</span>
                <input defaultValue={String(customHC)} ref={headcountRef} 
                onChange={(e) => setCustomHC(Number(e.target.value))}
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

    </div>
  )
}
