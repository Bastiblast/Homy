import { create } from 'zustand'
import {GM_xmlhttpRequest} from '$'
import csv from 'csvtojson'

interface uzePackMan {
  PMdata : null;
  PMrefresher: string;
  updatePMrefresher: (status: string) => void;
  getPackManData: () => void;
  buildJSON : (val : any) => void;
}


const urlPackMan = `https://zq03me9sqc.execute-api.eu-west-1.amazonaws.com/prod-eu/get_packman_table_data_list`

export const uzePackMan = create<uzePackMan>((set,get)=>({
    PMdata: null,
    PMrefresher: "loading",
    updatePMrefresher: (status: string) => {
        set({PMrefresher:status})
        get().getPackManData()
    },
    getPackManData: () => {
        if (get().PMrefresher === "done") return
        const timeStamp = (Date.now() / 1000).toFixed(3)
    const postBody: string = `{"warehouseId":"MRS1","startTime":${Number(timeStamp) - 36000},"endTime":${timeStamp}}`
    const bodyTester = '{"warehouseId":"MRS1","startTime":1733217726.292,"endTime":1733221326.292}'
    console.log({postBody})
    console.log("PMrefresher is : ",get().PMrefresher)
    if (get().PMrefresher === "done") return
    console.log("getting data")
    GM_xmlhttpRequest({
        method: "POST",
        url: urlPackMan,
        data: postBody,
        credentials: "omit",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
          console.log("PackMan response :",response)
          console.log("PackMan response :",response.responseText)
          set({PMdata: JSON.parse(response.responseText)})
          set({PMrefresher: "done"})
        }
      });
},
  buildJSON: (csvRow) => {
    { 
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
      
      console.log("csvGroupByDZ",csvGroupByDZ)
      console.log("filter dz-P-OB-Single-cvg-111",csvRow.filter(row => row["Outer Scannable ID"] === "dz-P-OB-Single-cvg-111"))
      set({PMdata: csvGroupByDZ})
  }
  }
}))
