import PackLine from './PackLine/index';
import MultiSelectorBtn from './Header/MultiSelectorBtn';
import { uzeStore } from './store/uzeStore';
import InfoBox from './PackLine/InfoBox';
import TotalHeadCount from './PackLine/TotalHeadCount';
import BonusButton from './BonusButton/index'
import React, { useEffect,useState } from 'react';
import {GM_getValue,GM_setValue} from '$';
import {singlePlanTemplate,getLastPlanSingle} from './BonusButton/nail-the-plan/get-lastSinglePlan'
import ActivityDetails from './activityDetails';


function App() {
  const totalHeadCount = uzeStore(s => s.totalHeadCount)
  const updateTotalHeadCount = uzeStore(s => s.updateTotalHeadCount)

  const updateRefresher = uzeStore(s => s.updateRefresher)
  const refresher = uzeStore(s => s.refresher)
  const updateCapacityDetails = uzeStore(s => s.updateCapacityDetails)
  const updatePickRefresher = uzeStore(s => s.updatePickRefresher)

  const pageTime = uzeStore(s => s.pageTime)
  const updatePageTime = uzeStore(s => s.updatePageTime)

  const environnement = uzeStore(s =>s.environnement)
  const [plan,setPlan] = useState<typeof singlePlanTemplate[0] | null>(null)

const refreshHandle = () => {
  updateRefresher("loading")
}
            

const updatePlan = () => {
  //console.log({plan})
  if (plan && (environnement === "developpement" ? pageTime : Date.now() - plan.stamp < 30000)) {
    //console.log("fresh data return")
    return} else {
      //console.log("getting new data")
      getLastPlanSingle(environnement).then(newPlan => {setPlan(
        {...plan, 
          data: newPlan[0],
        stamp: environnement === "developpement" ? pageTime + 50000 : Date.now(),
        update: updatePlan
      }
    )
    if (totalHeadCount === 0) {
      updateTotalHeadCount(newPlan[0].planned_hc)
    }
  }
)
}
}

useEffect(() => {
  const stamp = environnement === "developpement" ? pageTime + 50000 : Date.now()

  const timer = setInterval(() => {
    updatePageTime(stamp)
    updatePlan()

  },10000)
  return () => clearInterval(timer)
},[pageTime])

useEffect(() => {
  const timer = setInterval(() => {

    updateRefresher("loading")
  },45000)
  return () => clearInterval(timer)
},[])

useEffect(() => {
  //console.log({pageTime})
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
},[])

useEffect(() => {
  const timer = setInterval(() => {
    getLastPlanSingle(environnement).then(newPlan => {
      setPlan({...plan, 
        data: newPlan[0],
        stamp: environnement === "developpement" ? pageTime + 50000 : Date.now(),
      })})
  },30000)
  return () => clearInterval(timer)
})

    
  return (
    <div className="bg-gradient-to-b from-white to-violet-500 p-4 h-full App">

      <header className='flex justify-between p-2'>
        <div className='flex flex-col justify-between'>
          <h1 className='py-3 font-bold text-5xl'>Pack Single Tracker</h1>
          <TotalHeadCount />
          <div className='flex flex-row'>

          <MultiSelectorBtn/>

          {refresher === "loading" ? <button className='mx-2 w-20 text-white btn' disabled><span className='loading loading-spinner loading-xl'></span></button> : <button className='mx-2 w-20 btn' onClick={refreshHandle}>Refresh</button>}
          </div>
        </div>
        <BonusButton  data={{plan}}  />
        <div>

        <ActivityDetails />
        </div>
        <InfoBox />
      </header>

        <PackLine/>
    </div>
  );
}

export default App;
