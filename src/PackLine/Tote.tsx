import { uzeCPTSelection } from '../Header/uzeSelectedCPT'
import { uzeStore } from '../store/uzeStore'

export default function RenderPoste({dropzone,inductPrio}) {
    
    const data = uzeStore(s => s.data)
    const updateDataTotal = uzeStore(s => s.updateDataTotal)
    const CPTlist = uzeCPTSelection(s => s.CPTlist)
    const updateIBC = uzeStore(s => s.updateIBC)
    const {prioCPT,potentiel} = inductPrio

   if (!data) return

   const someData = data[dropzone] ?? false
   
   if (!someData) return
   
   const render = Object.keys(data[dropzone]).map(totes => {
    if (totes === 'total' || totes === 'NextCPT') return
    //console.log("data",dropzone,totes,data[dropzone][totes],data)

    let newTotalQuantity
     newTotalQuantity = data[dropzone][totes] && 
     Object.entries(data[dropzone][totes]).reduce((acc,val) => {
      if (val[0] === 'total' || val[0] === "NextCPT") return
      if (!Array.isArray(val[1])) return acc
      const total = val[1].reduce((acc,val) => {
        return parseInt(val.Quantity) + acc
      }, 0)
      return (total + acc)
      },0)

    newTotalQuantity = newTotalQuantity ? newTotalQuantity : 0

    data[dropzone]['total'] = data[dropzone]['total'] ? data[dropzone]['total'] + newTotalQuantity : newTotalQuantity 
    newTotalQuantity ? data[dropzone][totes].total = newTotalQuantity : null

    let nextCPT
    if (data[dropzone][totes]) {
    nextCPT = data[dropzone][totes] && Object.keys(data[dropzone][totes]).reduce((acc,val) => {
      if (acc === 0) return val
      if (val[0] === 'total' || val[0] === "NextCPT") return acc
      const isValNextCPT = acc > val
      
      const returnValue = isValNextCPT ? val : acc
     // //.log("reducer",acc,val,isValNextCPT,returnValue)  
        
      return returnValue
    },0)

    if (data[dropzone]['NextCPT']) {
      nextCPT = data[dropzone]['NextCPT'] < nextCPT ? data[dropzone]['NextCPT'] : nextCPT
    }
   // console.log("nextCPT",nextCPT,typeof nextCPT)
    nextCPT === '0' ? null : data[dropzone]['NextCPT'] = nextCPT
  }

 // console.log(data)
    updateDataTotal(data)
   let activeTote = "bg-blue-500"

 
   
     if (CPTlist.length > 0) {
       CPTlist.forEach(selector => {

        if (activeTote === "bg-red-500") return
          const isInductPrio = prioCPT === selector && potentiel < 0
        //console.log("isInductPrio",selector," = ",prioCPT,isInductPrio)
           JSON.stringify(data[dropzone][totes]).includes(selector) || isInductPrio  ? 
           activeTote = "bg-red-500" : activeTote = "bg-blue-500"
         }
         )
     } else {
              if (activeTote === "bg-red-500") return
    const isInductPrio = prioCPT === nextCPT && potentiel < 0
        console.log("isInductPrio",prioCPT,' = ',nextCPT," & ",potentiel, "< 0 ?")
           isInductPrio  ? 
           activeTote = "bg-red-500" : activeTote = "bg-blue-500"
     }

   return (
   <div onClick={() => handleToteLook(totes,data[dropzone][totes],updateIBC)} 
   className={activeTote + ' m-1 p-1 transition-all rounded hover:scale-[2] hover:font-bold'} 
   key={totes}>{totes.substring(8,11)}
   </div>)
 })

   
   if (!data?.[dropzone]) return 
   
      // //console.log({data})

   return <>
   {render}
   </>
}

  const handleToteLook = (totes,event,updateIBC) => {
    if (!event) return
     //console.log("handleToteLook",totes,{event})
     const renderInInfoBox = event && Object.entries(event).map((entries) => {
      const [cpt,quantity] = entries
      //console.log("handleToteLook entrie",cpt,quantity)
      return (
        <div key={cpt+quantity} >
            <span className='px-1'>{cpt.substring(5)}</span>
            <span className='px-1'>{String(Object.values(quantity).reduce((acc,val) => {return acc + Number(val["Quantity"])},0))}</span>
        </div>)
    })
    //console.log("handleToteLook",renderInInfoBox)
    
    updateIBC(<><div  className='grid grid-rows-4 grid-cols-4 grid-flow-row m-3 mb-5 bg-slate-100'><div className="col-span-4 text-center font-bold bg-slate-200">{totes}</div>{renderInInfoBox}</div></>)
    
   }