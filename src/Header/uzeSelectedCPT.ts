import { create } from 'zustand'

interface CPTSelection {
  CPTlist : string[];
  updateCPTTracking : (val : any) => void;
  day: string;
  updateDay: (date: string) => void
}
export const uzeCPTSelection = create<CPTSelection>((set,get)=>({
  CPTlist : [],
  updateCPTTracking : (event: MouseEvent<HTMLButtonElement>) => {
    const actualList = get().CPTlist
    let newArray
    const clickContent: string = event.target.textContent
    console.log({clickContent})
    if (actualList.includes(clickContent)){
        console.log("Delele existing value.")
        newArray = actualList.filter(val => val !== clickContent)
    } else {
        console.log("Adding new value.")

        newArray = [...actualList,clickContent]
    }
   
    console.log({newArray},{actualList})
    
    
    set(({ CPTlist : newArray }) )},
    day: "",
    updateDay: (date: string) => {
      console.log({date})
      let [month,day] = date.split("-")
      month = "0" + month
      month = month.slice(0,2)
      day = "0" + day
      day = day.slice(0,2)
      const newDate = `${month}-${day}`
      console.log({newDate})
      set({day: newDate})
    }
}))
