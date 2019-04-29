import Raven from "raven-js"
import React, { Component } from "react"
import ReactFileReader from "react-file-reader"
import { observer } from "mobx-react"

import BeatDisplay from "./beatDisplay"

import "./index.css"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}

@observer
class App extends Component {
  render() {
    return <BeatDisplay />
  }
}


export default App
