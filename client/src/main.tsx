import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import RouteSwitch from './RouteSwitch'
import { Provider } from 'react-redux'
import store from './app/store'
import '../src/styles/index.css'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <RouteSwitch />
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>,
)
