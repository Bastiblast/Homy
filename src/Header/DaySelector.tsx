import React, { useEffect, useRef } from 'react'
import { uzeCPTSelection } from './uzeSelectedCPT'

export default function DaySelector() {
    const todayDate = new Date(Date.now())
    const today = todayDate.getDate().toString()
    const dayTomorrow = (todayDate.getDate() + 1 ).toString()
    const month = (todayDate.getMonth() + 1).toString()

    const dateStringToday = `${month}-${today}`
    const dateStringTomorrow = `${month}-${dayTomorrow}`

    const selection = useRef(null)

    const updateDay = uzeCPTSelection(s => s.updateDay)
    const day = uzeCPTSelection(s => s.day)

    useEffect(() => {
        if (day) return
        console.log("selection.current",selection.current.value)
        updateDay(selection.current.value)  
    })
    
    const dateChange = () => {
       updateDay(selection.current.value)
    }

  return (
    <select ref={selection} onChange={dateChange}>
        <option>{dateStringToday}</option>
        <option>{dateStringTomorrow}</option>
    </select>
  )
}
