import { ReactNode } from 'react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {GM,GM_xmlhttpRequest,GM_setValue} from '$'
import {staticPDPDatas} from '../packSinglePDP'
import {staticRodeoDatas} from '../shipmentItemList'
import {staticPickDatas} from '../pickSumList'
import csv from 'csvtojson'
import { capaRodeoStatic } from '../capaRodeo';
import Loader from './loader-component';

const urlCSVrodeo = `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&WorkPool=PickingPickedAtDestination&enabledColumns=ASIN_TITLES&enabledColumns=DEMAND_ID&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&Excel=false&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

//                  `https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on
// &WorkPool=PickingNotYetPicked&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false
// &ExSDRange.RangeStartMillis=${rangeStartMillis}&ExSDRange.RangeEndMillis=${rangeEndMillis}&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`

const urlCSVPickSummary = `https://rodeo-dub.amazon.com/MRS1/CSV/ExSD?isEulerUpgraded=ALL&processPath=&fnSku=&fulfillmentServiceClass=ALL&exSDRange.quickRange=PLUS_MINUS_1_DAY
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



type BuildJSON =  Object[]

interface CapacityDetails {
  dataTime: number,
  CPTInfo? : {
    [key: string]: {
      timeRemain: number,
      riskColor: string
    }
  },
  userPreference: {
    UPH: number,
    TBCPT: number,
  }

}

  type headcount = {
    ligne1: Map<string, string> ;
    ligne2: Map<string, string> ;
    ligne3: Map<string, string> ;
    ligne4: Map<string, string> ;
  }
interface Store {
    fullInfo: boolean,
  updateFullInfo: (Boolean) => void,
    CPTlist : string[];
  updateCPTTracking : (val : any) => void;
  day: string;
  updateDay: (date: string) => void;
  pageTime : number;
  updatePageTime : (newTime: number) => void;
  singleLaneMapping : any;
  headcount: {
    ligne1: Map<string, string> ;
    ligne2: Map<string, string> ;
    ligne3: Map<string, string> ;
    ligne4: Map<string, string> ;
  },
  totalHeadCount: null | number,
  updateTotalHeadCount: (number) => void,
  updateHeadcount: (newCount: headcount) => void;
  UPH: number;
  updateUPH: (number: number) => void ;
  TBCPT: number;
  updateTBCPT: (number: number) => void ;
  timeToNextCPT: number;
  updateTimeToNextCPT: (number: number) => void;
  capacityDetails: null | CapacityDetails;
  updateCapacityDetails: (CapacityDetails) => void;
  infoBoxContent: null | ReactNode;
  infoBoxRef: null | ReactNode;
  updateIBR: (newIBR: ReactNode) => void;
  updateIBC: (newIBC: ReactNode) => void;
  PDPdata : any;
  PDPFiltereddata : any;
  updatePDPData : () => void;
  updatePDPFilteredData : (newData) => void;
    environnement: 'developpement' | 'production',
  data : null | BuildJSON;
  dataTotal: null | BuildJSON;
    updateDataTotal: (newData: BuildJSON) => void ;
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

const PDPurl = "https://share.amazon.com/sites/MRS1-PDP/Documents%20partages/MRS1-PDP/repartMRS1.html"


export const uzeStore = create<Store>(
  (set,get)=>({
      CPTlist : [],
  updateCPTTracking : (event: React.MouseEvent<HTMLButtonElement>) => {
    
    const actualList = get().CPTlist
    let newArray
    const clickElement = event.target as HTMLButtonElement
    const clickContent: string = clickElement.dataset.time || ""
    //console.log("updateCPTTracking",clickContent)
    if (actualList.includes(clickContent)){
        newArray = actualList.filter(val => val !== clickContent)
    } else {
        newArray = [...actualList,clickContent]
    }

    const CPTArray = [...newArray].sort()
    //console.log({CPTArray})
    const timeBeforeNextCPT = (new Date(CPTArray[0]) - Date.now())/ 60 / 60 / 1000

    set(({ CPTlist : newArray, timeToNextCPT: timeBeforeNextCPT }) )},
    day: "",
    updateDay: (date: string) => {
      let [month,day] = date.split("-")
      month = "0" + month
      month = month.slice(0,2)
      day = "0" + day
      day = day.slice(0,2)
      const newDate = `${month}-${day}`
      set({day: newDate})
    },
    updatePageTime: (newTime) => set ({pageTime: newTime}),
    environnement: 'developpement',
    pageTime: () => get().environnement === "developpement" ? 1753780800000 : 0,
  singleLaneMapping : {
    Ligne1: [107,108,109,110,111,112,113,114,115,116,117],
    Ligne2: [209,210,211,212,213,214,215,216],
    Ligne3: [309,310,311,312,313,314,315],
    Ligne4: [407,408,409,410,411,412,413,414,415,416],
    },
  totalHeadCount: null,
  updateTotalHeadCount: (number) => set ({totalHeadCount:number}),


  headcount: {
    ligne1: new Map(),
    ligne2: new Map(),
    ligne3: new Map(),
    ligne4: new Map(),
  },
  updateHeadcount: (newCount) => {
    set({headcount: newCount})
  },
  UPH: 0,
  updateUPH: (newCount) => {
    set({UPH: newCount})
  },
  TBCPT: 0,
  updateTBCPT: (newCount) => {
    set({TBCPT: newCount})
  },
  timeToNextCPT: 0,
  updateTimeToNextCPT: (number) => set({timeToNextCPT: number}),
  infoBoxContent: null,
  infoBoxRef: null,
  capacityDetails: null,
  updateCapacityDetails: (CapacityDetails:CapacityDetails) => {
    //console.log("updateCapacityDetails receive new details :",CapacityDetails)
    GM_setValue("Homy_capacityDetails",JSON.stringify(CapacityDetails))
    set({capacityDetails: CapacityDetails})},
  updateIBR: (newIBR) => {
      //console.log("updateIBR to : ",newIBR)
      set({infoBoxRef: newIBR})
  },
  updateIBC: (newIBC) => {
      //console.log("updateIBC to : ",newIBC)
      set({infoBoxContent: newIBC})
  },
  PDPdata : null,
  PDPFiltereddata : null,
  updatePDPFilteredData: (newData) => {
    set({PDPFiltereddata: newData})
  },
  updatePDPData : () => {

    switch (get().environnement) {
      case 'developpement' :
                get().updateIBC("shift")
        set( ({ PDPdata : staticPDPDatas }) )  

      break
      case 'production' :
    GM_xmlhttpRequest({
      method: "GET",
      url: PDPurl,
      onload: async function (response) {


        const jsonStart = response.responseText.indexOf("var activite = {")
        const jsonEnd = response.responseText.indexOf("}",jsonStart)
        const jsonString = response.responseText.substring(jsonStart + 15 ,jsonEnd + 1)
        const json = JSON.parse(jsonString)
        const packSinglePDP = Object.values(json).filter(row => {
          const processName = row[2] as string
          return processName === "Pack Single Medium" || processName === "Pack&Ship"
        })
        //console.log({packSinglePDP})
        get().updateIBC("shift")

        set( ({ PDPdata : packSinglePDP, totalHeadCount: packSinglePDP.length }) )      
      },
    })
      break
    }

  },
  

  data: null,
  dataTotal: null,
  fullInfo: false,
  updateFullInfo: (Boolean) => set({fullInfo: Boolean}),
  updateDataTotal: (newData: BuildJSON) => {
    set({dataTotal: newData})
  } ,
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
    if (get().refresherCapa === "done") return
    if (get().environnement === "developpement") {
      console.log("getRodeoCapa",capaRodeoStatic)
      const object = get().dataPick
      const newCapa = new Map(Array.from(capaRodeoStatic.entries()).map((value,index) => {
        console.log({value})

        const newDate = object[index][0]
        console.log({newDate}, Date.parse(newDate))
        return [newDate,value[1]]
      }))
      console.log({newCapa})
  set({dataCapa:newCapa,refresherCapa:"done",dataCapaAge:get().pageTime})

return
    }
    const stamp = get().pageTime
    const rangeStartMillis = String(stamp - 3600000).slice(0,8) +"99999"
    const rangeEndMillis = stamp + (3600000 * 4)

    const processPath = ["PickingNotYetPicked","PickingPicked"].map(pp => "WorkPool="+pp+"&" )

 
   const promises = await processPath.map(pp => {
      const urlCSVCapaRodeo = decodeURI(`https://rodeo-dub.amazon.com/MRS1/ItemListCSV?_enabledColumns=on&${pp}enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&ExSDRange.RangeStartMillis=${rangeStartMillis}&ExSDRange.RangeEndMillis=${rangeEndMillis}&Fracs=NON_FRACS&ProcessPath=PPSingleMedium&shipmentType=CUSTOMER_SHIPMENTS`)
      return GM.xmlHttpRequest({
        method:"GET",
        url:urlCSVCapaRodeo, 
        headers: {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
    "cache-control": "max-age=0",
    "priority": "u=0, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  }

      })
        .then(resp => csv().fromString(resp.responseText))
        .then(array => {
          //console.log("getting rodeo CSV",array)
          return array})
    })
  
  

    const [pickingArray,pickedArray] = await Promise.all(promises)
    
    //console.log(pickingArray.length,pickedArray.length)

    if (pickingArray.length === 0 && pickedArray.length === 0) {
      //console.log("cancelling")
      get().updateCapaRefresher(get().refresherCapa + ".")
      get().updateIBC(<Loader>En attente de rodeo   </Loader>)
      return
    }
      get().updateIBC(<Loader>Building Tab   </Loader>)

    //console.log("getCap response ",promises,pickedArray,pickedArray)
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

      get().updateIBC(<Loader>Query some more information   </Loader>)

    const prioToteDetailPromise = await [...prioTote].map(tote => {
      const urlByTote = `https://rodeo-dub.amazon.com/MRS1/SearchCSV?_enabledColumns=on&enabledColumns=ASIN_TITLES&enabledColumns=OUTER_SCANNABLE_ID&Excel=false&searchKey=${tote}&shipmentType=CUSTOMER_SHIPMENTS`
      const response = GM.xmlHttpRequest({method: "GET",url:urlByTote})
      .then(resp => csv().fromString(resp.responseText))
      .then(shipments => {
        return {tote: tote,shipments:shipments.length}})

      return response
    })

    const prioToteDetailFetched = await Promise.all(prioToteDetailPromise)

    //console.log("getRodeoData prioToteDetailFetched",prioToteDetailFetched)
    //console.log("getRodeoData inTransitTote",inTransitTote)

      get().updateIBC(<Loader>Almost done   </Loader>)


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


    //console.log("getRodeoData mapping picking",mappingCPTpicking)
    //console.log("getRodeoData mapping picked",mappingCPTpicked)
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

  set({dataCapa:mergedPickingAndPickedArray,refresherCapa:"done",dataCapaAge:get().pageTime})

    return 
  },
  getRodeoData: () => {
    if (get().refresher === "done") return
    //console.log("urlCSVrodeo ",decodeURI(urlCSVrodeo))
    switch (get().environnement) {
      case 'production' :
            GM_xmlhttpRequest({
    method: "GET",
    url: decodeURI(urlCSVrodeo),
    onload: function(response) {
      //console.log("urlCSVrodeo response ",response,response.responseText)
      csv().fromString(response.responseText).then((csvRow) => {
      set({refresher: "done"})
      set({arrayData: csvRow})
      set({data: get().buildJSON(csvRow)})
    }
    )
    }
  })
  break
  case 'developpement' :
    //console.log("staticRodeoDatas",staticRodeoDatas, typeof staticRodeoDatas)
      csv().fromString(staticRodeoDatas).then((csvRow) => {
    
      set({refresher: "done"})
      set({arrayData: csvRow})
      set({data: get().buildJSON(csvRow)})
      })
    break
    }
},
  getRodeoPickData: async () => {

    if (get().refresherPick === "done") return

    let response
    switch (get().environnement) {
      case 'developpement': 
      response = staticPickDatas
      break
      case 'production':
    response = await GM.xmlHttpRequest({
    method: "GET",
    url: urlCSVPickSummary,
    })
    response = response.responseText
      break
    }


    const CPTMap = new Map()

    //console.log("pickData response",response)

    const alternateConvert = await csv().fromString(response)
    alternateConvert.forEach(row => {
      //console.log("data pick",row)
        const unitExpectShipDate = row["ExSD"]
        const unitQuantity = Number(row["Quantity"])
        const unitPP = row["Process Path"]
        const unitWorpPool = row["Work Pool"]

        const allowedWorkPool = ["PickingNotYetPicked","PickingPicked"]
        if (isNaN(unitQuantity) || unitPP !== "PPSingleMedium" || !allowedWorkPool.includes(unitWorpPool)) return
        if (unitWorpPool === "PickingPicked") {
          CPTMap.has(unitExpectShipDate) ? null : CPTMap.set(unitExpectShipDate,0)
        } else {
          CPTMap.has(unitExpectShipDate) ? CPTMap.set(unitExpectShipDate, CPTMap.get(unitExpectShipDate) + unitQuantity) : CPTMap.set(unitExpectShipDate,unitQuantity)
        }
    })

    set({refresherPick: "done",dataPickAge:get().pageTime})
    
    const CPTArray = [...CPTMap].sort()
    //console.log({CPTArray})
    const timeBeforeNextCPT = (new Date(CPTArray[0][0]) - Date.now())/ 60 / 60 / 1000
    //console.log({timeBeforeNextCPT} )
    set({dataPick: CPTArray.slice(0,6),timeToNextCPT: timeBeforeNextCPT})

    

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
      //console.log("Json build",csvGroupByDZ)
      return csvGroupByDZ
  }


})
  )

  
  
