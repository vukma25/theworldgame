
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from './redux/app/store'
import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';
import SpeedDial from './Components/SpeedDial/SpeedDial'


function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navbar />
        <Outlet />
        <SpeedDial />
      </PersistGate>
    </Provider>
  );
}

export default App;
