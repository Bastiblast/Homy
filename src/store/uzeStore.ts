import { ReactNode } from 'react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {GM_xmlhttpRequest,GM_setValue} from '$'
import ShiftPaternSelector from '../BonusButton/ShiftPaternSelector';

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

interface Store {
  singleLaneMapping : any;
  headcount: {
    ligne1: Map<string, string> ;
    ligne2: Map<string, string> ;
    ligne3: Map<string, string> ;
    ligne4: Map<string, string> ;
  },
  totalHeadCount: null | number,
  updateTotalHeadCount: (number) => void,
  updateHeadcount: (newCount: {}) => void;
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
}

const PDPurl = "https://share.amazon.com/sites/MRS1-PDP/Documents%20partages/MRS1-PDP/repartMRS1.html"


export const uzeStore = create<Store>(
  (set,get)=>({
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
  infoBoxContent: null,
  infoBoxRef: null,
  capacityDetails: null,
  updateCapacityDetails: (CapacityDetails:CapacityDetails) => {
    console.log("updateCapacityDetails receive new details :",CapacityDetails)
    GM_setValue("Homy_capacityDetails",JSON.stringify(CapacityDetails))
    set({capacityDetails: CapacityDetails})},
  updateIBR: (newIBR) => {
      console.log("updateIBR to : ",newIBR)
      set({infoBoxRef: newIBR})
  },
  updateIBC: (newIBC) => {
      console.log("updateIBC to : ",newIBC)
      set({infoBoxContent: newIBC})
  },
  PDPdata : null,
  PDPFiltereddata : null,
  updatePDPFilteredData: (newData) => {
    set({PDPFiltereddata: newData})
  },
  updatePDPData : () => {
    GM_xmlhttpRequest({
      method: "GET",
      url: PDPurl,
      onload: async function (response) {


        const jsonStart = response.responseText.indexOf("var activite = {")
        const jsonEnd = response.responseText.indexOf("}",jsonStart)
        const jsonString = response.responseText.substring(jsonStart + 15 ,jsonEnd + 1)
        const json = JSON.parse(jsonString)
        const packSinglePDP = Object.values(json).filter(row => {
          return row[2] === "Pack Single Medium" || row[2] === "Pack&Ship"
        })
        console.log({packSinglePDP})
        get().updateIBC("shift")
        set( ({ PDPdata : packSinglePDP }) )      
      },
    })
  }

})
  )

  
  
