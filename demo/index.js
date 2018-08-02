import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './app'


ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
)

if (!process.env.NODE_ENV === "production") {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default

    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
