import { create } from 'zustand'
import {GM_xmlhttpRequest} from '$'
import {GM} from '$'
import csv from 'csvtojson'
import TESTING from '../rodeolocal/rodeo'

interface uzeRodeo {
  data : null;
  arrayData : null;
  dataPick : null;
  dataCapa : null;
  refresher: string;
  refresherCapa: string;
  refresherPick: string;
  updateRefresher: (status: string) => void;
  updateCapaRefresher: (status: string) => void;
  updatePickRefresher: (status: string) => void;
  getRodeoData: () => void;
  getRodeoCapa: () => void;
  getRodeoPickData: () => void;
  buildJSON : (val : any) => void;
}

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on
&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID
&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false
&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

//                  `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on
// &WorkPool=PickingNotYetPicked&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false
// &ExSDRange.RangeStartMillis=${rangeStartMillis}&ExSDRange.RangeEndMillis=${rangeEndMillis}&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

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
  arrayData: null,
  dataPick: null,
  dataCapa: null,
  refresher: "done", // modify to loading to load at start
  refresherCapa: "done", // modify to loading to load at start
  refresherPick: "done",
  updateRefresher: (status: string) => {
    set({refresher:status})
    get().getRodeoData()},
    
  updateCapaRefresher: (status: string) => {
  set({refresherCapa:status})
  get().getRodeoCapa()},

updatePickRefresher: (status: string) => {
  set({refresherPick:status})
  get().getRodeoPickData()
},
  getRodeoCapa: async () => {
    //console.log("getRodeoCapa starting....")

    const stamp = Date.now()
    const rangeStartMillis = String(stamp - 3600000).slice(0,8) +"99999"
    const rangeEndMillis = stamp + (3600000 * 4)

    //console.log("getRodeoCapa stamp ",stamp,{rangeStartMillis},{rangeEndMillis})

    const processPath = ["PickingNotYetPicked","PickingPicked"].map(pp => "WorkPool="+pp+"&" )

    
    
    const promises = await processPath.map(pp => {
      const urlCSVCapaRodeo = decodeURI(`https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&${pp}enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&ExSDRange.RangeStartMillis=${rangeStartMillis}&ExSDRange.RangeEndMillis=${rangeEndMillis}&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`)
    //console.log("getRodeoCapa url ",pp,urlCSVCapaRodeo)
    return GM.xmlHttpRequest({method:"GET",url:urlCSVCapaRodeo})
      .then(resp => csv().fromString(resp.responseText))
      .then(array => array)
  })

    //console.log("getRodeoCapa get ",promises)

    const [pickingArray,pickedArray] = await Promise.all(promises)

    console.log("getRodeoCapa array",pickingArray,pickedArray)

    const mappingCPTpicking = new Map()

    pickingArray.forEach(shipment => {
      const cpt = shipment["Expected Ship Date"]
      const quantity = Number(shipment["Quantity"])
      if (mappingCPTpicking.has(cpt)) {
        mappingCPTpicking.get(cpt).set("picking", quantity + mappingCPTpicking.get(cpt).get("picking"))
      } else {
        mappingCPTpicking.set(cpt,new Map().set("picking",quantity))
      }
    })

 
    console.log("getRodeoCapa mappingCPTpicking picking", mappingCPTpicking)

    const prioTote = new Set(pickedArray.map(row => row["Scannable ID"]))
    //console.log("getRodeoCapa prioTote",prioTote)
    
    console.log("getRodeoCapa get transit data ",get().arrayData)

    const transitArray = get().arrayData

    const inTransitTote = new Map()

    transitArray && transitArray.forEach(element => {
      const tote = element["Scannable ID"]
      const quantiy = Number(element["Quantity"])
      const existingQuantity = inTransitTote.get(tote) ? inTransitTote.get(tote) : 0
      inTransitTote.set(tote,existingQuantity + quantiy)
    });

    console.log("getRodeoCapa inTransitTote prio",prioTote)
    prioTote.forEach(tote => inTransitTote.get(tote) && prioTote.delete(tote))


    console.log("getRodeoCapa inTransitTote",inTransitTote)
    console.log("getRodeoCapa inTransitTote new prio",prioTote)

    const prioTotePromise = await [...prioTote].map(tote => {
      const urlByTote = `https://rodeo-dub.amazon.com/MRS1/SearchCSV?_enabledColumns=on&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false&searchKey=${tote}&shipmentType=CUSTOMER_SHIPMENTS`
      const response = GM.xmlHttpRequest({method: "GET",url:urlByTote})
      .then(resp => csv().fromString(resp.responseText))
      .then(shipments => {return {tote: tote,shipments:shipments.length}})

      return response
    })

    const prioToteFetched = await Promise.all(prioTotePromise)

    //console.log("getRodeoCapa prioToteFetched",prioToteFetched)

    const mergeToteDetail = [...prioToteFetched,...inTransitTote]

    console.log("getRodeoCapa merdegPrioDetail",mergeToteDetail)
    const mappingCPTpicked = new Map()

    // TESTING replace pickedArray

    const TESTINGarray = await csv().fromString(TESTING)

    pickedArray.forEach(shipment => {
      const cpt = shipment["Expected Ship Date"]
      const tote = shipment["Scannable ID"]
      // add CPT and tote for each
      if (!mappingCPTpicked.has(cpt)) {
        mergeToteDetail.find(bt => bt.tote === tote) && mappingCPTpicked.set(cpt,new Map().set(tote,mergeToteDetail.find(bt => bt.tote === tote).shipments))
      } else {mergeToteDetail.find(bt => bt.tote === tote).shipments && mappingCPTpicked.get(cpt).set(tote,mergeToteDetail.find(bt => bt.tote === tote).shipments)}
    })

  console.log("getRodeoCapa mappingCPTpicked ",mappingCPTpicked)

    // Adding Picking
  
  const mergedArray = new Map()

  mappingCPTpicking.entries().forEach(CPT => {
    const [cpt,listValue] = CPT
    //console.log("getRodeoCapa CPT",CPT)

    if (mergedArray.get(cpt)) {
      mergedArray.set(cpt,new Map([...mergedArray.get(cpt),...listValue]))
      } else {
        mergedArray.set(cpt,new Map(listValue))
      }

  })

  console.log("getRodeoCapa mappingCPTpicking picking mergedArray", mergedArray)

  mappingCPTpicked.entries().forEach(CPT => {
    const [cpt,listValue] = CPT
    //console.log("getRodeoCapa CPT",CPT)

    if (mappingCPTpicked.get(cpt)) {
      mergedArray.set(cpt,new Map([...mappingCPTpicked.get(cpt),...listValue]))
      } else {
        mergedArray.set(cpt,new Map(listValue))
      }

  })

  console.log("getRodeoCapa mapping mergedArray",mergedArray)
    
    set({dataCapa:mergedArray,refresherCapa:"done"})

    return 
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
      set({arrayData: csvRow})
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
