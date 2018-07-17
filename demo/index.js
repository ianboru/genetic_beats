import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import App from './app'
import store from './store'


ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
)

module.hot.accept('./app', () => {
  const NextApp = require('./app').default

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
})
