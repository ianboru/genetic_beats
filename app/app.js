import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"

import store from "./stores/store"
import playingStore from "./stores/playingStore"

import "./index.css"

import AppRouter from "./appRouter"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


@observer
class App extends Component {
  constructor(props) {
    super(props)

    //store.fetchAllSamples()
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0]
    var reader  = new FileReader()

    reader.addEventListener("load", function () { }, false)

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  handleKeyPress = (e) => {
    if (e.code == "Space") {
      e.preventDefault()
      playingStore.togglePlay()
    } else if (e.code == "ArrowRight") {
      playingStore.nextBeat()
    } else if (e.code == "ArrowLeft") {
      store.prevBeat()
    }
  }

  render() {
    //<input type="file" onChange={this.handleUploadSample} ></input>

    return <AppRouter />
  }
}


export default App
