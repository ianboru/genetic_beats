import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import Demo from './demo'
import store from './store'


ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Demo />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
)

module.hot.accept('./demo', () => {
  const NextDemo = require('./demo').default

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Demo />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
})
