import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "./store"
import {mateGeneration} from "./generateChildren"
import "./index.css"

import Arrangement from "./components/arrangement"
import Beat from "./components/beat"
import Button from "./components/button"
import ConfigManager from "./components/configManager"
import NewBeatManager from "./components/newBeatManager"
import FamilySelect from "./components/familySelect"
import GraphContainer from "./components/graphContainer"
import Player from "./components/player"

import DevTools from "mobx-react-devtools"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


const MainPanel = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 450px;
  border: 1px solid black;
`

const FamilyPanel = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 450px;
  border: 1px solid black;
`

const Header = styled.div`
  background: white;
  border: 1px solid black;
  width: 100%;
`

const Footer = styled.div`
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
`


@observer
class App extends Component {
  constructor(props) {
    super(props)
    store.updateFamilyInStorage()
    this.state = {
      playingCurrentBeat : false,
      inputScore         : "",
      selectText         : "",
    }
    //store.fetchAllSamples()
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  setScore = (e) => {
    store.setScore(parseInt(this.state.inputScore))
    store.nextBeat()
    this.setState({inputScore: ""})
    e.preventDefault()
  }

  handleInputChange = (e) => {
    this.setState({ inputScore: e.target.value })
  }

  newFamilyTree = () => {
    if (confirm("Are you sure you want to start a new family tree?")) {
      window.location.reload()
    }
  }

  clearSavedFamilies = () => {
    if (confirm("Are you sure you want to clear all families?")) {
      store.clearSavedFamilies()
      window.location.reload()
    }
  }

  handleMate = () => {
    if (store.generation < store.allGenerations.length - 1) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${store.generation}).`)) {
        store.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}

    if (store.selectPairMode) {
      options.newCurrentGeneration = store.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return store.allGenerations[generation][beatNum]
      })
      options.numGeneration = store.allGenerations.length - 1
      store.toggleSelectPairMode()
    } else {
      options.newCurrentGeneration = store.currentGeneration
      options.numGeneration = store.generation
    }

    const nextGeneration = mateGeneration(
      options.newCurrentGeneration,
    )

    store.addGeneration(nextGeneration)
    store.updateFamilyInStorage()
  }

  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0]
    var reader  = new FileReader()

    reader.addEventListener("load", function () { }, false)

    if (file) {
      console.log(file)
      reader.readAsDataURL(file)
      console.log(reader)
    }
  }

  render() {
    let selectText = ""
    if (store.selectPairMode) {
      selectText =
        "In Select Mode. Selecting beats : " +
        store.selectedBeats.join(" , ")
    } else {
      selectText = ""
    }

    //<input type="file" onChange={this.handleUploadSample} ></input>
    const currentBeatResolution = store.currentBeat.tracks[0].sequence.length
    return (
      <div style={{ height: "100%" }}>
        <Player
          beat       = {store.currentBeat}
          playing    = {this.state.playingCurrentBeat}
          resolution = {currentBeatResolution}
        />

        <MainPanel>
          <Header>
            <Button
              active  = {this.state.playingCurrentBeat}
              onClick = {this.handlePlayToggle}
            >
              {this.state.playingCurrentBeat ? 'Stop' : 'Play Current'}
            </Button>

            <Button onClick={this.handleMate}>
              Mate
            </Button>

            <NewBeatManager />

            <ConfigManager right />

            <Button
              right
              active  = {store.metronome}
              onClick = {store.toggleMetronome}
            >
              Metronome
            </Button>
          </Header>

          <div>
            <Beat
              beat              = {store.currentBeat}
              handleRemoveTrack = {store.removeTrackFromCurrentBeat}
              handleToggleNote  = {store.toggleNoteOnCurrentBeat}
              handleSetSample   = {store.setSampleOnCurrentBeat}
            />

            <div>Beat: {store.currentBeat.key} (score: {store.currentBeat.score})</div>
            <form onSubmit={this.setScore}>
              <label>Rate Beat:
                <input
                  type        = "number"
                  value       = {this.state.inputScore}
                  onChange    = {this.handleInputChange}
                  placeholder = "Enter Score"
                />
              </label>
            </form>
          </div>

          <Arrangement/>

          <Footer>
            <FamilySelect />

            <Button title="Start new family" onClick={this.newFamilyTree}>
              New Family
            </Button>

            <Button title="Clear all saved families" onClick={this.clearSavedFamilies}>
              Clear All
            </Button>
          </Footer>
        </MainPanel>

        <FamilyPanel>
          <Header>
            Family Tree
          </Header>

          <GraphContainer familyTree={store.allGenerations} />

          <Footer>
            <div>{selectText}</div>

            <div>
              <Button onClick={store.prevBeat}>
                &lt; Previous Beat
              </Button>

              <Button
                active  = {store.selectPairMode}
                onClick = {store.toggleSelectPairMode}
              >
                Select
              </Button>

              <Button right onClick={store.nextBeat}>
                Next Beat
                &gt;
              </Button>
            </div>
          </Footer>
        </FamilyPanel>

        {typeof DevTools !== "undefined" ? <DevTools /> : null}
      </div>
    )
  }
}


export default App
