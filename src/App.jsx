import PackLine from './PackLine/index';
import MultiSelectorBtn from './Header/MultiSelectorBtn';
import { uzeStore } from './store/uzeStore';
import InfoBox from './PackLine/InfoBox';
import TotalHeadCount from './PackLine/TotalHeadCount';
import BonusButton from './BonusButton/index'
import { useEffect } from 'react';
import {GM_getValue,GM_setValue} from '$';
function App() {
  const updateRefresher = uzeStore(s => s.updateRefresher)
  const refresher = uzeStore(s => s.refresher)
  const updateCapacityDetails = uzeStore(s => s.updateCapacityDetails)
  const updatePickRefresher = uzeStore(s => s.updatePickRefresher)

  const pageTime = uzeStore(s => s.pageTime)
  const updatePageTime = uzeStore(s => s.updatePageTime)

const refreshHandle = () => {
  updateRefresher("loading")
}

useEffect(() => {
  const stamp = Date.now()

  const timer = setInterval(() => {
    updatePageTime(stamp)
    console.log("timer")
  },10000)
  return () => clearInterval(timer)
})

useEffect(() => {
  if (pageTime) return
  const storedValue = GM_getValue("Homy_capacityDetails")
  const initValue = storedValue ? JSON.parse(storedValue) : {
  dataTime: 0,
  userPreference: {
    UPH: 145,
    TBCPT: 45,
  }

}
  updateCapacityDetails(initValue)
  updatePickRefresher("loading")
})

  return (
    <div className="App h-full bg-gradient-to-b from-white to-violet-500">

      <header className='flex justify-between p-2'>
        <div className='flex flex-col justify-between'>
          <h1 className='text-5xl py-3 font-bold'>Pack Single Tracker</h1>
          <TotalHeadCount />
          <div className='flex flex-row'>

          <MultiSelectorBtn />
          <div className='flex flex-col mx-2 items-center'>
            <label htmlFor="" className='flex items-center'>Date</label>
          </div>
          {refresher === "loading" ? <button className='btn text-white mx-2 w-20' disabled><span className=' loading loading-spinner loading-xl'></span></button> : <button className='btn mx-2 w-20' onClick={refreshHandle}>Refresh</button>}
          </div>
        </div>
        <BonusButton />
        <InfoBox />
      </header>

        <PackLine/>
    </div>
  );
}

export default App;
