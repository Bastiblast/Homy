import { useEffect, useRef } from 'react'
import {uzeStore} from '../store/uzeStore'
import RenderTote from './Tote'
import RenderBuffer from './Buffer'
import HeadCount from './HeadCount'
import AssociateInput from './AssociateInput'
import searchOnRodeo from './onRodeoSearch'
import fetchRodeoIco from '../BonusButton/fetch-rodeo-ico'

export default function PackLine() {

    const posteMapping = uzeStore(s => s.singleLaneMapping)
    
    const getRodeoData = uzeStore(s => s.getRodeoData)

    const dataTotal = uzeStore(s => s.dataTotal)
  const capacityDetails = uzeStore(s => s.capacityDetails)

    useEffect(() => {
      getRodeoData()
    }, [])
    
    const ico = useRef(null)
    const day = uzeStore(s => s.day)
    const infoBoxRef = uzeStore(s => s.infoBoxRef)
    const pageTime = uzeStore(s => s.pageTime)
    const headcount = uzeStore(s => s.headcount)
    const updateTotalHeadCount = uzeStore(s => s.updateTotalHeadCount)
    const UPH = uzeStore(s => s.UPH)
    const environnement = uzeStore(s => s.environnement)
    const TBCPT = uzeStore(s => s.TBCPT)
    const valuesArray = Object.values(headcount)
    
    const newTotalHeadCount = valuesArray.reduce((acc,val) => acc + val.size,0)

    const fullInfo = uzeStore(s => s.fullInfo)

    useEffect(() => {
      updateTotalHeadCount(newTotalHeadCount)

    }, [newTotalHeadCount])
    

  return (
    <>

          <div className='grid grid-cols-4'>
    {
      Object.keys(posteMapping).map(ligne => {
        const lineNumber = ligne.substring(5,6)
        return (
          <div key={ligne} className='text-center'>
          <div className='flex flex-row justify-evenly'>
            <span className='font-bold'>{"Ligne " + lineNumber}</span> 
            <HeadCount headcount={headcount} ligne={"ligne" + lineNumber}/>
            {lineNumber === "3" ? <RenderBuffer dz={"dz-P-OB-Single-CartRunMove"} /> : <RenderBuffer dz={"dz-P-OB-Single-Line" + lineNumber} /> }
          </div>
        {
          Object.values(posteMapping[ligne]).map(poste => {

            let renderUnits, railUnit, wsUnit,stationUnits,stationCPT,wsCPT,nextCPT,remaingTime,timeToFinish,stationColor,potentiel
            if (dataTotal) {
              railUnit = dataTotal[`dz-P-OB-Single-cvg-${poste}`]?.total
              wsUnit = dataTotal[`ws_Singles_0${poste}`]?.total
              stationUnits = railUnit && wsUnit ? railUnit + wsUnit : railUnit ? railUnit : wsUnit
              //console.log(poste,stationUnits,{railUnit},{wsUnit})
              renderUnits = isNaN(stationUnits) ? null : stationUnits
              
              wsCPT = dataTotal[`ws_Singles_0${poste}`]?.NextCPT
              stationCPT = dataTotal[`dz-P-OB-Single-cvg-${poste}`]?.NextCPT
              nextCPT = wsCPT < stationCPT ? wsCPT : stationCPT
              remaingTime = ((Date.parse(nextCPT) - pageTime) / 1000 / 60 /60 )

              timeToFinish = renderUnits / UPH
              potentiel = (remaingTime - (timeToFinish + (TBCPT/60)))
              stationColor = potentiel > 0 || isNaN(potentiel) ? 'flex flex-row shrink items-center bg-violet-400 p-1 m-1 justify-between rounded-md' :
              'flex flex-row shrink items-center bg-red-400 p-1 m-1 justify-between rounded-md'

            }


            const stationSearchParams = `dz-P-OB-Single-cvg-${poste}+ws_Singles_0${poste}`
            return (
              <div className={stationColor} key={"L1" + "-" + poste}>
              <div className='flex flex-row w-full items-center'>

                <div className='relative'>
                  
                <span className='p-2 bg-lime-400 rounded-md'
                
                  >{String(poste)}</span>
                {renderUnits && <img 
                onClick={() => searchOnRodeo(stationSearchParams)}
                className='absolute w-4 h-1/2 -top-1 right-0 z-10 transition-all hover:scale-150 hover:-translate-x-1 hover:translate-y-1' ref={ico} src='https://rodeo-dub.amazon.com/resources/images/rodeo-favicon.gif'></img>}
                  </div>
                <div className='flex flex-row'>
                <AssociateInput poste={poste} />
                </div>
                
                <div className='flex flex-row'>

                  <RenderTote inductPrio={{prioCPT:nextCPT,potentiel}} dropzone={"ws_Singles_0" + poste} day={day} infoBoxRef={infoBoxRef}/>
                  <div className="divider divider-horizontal p-0 mx-0"></div>
                  <RenderTote inductPrio={{prioCPT:nextCPT,potentiel}} dropzone={"dz-P-OB-Single-cvg-" + poste} day={day} infoBoxRef={infoBoxRef}/>

                </div>
              </div>
              <div className='w-12'>
              {fullInfo && renderUnits && renderUnits !== 0 && renderUnits + "/u"} {fullInfo && timeToFinish !== 0 && (timeToFinish * 60).toFixed(0)  + "/m"}            

              </div>
            </div>
            )
          })
          
        }</div>)
      })
      }
      </div>
    </>
  )
}
