import React from 'react'
import { uzeRodeo } from '../Header/uzeRodeo'
import { uzeCPTSelection } from '../Header/uzeSelectedCPT'

export default function Buffer({dz}) {

    const data = uzeRodeo(s => s.data)
    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const day = uzeCPTSelection(s => s.day)

    if (!data || !data[dz]) return

    const toteNumber = CPTlist.length > 0 ? Object.entries(data[dz]).filter(filter => {
      const [tote,cptunits] = filter
        let isPrio
        CPTlist.forEach(cpt => {
          const stringToSearch = `${day} ${cpt}`
          !isPrio ? isPrio = JSON.stringify(data[dz][tote]).includes(stringToSearch) : null
        })
        return isPrio

    }) : Object.entries(data[dz])

    const render = (toteNumber) => {
      const bufferStyle = CPTlist.length > 0 ? "bg-red-500" : "bg-blue-500"
      const bufferName = dz === "dz-P-OB-Single-CartRunMove" ? "CartRunMove" : "Buffer"
      return <span className={'mx-2 px-2 font-bold ' + bufferStyle}>{bufferName}: {toteNumber + " BT"}</span>
    }
    
    return !toteNumber ? render(0) :  render(toteNumber.length)
}


