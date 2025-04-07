import React, { useEffect, useState } from 'react'
import { uzeStore } from '../store/uzeStore'
import { createPortal } from 'react-dom'

export default function HeadCount({ligne,headcount}) {
    




        const HCnumber = headcount[ligne].size

        
    
  return (
    <>
    {HCnumber !== 0 ? <div className='font-bold'>HC : {HCnumber} </div> : null}
    </>
  )
}

