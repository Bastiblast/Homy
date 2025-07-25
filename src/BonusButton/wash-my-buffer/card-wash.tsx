import React, { useEffect, useState } from 'react'
import { getLastPlanSingle } from '../nail-the-plan/get-lastSinglePlan'
import { uzeStore } from '../../store/uzeStore'
import Loader from '../../store/loader-component'

export default function CardWash() {

    const UPH = uzeStore(s => s.UPH)
    const TBCPT = uzeStore(s => s.TBCPT)
    const totalHeadCount = uzeStore(s => s.totalHeadCount)
    const timeToNextCPT = uzeStore(s => s.timeToNextCPT)
    const [plan,setPlan] = useState(null)
    
    useEffect(() => {
        getLastPlanSingle().then(plan => setPlan(plan[0]))
        console.log({plan})
    },[]) 

    const totalUnits = () => {
        if (!plan||!secureTimeToNextCPT()) return null
        const wip = deviatedWIP()
        if (!wip) return null
        return (plan.pick_tur * secureTimeToNextCPT()) + wip
    }

    const deviatedWIP = () => {
        if (!plan || !totalHeadCount) return
        //console.log("calcule deviatedWIP",plan.actual_wip,plan.actual_wip -(totalHeadCount * 90))
        return (plan.actual_wip -((totalHeadCount * 90)+(plan.pick_tur) /6))
    }

    const secureTimeToNextCPT = () => {
        return timeToNextCPT - (TBCPT/60)
    }

  return (
    <div className='flex flex-col items-center justify-center align-middle h-full'>
        {!totalHeadCount ? <span>Indiquer le nombre de packer pour lancer le calcule.</span> : 
        !totalUnits() ? <Loader>Getting time</Loader> : 
        !UPH ? <span>pas d'uph</span> : 
        plan && 
        <>
        <table className='table'>
            <thead>
                <tr>
                    <th>PickTUR</th><th></th><th>Temps restants</th><th></th><th>deviated WIP</th><th>Total units</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>({plan.pick_tur.toFixed(0)}</td>
                    <td>X</td><td>{secureTimeToNextCPT().toFixed(1)}h)</td>
                    <td>+</td><td>{deviatedWIP()?.toFixed(0)}</td>
                    <td>{totalUnits().toFixed(0)}</td>
                </tr>

            </tbody>
   
        </table>
                        <div>
                    <span><strong>Units par heure : </strong>
                        {totalUnits().toFixed(0)} / {secureTimeToNextCPT().toFixed(1)}h = 
                        {(totalUnits() / secureTimeToNextCPT()).toFixed(0)}
                    </span>
                </div>
                <div>
                    <span className='w-full'><strong>Ressources nécessaires : </strong>{(totalUnits() / secureTimeToNextCPT()).toFixed(0)}u / {UPH.toFixed(0)}uph = {((totalUnits() / secureTimeToNextCPT())/UPH).toFixed(0)} packers</span>
                </div>
        </>
}
    </div>
  )
}
