import React, { useEffect } from 'react'
import { uzeStore } from '../store/uzeStore'
import { uzeRodeo } from '../Header/uzeRodeo'
import usePick from './usePick'
import CapaTable from './CapaTable'
export default function index() {
    
    const {renderPick} = usePick()

    const updatePDPData = uzeStore(s => s.updatePDPData)
    const getRodeoPickData = uzeRodeo(s => s.getRodeoPickData)  

    const updatePickRefresher = uzeRodeo(s => s.updatePickRefresher)
    const getRodeoCapa = uzeRodeo(s => s.getRodeoCapa)    
    const dataCapaAge = uzeRodeo(s => s.dataCapaAge)

    const updateCapaRefresher = uzeRodeo(s => s.updateCapaRefresher)
    const updateIBC = uzeStore(s => s.updateIBC)

    const dataPick = uzeRodeo(s => s.dataPick)
    const dataCapa = uzeRodeo(s => s.dataCapa)

    const isOutDated = (stamp,sec) => {
      if (!stamp || !sec) return  
      const isOutDated = !((Date.now() - sec) / 1000) < sec 
      console.log(new Date(stamp).toLocaleTimeString("fr-FR")," is out dated ? ",isOutDated)
      return isOutDated
    }

    const handlePDP = () => {
        console.log("click")
        updatePDPData()
    }

    useEffect(() => {
        const newIBCContent = renderPick(dataPick)
        console.log("refresh and upload new IBC from index ",newIBCContent)
        updateIBC(renderPick(dataPick))
      }, [dataPick])
    
    const handlePick = async () => {
      updateIBC("Loading...")
      updatePickRefresher("loading")
      await getRodeoPickData()
    }

    useEffect(() => {
      if (!dataCapa) return
      console.log("update IBC with dataCapa : ",dataCapa)
      updateIBC(<CapaTable data={dataCapa} />)
    }, [dataCapa])

    const handleCapa = async () => {

      if (dataCapaAge && isOutDated(dataCapaAge,1800)) {
        console.log("Capacity data is out dated ? ",isOutDated(dataCapaAge,180))
        updateIBC(<CapaTable data={dataCapa} />)}
      else {
        console.log("Capacity data fetching...")
        
      updateIBC("Loading...")
      updateCapaRefresher("loading")
      await getRodeoCapa()
    }
    }





  return (
    <div className='grid grid-cols-2 grid-rows-3 h-full justify-evenly'>
    <button className='btn m-1 rounded-none bg-red-400 shadow-md w-16' disabled={true}>PLAN</button>
    <button onClick={handlePDP} className='btn m-1 rounded-none bg-red-400 shadow-md w-16'>PDP</button>
    <button onClick={handleCapa} className='btn m-1 rounded-none bg-red-400 shadow-md w-16'>CAPA</button>
    <button onClick={handlePick} className='btn m-1 rounded-none bg-red-400 shadow-md w-16'>PICK</button>
  </div>
  )
}
