import Raven from "raven-js"
import React, {Component} from "react"
import {configure} from "mobx"
import {observer} from "mobx-react"
import Tone from "tone"

import BeatDisplay from "./beatDisplay"

import playingStore from "../stores/playingStore"
import familyStore from "../stores/familyStore"

import "../index.css"

if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}

configure({enforceActions: "always"})

@observer
class App extends Component {
  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false)
    Tone.Transport.start()
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false)
  }

  handleKeyPress = (e) => {
    if (e.code === "Space") {
      playingStore.togglePlaying()
    } else if (e.code === "ArrowRight") {
      familyStore.nextBeatInLineage()
    } else if (e.code === "ArrowLeft") {
      familyStore.prevBeatInLineage()
    }
    e.preventDefault()
  }

  render() {
    return <BeatDisplay />
  }
}

export default App
