import { create } from 'zustand'
// @ts-ignore TS don't recognize scriptmonkey quick
import {GM,GM_xmlhttpRequest} from '$'
import csv from 'csvtojson'

type BuildJSON =  Object[]

interface uzeRodeo {
  data : null | BuildJSON;
  arrayData : null | object[];
  dataPick : null | [string, Map<string,number>][];
  dataCapa : null | Map<string,Map<string,number>>;
  dataCapaAge : null | number;
  dataPickAge : null | number;
  refresher: string;
  refresherCapa: string;
  refresherPick: string;
  updateRefresher: (status: string) => void;
  updateCapaRefresher: (status: string) => void;
  updatePickRefresher: (status: string) => void;
  getRodeoData: () => void;
  getRodeoCapa: () => void;
  getRodeoPickData: () => void;
  buildJSON : (val : any) => BuildJSON;
}

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

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
  dataPickAge: null,
  dataCapa: null,
  dataCapaAge: null,
  refresher: "loading", // modify to loading to load at start
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
    const stamp = Date.now()
    const rangeStartMillis = String(stamp - 3600000).slice(0,8) +"99999"
    const rangeEndMillis = stamp + (3600000 * 4)

    const processPath = ["PickingNotYetPicked","PickingPicked"].map(pp => "WorkPool="+pp+"&" )

    const promises = await processPath.map(pp => {
      const urlCSVCapaRodeo = decodeURI(`https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&${pp}enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&ExSDRange.RangeStartMillis=${rangeStartMillis}&ExSDRange.RangeEndMillis=${rangeEndMillis}&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`)
      return GM.xmlHttpRequest({method:"GET",url:urlCSVCapaRodeo,overrideMimeType:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"})
        .then(resp => csv().fromString(resp.responseText))
        .then(array => array)
    })

    const [pickingArray,pickedArray] = await Promise.all(promises)


    console.log("getCap response ",promises,pickedArray,pickedArray)
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

    const prioTote = new Set(pickedArray.map(row => row["Scannable ID"]))
 
    const transitArray = get().arrayData

    const inTransitTote = new Map()

    transitArray && transitArray.forEach(element => {
      const tote = element["Scannable ID"]
      const quantiy = Number(element["Quantity"])
      const existingQuantity = inTransitTote.get(tote) ? inTransitTote.get(tote) : 0
      inTransitTote.set(tote,existingQuantity + quantiy)
    });

    prioTote.forEach(tote => inTransitTote.get(tote) && prioTote.delete(tote))

    const prioToteDetailPromise = await [...prioTote].map(tote => {
      const urlByTote = `https://rodeo-dub.amazon.com/MRS1/SearchCSV?_enabledColumns=on&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false&searchKey=${tote}&shipmentType=CUSTOMER_SHIPMENTS`
      const response = GM.xmlHttpRequest({method: "GET",url:urlByTote})
      .then(resp => csv().fromString(resp.responseText))
      .then(shipments => {return {tote: tote,shipments:shipments.length}})

      return response
    })

    const prioToteDetailFetched = await Promise.all(prioToteDetailPromise)

    //console.log("getRodeoData prioToteDetailFetched",prioToteDetailFetched)
    //console.log("getRodeoData inTransitTote",inTransitTote)



    const mergeToteDetail = [...prioToteDetailFetched,...[...inTransitTote].map(entries => {return {tote:entries[0],shipments:entries[1]}})]

    //console.log("getRodeoData mergeToteDetail",mergeToteDetail)

    const mappingCPTpicked = new Map()

    pickedArray.forEach(shipment => {
      const cpt = shipment["Expected Ship Date"]
      const tote = shipment["Scannable ID"]
      // add CPT and tote for each
      //console.log("getRodeoData mappingCPTpicker find ",mergeToteDetail.find(bt => bt.tote === tote))
      if (!mappingCPTpicked.has(cpt) && mergeToteDetail.find(bt => bt.tote === tote)) {
        mergeToteDetail.find(bt => bt.tote === tote) && mappingCPTpicked.set(cpt,new Map().set(tote,mergeToteDetail.find(bt => bt.tote === tote).shipments))
      } else if (mergeToteDetail.find(bt => bt.tote === tote)) {
        mappingCPTpicked.get(cpt).set(tote,mergeToteDetail.find(bt => bt.tote === tote).shipments)
      } 
    })


    console.log("getRodeoData mapping picking",mappingCPTpicking)
    console.log("getRodeoData mapping picked",mappingCPTpicked)
  const mergedPickingAndPickedArray = new Map()

  const CPTpickingArray = [...mappingCPTpicking]
  CPTpickingArray.forEach(CPT => {
    const [cpt,listValue] = CPT
    if (mergedPickingAndPickedArray.get(cpt)) {
      mergedPickingAndPickedArray.set(cpt,new Map([...mergedPickingAndPickedArray.get(cpt),...listValue]))
      } else {
        mergedPickingAndPickedArray.set(cpt,new Map(listValue))
      }
  })  
  
  //console.log("getRodeoData merge + picking",mappingCPTpicked)

  const CPTpickedArray = [...mappingCPTpicked]
  CPTpickedArray.forEach(CPT => {
    const [cpt,listValue] = CPT
    if (mergedPickingAndPickedArray.get(cpt)) {
      mergedPickingAndPickedArray.set(cpt,new Map([...mergedPickingAndPickedArray.get(cpt),...listValue]))
      } else {
        mergedPickingAndPickedArray.set(cpt,new Map(listValue))
      }

  })
  //console.log("getRodeoData merge + picked",mappingCPTpicked)


  //console.log("getRodeoData mergedPickingAndPickedArray ",mergedPickingAndPickedArray)

  set({dataCapa:mergedPickingAndPickedArray,refresherCapa:"done",dataCapaAge:Date.now()})

    return 
  },
  getRodeoData: () => {
    if (get().refresher === "done") return
    console.log("urlCSVrodeo ",decodeURI(urlCSVrodeo))
    GM_xmlhttpRequest({
    method: "GET",
    url: decodeURI(urlCSVrodeo),
    onload: function(response) {
      console.log("urlCSVrodeo response ",response,response.responseText)
      csv().fromString(response.responseText).then((csvRow) => {
      set({refresher: "done"})
      set({arrayData: csvRow})
      set({data: get().buildJSON(csvRow)})
    }
    )
    }
  })},
  getRodeoPickData: async () => {

    if (get().refresherPick === "done") return

    const response = await GM.xmlHttpRequest({
    method: "GET",
    url: urlCSVPickSummary,
    })

    const CPTMap = new Map()

    const alternateConvert = await csv().fromString(response.responseText)
    alternateConvert.forEach(row => {
        const unitExpectShipDate = row["ExSD"]
        const unitQuantity = Number(row["Quantity"])
        const unitPP = row["Process Path"]
        const unitWorpPool = row["Work Pool"]

        const allowedWorkPool = ["PickingNotYetPicked"]
        if (isNaN(unitQuantity) || unitPP !== "PPSingleMedium" || !allowedWorkPool.includes(unitWorpPool)) return
        CPTMap.has(unitExpectShipDate) ? CPTMap.set(unitExpectShipDate, CPTMap.get(unitExpectShipDate) + unitQuantity) : CPTMap.set(unitExpectShipDate,unitQuantity)
    })

    set({refresherPick: "done",dataPickAge:Date.now()})
    
    const CPTArray = [...CPTMap].sort()
    set({dataPick: CPTArray})

    

},
  buildJSON: (csvRow) => {
    // @ts-ignore TS don't recognize groupBy
      const csvGroupByDZ = Object.groupBy(csvRow, (row) => row["Outer Scannable ID"])
      Object.entries(csvGroupByDZ).forEach((entries) => {
        const [key,val] = entries
        // @ts-ignore TS don't recognize groupBy

        const subGroup = Object.groupBy(val,(row) => row["Scannable ID"])
        csvGroupByDZ[key] = subGroup
        Object.entries(csvGroupByDZ[key]).forEach((entries) => {
          const [keyz,value] = entries
          // @ts-ignore TS don't recognize groupBy

          const zubGroup = Object.groupBy(value,(row) => row["Expected Ship Date"])
          csvGroupByDZ[key][keyz] = zubGroup
        })
      })
      
      return csvGroupByDZ
  }
}))
