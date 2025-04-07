import { create } from 'zustand'
import {GM_xmlhttpRequest} from '$'
import {GM} from '$'
import csv from 'csvtojson'

interface uzeRodeo {
  data : null;
  dataPick : null;
  refresher: string;
  refresherPick: string;
  updateRefresher: (status: string) => void;
  updatePickRefresher: (status: string) => void;
  getRodeoData: () => void;
  getRodeoPickData: () => void;
  buildJSON : (val : any) => void;
}

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on
&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID
&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false
&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`


const urlCSVPickSummary = `https://rodeo-dub.amazon.com/MRS1/CSV/ExSD?isEulerUpgraded=ALL&processPath=&fnSku=&fulfillmentServiceClass=ALL&exSDRange.quickRange=TODAY
&isEulerPromiseMiss=ALL&zAxis=PROCESS_PATH&sortCode=&isEulerExSDMiss=ALL&exSDRange.dailyEnd=00%3A00&exSDRange.dailyStart=00%3A00&yAxis=WORK_POOL
&isReactiveTransfer=ALL&minPickPriority=MIN_PRIORITY&Excel=false&fracs=NON_FRACS&shipMethod=&shipmentTypes=CUSTOMER_SHIPMENTS&_workPool=on
&_workPool=on&_workPool=on&_workPool=on&workPool=PredictedCharge&workPool=PlannedShipment&workPool=ReadyToPick&workPool=ReadyToPickHardCapped
&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized
&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit
&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing
&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted
&workPool=Palletized&workPool=ManifestPending
&workPool=ManifestPendingVerification&workPool=Manifested&workPool=Loaded&workPool=TransshipManifested&giftOption=ALL&shipOption=`

const urlCSVPickrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on
&WorkPool=PickingPickedInProgress&WorkPool=PickingPickedInTransit&enabledColumns=ASIN_TITLES
&enabledColumns=DEMAND_ID&exSDRange.quickRange=TODAY&enabledColumns=OUTER_SCANNABLE_ID
&enabledColumns=SORT_CODE&Excel=false&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

export const uzeRodeo = create<uzeRodeo>((set,get)=>({
  data: null,
  dataPick: null,
  refresher: "done", // modify to loading to load at start
  refresherPick: "done",
  updateRefresher: (status: string) => {
    set({refresher:status})
    get().getRodeoData()
},
updatePickRefresher: (status: string) => {
  set({refresherPick:status})
  get().getRodeoPickData()
},
  getRodeoData: () => {
    console.log("refresher is : ",get().refresher)
    if (get().refresher === "done") return
    console.log("getting data")
    GM_xmlhttpRequest({
    method: "GET",
    url: urlCSVrodeo,
    onload: function(response) {
      console.log("rodeoRespond with ",response.responseText)
      const converter = csv().fromString(response.responseText).then((csvRow) => {
      set({refresher: "done"})
      set({data: get().buildJSON(csvRow)})

    }
    )
    }
  })},
  getRodeoPickData: async () => {

    //console.log("refresher is : ",get().refresherPick)

    if (get().refresherPick === "done") return

    //console.log("getting data")

    const response = await GM.xmlHttpRequest({
    method: "GET",
    url: urlCSVPickSummary,
    })
  
    //console.log("Rodeo respond",response,response.responseText)
    // Using csvtojson library to jsonnify the csv
    /*
    const converter = await csv().fromString(response.responseText).then((csvRow) => {
    set({refresherPick: "done"})
    const jsonPick = get().buildJSON(csvRow)

    set({dataPick: jsonPick})
    })
*/
    const CPTMap = new Map()

    const alternateConvert = await csv().fromString(response.responseText)
    alternateConvert.forEach(row => {
        const unitExpectShipDate = row["ExSD"]
        const unitQuantity = Number(row["Quantity"])
        const unitPP = row["Process Path"]
        const unitWorpPool = row["Work Pool"]

        const allowedWorkPool = ["PickingNotYetPicked"]
        //console.log(row,unitExpectShipDate,unitQuantity,unitPP)

        if (isNaN(unitQuantity) || unitPP !== "PPSingleMedium" || !allowedWorkPool.includes(unitWorpPool)) return
        //console.log(row,unitExpectShipDate,unitQuantity,unitPP)
        CPTMap.has(unitExpectShipDate) ? CPTMap.set(unitExpectShipDate, CPTMap.get(unitExpectShipDate) + unitQuantity) : CPTMap.set(unitExpectShipDate,unitQuantity)
        //console.log("Rodeo alternateConvert add new entrie ",CPTMap)
      })
  
      set({refresherPick: "done"})
      
      const CPTArray = [...CPTMap].sort()
      console.log("Rodeo alternateConvert result",CPTArray)
      set({dataPick: CPTArray})

    

},
  buildJSON: (csvRow) => {
      const csvGroupByDZ = Object.groupBy(csvRow, (row) => row["Outer Scannable ID"])
      // Making object 
      Object.entries(csvGroupByDZ).forEach((entries) => {
        const [key,val] = entries
        const subGroup = Object.groupBy(val,(row) => row["Scannable ID"])
        csvGroupByDZ[key] = subGroup
        Object.entries(csvGroupByDZ[key]).forEach((entries) => {
          const [keyz,value] = entries
          const zubGroup = Object.groupBy(value,(row) => row["Expected Ship Date"])
          csvGroupByDZ[key][keyz] = zubGroup
          const zubReduce = Object.entries(csvGroupByDZ[key][keyz]).forEach(entries => {
          const [keyzz,values] = entries
          csvGroupByDZ[key][keyz][keyzz] = values.reduce((acc,val) => {
            return Number(acc) + Number(val["Quantity"])},0)

          })
        })
      })
      
      console.log("New Rodeo data :",csvGroupByDZ)
      return csvGroupByDZ
  }
}))
