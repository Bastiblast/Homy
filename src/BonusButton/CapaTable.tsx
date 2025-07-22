import { useEffect, useRef, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import {GM} from '$'
import ActivityDetails from './activityDetails'

export default function CapaTable(data) {

    //console.log("CapaTable data",data)
    const totalHeadCount = uzeStore(s => s.totalHeadCount)
    const pageTime = uzeStore(s => s.pageTime)
    
    const [UPH,setUPH] = useState<null | number>(null)
    const [timeBeforeFinish,setTimeBeforeFinish] = useState<null | number>(null)
    const [customHC,setCustomHC] = useState<null | number>(totalHeadCount)
    
    let totalPick = 0

    const procced = useRef(new Map())
  
    const noPackerWarning = customHC === 0 && <span className='col-span-full'>Indiquer un nombre de pack pour calculer la capacité.</span>

    const dataObject = data.data

    //console.log("CapaTable dataObject",dataObject)

    if (!dataObject) return

    const noDataWarning = dataObject.size === 0 && <span className='col-span-full'>Il n'y a pas de CPT dans les 4 prochaines heures.</span>


    const mapToArray = [...dataObject.entries()].sort()

    //console.log("CapaTable array ",mapToArray)


            useEffect(() => {
            
            //console.log("Trying cache user preference....")
            GM.getValue("Homy_capacityDetails")
            .then(GMValue => {
                if (!GMValue || GMValue == undefined) {
                    setUPH(145)
                    setTimeBeforeFinish(45)
                } else {
    
                //console.log('GM_getValue("Homy_capacityDetails")',GMValue)
                const info = GMValue ? JSON.parse(GMValue) : null
                setUPH(isNaN(info.userPreference.UPH) || !info.userPreference.UPH  ? 145 : info.userPreference.UPH )
                setTimeBeforeFinish(isNaN(info.userPreference.TBCPT) || !info.userPreference.TBCPT ? 45 : info.userPreference.TBCPT )
                }
            })
            
        }, [])
            
        
            useEffect(() => {
                console.log("CapaTable",{totalHeadCount})
                setCustomHC(totalHeadCount)
            }, [totalHeadCount])

    const capaTable = (UPH,timeBeforeFinish) => mapToArray.map((CPT,index) => {

        
        //console.log("CapaTable CPT index",CPT,index)

        if (!UPH || !timeBeforeFinish) return 

        const [cpt,listValue] = CPT

        
        procced.current = index !== 0 ? new Map([...listValue,...procced.current]) : listValue

        const dateCPT = Date.parse(cpt)

        const dateAct = pageTime

        const remainingTime = Math.round((dateCPT - dateAct) / 60 / 1000)


        const deadLineTime = remainingTime - timeBeforeFinish > 0 ? remainingTime - timeBeforeFinish : 0

        //console.log("CapaTable debug",{dateCPT},{pageTime},{dateAct},remainingTime)

        const btNumber = listValue.size
        const allBtNumber = procced.current.size

        const unitNumber = btNumber > 1 ? [...listValue].reduce((acc,val) => {
            if (val[0] === "picking") {
                totalPick += val[1]
                return acc + totalPick + val[1]
            }
            return acc + val[1]
        },0) : [...listValue][0][1]

        const allUnitNumber = allBtNumber > 1 ? [...procced.current].reduce((acc,val) => {
            if (val[0] === "picking") {
                totalPick += val[1]
                return acc + totalPick + val[1]
            }
            return acc + val[1]
        },0) : [...procced.current][0][1]

        //console.log("CapaTable units",[...listValue],[...procced.current])

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
                    <div key={index+2} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{index === 0 ?unitNumber:allUnitNumber}</div>
                    <div key={index+3} className={'border-b-2 justify-center border-r-2 flex items-center '+colorRisk}>{deadLineTime}min</div>
                    <div key={index+4} className={'border-b-2 justify-center flex items-center '+colorRisk}>{packerNeeded}</div>
            

            </>
    })



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

        <ActivityDetails />

    </div>
  )
}
