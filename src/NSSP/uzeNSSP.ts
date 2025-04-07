import { create } from 'zustand'

interface NSSP {
  NSSPPlanList : null | object;
  updateNSSPPlanList : (val : any) => void;
}
export const uzeNSSP = create<NSSP>((set)=>({
  NSSPPlanList : null,
  updateNSSPPlanList : (endpoint) => {

    set(({ NSSPPlanList : planList }) 

    )}
}))
