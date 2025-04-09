import React, { forwardRef } from 'react'

const CPTSelector = forwardRef((props, ref) => {

  return ( 
    <select name="CPTSelector" key="cpt-selector" ref={ref} multiple className='w-22'>
        <option value="09:00">02:30</option>
        <option value="09:00">03:00</option>
        <option value="09:00">09:00</option>
        <option value="09:00">11:45</option>
        <option value="09:00">12:15</option>
        <option value="09:00">12:45</option>
        <option value="09:00">15:30</option>
        <option value="09:00">16:15</option>
        <option value="09:00">17:00</option>
        <option value="09:00">20:00</option>
        <option value="09:00">20:30</option>
        <option value="09:00">23:30</option>
        <option value="09:00">23:55</option>
    </select>
  )
})

export default CPTSelector