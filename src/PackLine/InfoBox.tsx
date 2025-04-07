import React, { useRef } from 'react'
import { uzeStore } from '../store/uzeStore'
import ShiftPaternSelector from '../BonusButton/ShiftPaternSelector'


export default function InfoBox() {
  const infoBoxRef = useRef(null)
  
const infoBoxContent = uzeStore(s => s.infoBoxContent)

const renderInfoBox = () => {
  if (!infoBoxContent) return
  console.log("New infoboxcontent ",infoBoxContent)
  const render = infoBoxContent === "shift" ? <ShiftPaternSelector /> : infoBoxContent
  return render
}

  return (
    <div className='bg-white w-2/5 h-36 mx-2 p-2 shadow shadow-md'>
      <span className='flex justify-center w-full bg-violet-100 font-bold'>InfoBox</span>
      <div className='' ref={infoBoxRef}>
      </div>
      <div>
        {renderInfoBox()}
      </div>
    </div>
  )
}
