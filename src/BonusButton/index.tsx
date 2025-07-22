import React, { useEffect } from 'react'
import { uzeStore } from '../store/uzeStore'
import { uzeRodeo } from '../Header/uzeRodeo'
import usePick from './usePick'
import CapaTable from './CapaTable'
import {GM_deleteValue} from '$'

export default function index() {
    
    const {renderPick} = usePick()

    const updatePDPData = uzeStore(s => s.updatePDPData)
    const getRodeoPickData = uzeStore(s => s.getRodeoPickData)  

    const updatePickRefresher = uzeStore(s => s.updatePickRefresher)
    const getRodeoCapa = uzeStore(s => s.getRodeoCapa)    
    const dataCapaAge = uzeStore(s => s.dataCapaAge)

    const updateCapaRefresher = uzeStore(s => s.updateCapaRefresher)
    const updateIBC = uzeStore(s => s.updateIBC)

    const dataPick = uzeStore(s => s.dataPick)
    const dataCapa = uzeStore(s => s.dataCapa)
    const pageTime = uzeStore(s => s.pageTime)
    const refresher = uzeStore(s => s.refresher)
    const refresherCapa = uzeStore(s => s.refresherCapa)
    const refresherPick = uzeStore(s => s.refresherPick)
    const bonusDisabled = refresher === "loading" || refresherCapa.includes("loading")|| refresherPick === "loading"

    const isOutDated = (stamp,sec) => {
      if (!stamp || !sec) return  
      const isOutDated = !((pageTime - sec) / 1000) < sec 
      //console.log(new Date(stamp).toLocaleTimeString("fr-FR")," is out dated ? ",isOutDated)
      return isOutDated
    }

    const handlePDP = () => {
        //console.log("click")
        updatePDPData()
    }

    useEffect(() => {
        const newIBCContent = renderPick(dataPick)
        //console.log("refresh and upload new IBC from index ",newIBCContent)
        updateIBC(renderPick(dataPick))
      }, [dataPick])
    
    const handlePick = async () => {
      updateIBC("Loading...")
      updatePickRefresher("loading")
      await getRodeoPickData()
    }

    useEffect(() => {
      if (!dataCapa) return
      //console.log("update IBC with dataCapa : ",dataCapa)
      updateIBC(<CapaTable data={dataCapa} />)
    }, [dataCapa])

    const handleCapa = async () => {

      if (dataCapaAge && isOutDated(dataCapaAge,180) && dataCapa.size > 0) {
        //console.log("Capacity data is out dated ? ",isOutDated(dataCapaAge,180))
        updateIBC(<CapaTable data={dataCapa} />)}
      else {
        //console.log("Capacity data fetching...")
        
      updateIBC("Loading...")
      updateCapaRefresher("loading")
      await getRodeoCapa()
    }
    }


    const handleDelete = () => {
      GM_deleteValue("Homy_capacityDetails")
    }



  return (
    <div className='grid grid-cols-2 grid-rows-3 h-full justify-evenly pt-3'>
    <button className='btn m-1 rounded-none bg-red-400 shadow-md w-16' disabled={true}>PLAN</button>
    <button onClick={handlePDP} className='btn m-1 rounded-none bg-red-400 shadow-md w-16' disabled={bonusDisabled}>PDP</button>
    <button onClick={handleCapa} className='btn m-1 rounded-none bg-red-400 shadow-md w-16' disabled={bonusDisabled}>CAPA</button>
    <button onClick={handlePick} className='btn m-1 rounded-none bg-red-400 shadow-md w-16' disabled={bonusDisabled}>PICK</button>
    <button onClick={handleDelete} className='btn m-1 rounded-none bg-red-400 shadow-md w-16 hidden' disabled={bonusDisabled}>Delete</button>
  </div>
  )
}
