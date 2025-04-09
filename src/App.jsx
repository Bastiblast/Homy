import PackLine from './PackLine/index';
import MultiSelectorBtn from './Header/MultiSelectorBtn';
import DaySelector from './Header/DaySelector';
import { uzeRodeo } from './Header/uzeRodeo';
import InfoBox from './PackLine/InfoBox';
import TotalHeadCount from './PackLine/TotalHeadCount';
import BonusButton from './BonusButton/index'


function App() {
  const updateRefresher = uzeRodeo(s => s.updateRefresher)
  const refresher = uzeRodeo(s => s.refresher)

const refreshHandle = () => {
  updateRefresher("loading")
}

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
            <DaySelector />
          </div>
          {refresher === "loading" ? <button className='btn text-white mx-2 w-20' disabled><span className=' loading loading-spinner loading-xl'></span></button> : <button className='btn mx-2 w-20' onClick={refreshHandle}>Refresh</button>}
          </div>
        </div>
        <BonusButton />
        <InfoBox />
      </header>

      <div className='grid grid-cols-4'>
        <PackLine/>
      </div>
    </div>
  );
}

export default App;
