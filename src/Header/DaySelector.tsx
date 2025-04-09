import React from 'react'
import { uzeCPTSelection } from './uzeSelectedCPT'

export default function DaySelector() {
    const todayDate = new Date(Date.now())
    const today = todayDate.getDate().toString()
    const dayTomorrow = (todayDate.getDate() + 1 ).toString()
    const month = (todayDate.getMonth() + 1).toString()

    const dateStringToday = `${month}-${today}`
    const dateStringTomorrow = `${month}-${dayTomorrow}`

    const updateDay = uzeCPTSelection(s => s.updateDay)

  return (
    <select onChange={(e) => updateDay(e.target.value)}>
        <option>{dateStringToday}</option>
        <option>{dateStringTomorrow}</option>
    </select>
  )
}
