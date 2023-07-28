import React from 'react'
import ReactDOM from 'react-dom/client'
import RouteSwitch from './RouteSwitch'
import { Provider } from 'react-redux'
import store from './app/store'
import '../src/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouteSwitch />
    </Provider>
  </React.StrictMode>,
)
