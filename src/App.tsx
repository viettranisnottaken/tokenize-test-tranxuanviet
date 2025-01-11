import TradingViewChart from './components/tradingViewChart/TradingViewChart';
import './App.scss';
import { useState } from 'react';
import PillBtn from './components/common/pillBtn/PillBtn';

const App = () => {
  const [shouldShowChart, setShouldShowChart] = useState(true);

  const handleShowChart = () => {
    setShouldShowChart((prev) => !prev);
  };

  return (
    <div className="app">
      <div className="d-flex align-center">
        <PillBtn classNames="mr-4" width={'auto'} onClick={handleShowChart}>
          {shouldShowChart ? 'Hide chart' : 'Show chart'}
        </PillBtn>
        <span>Click here and check the console to see if teardown logics are working</span>
      </div>
      {shouldShowChart && (
        <>
          <h1 className="text-center">Trading view</h1>
          <TradingViewChart height={500} width={0} />
        </>
      )}
    </div>
  );
};

export default App;
