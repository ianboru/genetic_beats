import Raven from "raven-js"
import React, { Component } from "react"
import ReactFileReader from "react-file-reader"
import { observer } from "mobx-react"

import BeatDisplay from "./beatDisplay"

import beatViewStore from "./stores/beatViewStore"
import familyStore from "./stores/familyStore"

import "./index.css"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}

@observer
class App extends Component {
  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleKeyPress = (e) => {
    if (e.code == "Space") {
      beatViewStore.togglePlaying()
      e.preventDefault()
    } else if (e.code == "ArrowRight") {
      familyStore.nextBeatInLineage()
    } else if (e.code == "ArrowLeft") {
      familyStore.prevBeatInLineage()
    }
  }

  render() {
    return <BeatDisplay />
  }
}


export default App
