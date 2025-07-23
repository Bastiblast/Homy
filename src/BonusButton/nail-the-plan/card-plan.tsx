import { useEffect, useState } from 'react'
import getLastPlanSingle, { singlePlanTemplate } from './get-lastSinglePlan'

export default function GetThePlan({plan}) {


    if (!plan) return

    console.log('plan in card',plan)
    const {data} = plan


    const date = new Date(data.sent_timestamp)
    const dateHour =  date.getHours()
    const localDate = date.setHours(dateHour - 2)
    const stringDate = new Date(localDate).toLocaleTimeString()

    console.log({date},{dateHour},{localDate},{stringDate})

    return (
    <div className='w-full h-full flex p-2'>

        { !data ? <div>getThedata</div> :
        <div>
        <div className="card card-border bg-base-100">
        <div className="">
            <h2 className="card-title">{data.pack_station}</h2>
            <div className="grid grid-cols-2">
                <strong>Time</strong>
                <span className="">{stringDate}</span>
                <span className=""><strong>WIP : </strong>{data.actual_wip}</span>
                <span className=""><strong>+1H WIP : </strong>{(data.actual_wip + (data.pack_tur - data.pick_tur)).toFixed(0)}</span>
                <span><strong>HC Pack : </strong>{data.planned_hc}</span>
                <span><strong>TUR Pack : </strong>{data.pack_tur.toFixed(0)}</span>
            </div>
        </div>
        </div>
        </div>
        }
    </div>
    )
}

