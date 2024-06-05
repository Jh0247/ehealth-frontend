import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, {persistor} from './redux/store.js'
import App from './App.jsx'

// if (import.meta.env.VITE_APP_ENV) {
//   console.log('Clearing persist storage for development...');
//   localStorage.clear();
//   sessionStorage.clear();
//   persistor.purge();
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
