import React from 'react'
import { uzeRodeo } from '../Header/uzeRodeo'
import { uzeCPTSelection } from '../Header/uzeSelectedCPT'

export default function Buffer({dz}) {

    const data = uzeRodeo(s => s.data)
    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const day = uzeCPTSelection(s => s.day)

    if (!data || !data[dz]) return

    const toteNumber = Object.entries(data[dz])

    const prioToteNumber = CPTlist.length > 0 ? Object.entries(data[dz]).filter(filter => {
      const [tote,cptunits] = filter
        let isPrio
        CPTlist.forEach(cpt => {
          const stringToSearch = `${day} ${cpt}`
          !isPrio ? isPrio = JSON.stringify(data[dz][tote]).includes(stringToSearch) : null
        })
        return isPrio

    }) : Object.entries(data[dz])

    

    const render = (prioToteNumber) => {
      const isPrio = CPTlist.length > 0
      const bufferName = dz === "dz-P-OB-Single-CartRunMove" ? "CartRunMove" : "Buffer"
      return <>
      <span className={'mx-2 px-2 font-bold bg-blue-500'}>{bufferName}: {toteNumber.length + " BT"}</span>
      {isPrio && <span className={'mx-2 px-2 font-bold bg-red-500'}>Prio : {prioToteNumber + " BT"}</span>}
      </>
    }
    
    return !prioToteNumber ? render(0) :  render(prioToteNumber.length)
}


