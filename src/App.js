import { Provider } from 'react-redux'
import { store } from './redux/app/store'
import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar';

function App() {


  return (
    <Provider store={store}>
      <Navbar />
      <Outlet />
    </Provider>
  );
}

export default App;
