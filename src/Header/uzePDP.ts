import { create } from 'zustand'
import {GM_xmlhttpRequest} from '$'

interface PDP {
  PDPdata : any;
  getPDPData : () => void;
}

const urlPDP = "https://share.amazon.com/sites/MRS1-PDP/Documents%20partages/MRS1-PDP/repartMRS1.html"
export const uzePDP = create<PDP>((set)=>({
  PDPdata : 'VALUE',
  getPDPData : () => {
    GM_xmlhttpRequest({
        method: "GET",
        url: urlPDP,
        onload: function(response) {
          console.log("uzePDP getPDPData ",response.responseText)
        }
      })
  }
}))
