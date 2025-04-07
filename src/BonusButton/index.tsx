import React, { useEffect } from 'react'
import { uzeStore } from '../store/uzeStore'
import { uzeRodeo } from '../Header/uzeRodeo'
import usePick from './usePick'
export default function index() {
    
    const {renderPick} = usePick()
    const updatePDPData = uzeStore(s => s.updatePDPData)
    const getRodeoPickData = uzeRodeo(s => s.getRodeoPickData)
    const updatePickRefresher = uzeRodeo(s => s.updatePickRefresher)
    const updateIBC = uzeStore(s => s.updateIBC)
    const dataPick = uzeRodeo(s => s.dataPick)
    const data = uzeRodeo(s => s.data)

    const handlePDP = () => {
        console.log("click")
        updatePDPData()
    }

    useEffect(() => {
        const newIBCContent = renderPick(dataPick)
        console.log("refresh and upload new IBC from index ",newIBCContent)
        updateIBC(renderPick(dataPick))
      }, [dataPick,data])
    
    const handlePick = async () => {
      updatePickRefresher("loading")
      await getRodeoPickData()
    }



  return (
    <div className='grid grid-cols-2 grid-rows-3 h-full justify-evenly'>
    <button className='btn m-1 rounded-none bg-red-400 shadow shadow-md w-16' disabled="disabled">PLAN</button>
    <button onClick={handlePDP} className='btn m-1 rounded-none bg-red-400 shadow shadow-md w-16'>PDP</button>
    <button className='btn m-1 rounded-none bg-red-400 shadow shadow-md w-16' disabled="disabled">CAPA</button>
    <button onClick={handlePick} className='btn m-1 rounded-none bg-red-400 shadow shadow-md w-16'>PICK</button>
  </div>
  )
}
