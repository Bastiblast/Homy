import React, { useRef } from 'react'
import { uzeStore } from '../store/uzeStore'
import ShiftPaternSelector from '../BonusButton/ShiftPaternSelector'


export default function InfoBox() {
  
const infoBoxContent = uzeStore(s => s.infoBoxContent)

const renderInfoBox = () => {
  if (!infoBoxContent) return
  console.log("New infoboxcontent ",infoBoxContent)
  const render = infoBoxContent === "shift" ? <ShiftPaternSelector /> : infoBoxContent
  return render
}

  return (
    <div className='flex flex-col bg-white w-2/5 h-36 shadow shadow-md'>
      <span className='flex justify-center w-full bg-violet-100 font-bold'>InfoBox</span>
      
        {renderInfoBox()}
      
    </div>
  )
}
