import { create } from 'zustand'

interface CPTSelection {
  CPTlist : string[];
  updateCPTTracking : (val : any) => void;
  day: string;
  updateDay: (date: string) => void
}
export const uzeCPTSelection = create<CPTSelection>((set,get)=>({
  CPTlist : [],
  updateCPTTracking : (event: React.MouseEvent<HTMLButtonElement>) => {
    const actualList = get().CPTlist
    let newArray
    const clickElement = event.target as HTMLButtonElement
    const clickContent: string = clickElement.textContent || ""
    console.log("updateCPTTracking",clickContent)
    if (actualList.includes(clickContent)){
        newArray = actualList.filter(val => val !== clickContent)
    } else {
        newArray = [...actualList,clickContent]
    }

    set(({ CPTlist : newArray }) )},
    day: "",
    updateDay: (date: string) => {
      let [month,day] = date.split("-")
      month = "0" + month
      month = month.slice(0,2)
      day = "0" + day
      day = day.slice(0,2)
      const newDate = `${month}-${day}`
      set({day: newDate})
    }
}))
