import React, { useEffect } from 'react'
import { uzeRodeo } from '../Header/uzeRodeo'
import { uzeStore } from '../store/uzeStore'
import { uzeCPTSelection } from '../Header/uzeSelectedCPT'

export default function Pick() {
      
      const CPTlist = uzeCPTSelection(s => s.CPTlist)
      const day = uzeCPTSelection(s => s.day)


      const totalTote = "WIP"
      
      const howManyTote = (dataPick,dz,filter) => {
        if (!dataPick[dz]) return
        let toteNumber = 0

        Object.values(dataPick[dz]).forEach(tote => {
          let isIncludes
          Object.keys(tote).forEach(cpts => {
            switch (typeof filter) {
              case "string" : 
              !isIncludes ? isIncludes = cpts.substring(5).includes(filter) : null
              break
              case "undefined" : 
              CPTlist.length > 0 ? CPTlist.forEach(cpt => {
                const stringSearch = `${day} ${cpt}`
                !isIncludes ? isIncludes = cpts.substring(5).includes(stringSearch) : null
                }) : isIncludes = true
              break
            }

          })
          isIncludes ? toteNumber++ : null
        })
        return Number(toteNumber)
      }
      
      const renderPick = (dataPick) => {
        !dataPick && console.log("There is no data")

        if (!dataPick) return

        console.log("Starting rendering pick with ",dataPick)
        
          const headers = dataPick.map((row,index) => {
            if (index > 5) return
            const CPTHour = row[0].substring(11,16)
            //console.log("dataPick row",CPTHour)
            return <th className='font-bold text-xl'>{CPTHour}</th>
          })

          const body = dataPick.map((row,index) => {
            if (index > 5) return
            const CPTunit = row[1]
            //console.log("dataPick unit",CPTunit)
            return <td className='text-xl'>{CPTunit.toString()}</td>
          })

          const Table = () => <table className='table table-xs'>
          <thead>
            <tr>
              <th className='font-bold text-xl'>CPT</th>{headers}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='font-bold text-xl text-slate-900/60'>PickingNotYetPicked</td>{body}
            </tr>
          </tbody>
      </table>

          console.log("renderring pick return ",<Table />)
          return <Table />

      }

      
      return {renderPick}
}
