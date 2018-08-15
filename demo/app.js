import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "./store"
import generateChildren from "./generateChildren"
import "./index.css"

import Beat from "./components/beat"
import Button from "./components/button"
import ConfigManager from "./components/configManager"
import CreateBeat from "./components/createBeat"
import FamilySelect from "./components/familySelect"
import GraphContainer from "./components/graphContainer"
import Player from "./components/player"

import DevTools from "mobx-react-devtools"


import Arrangement from "./components/arrangement"
/*TODO
* fix mating after selecting
* Mark "Mate" button as ready to mate after
  reviewing all beats in the current generation
  and reset it when a new generation is created.
*/


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
  border: 1px solid black;
  width: 100%;
`

const Footer = styled.div`
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
      playingNewBeat     : false,
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

  reset = () => {
    if (confirm("Are you sure you want to reset?")) {
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

    const nextGeneration = generateChildren(
      options.newCurrentGeneration,
      options.numGeneration,
      store.samples,
      store.numSurvivors,
      store.numChildren,
      store.mutationRate,
      store.sampleMutationRate,
      store.scoreThreshold
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

  handlePlayNewBeat = () => {
    this.setState({
      playingNewBeat: !this.state.playingNewBeat,
    })
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

    let newBeatResolution = null

    if(store.newBeat.tracks[0]){
       newBeatResolution = store.newBeat.tracks[0].sequence.length
    }
    //<input type="file" onChange={this.handleUploadSample} ></input>
    const currentBeatResolution = store.currentBeat.tracks[0].sequence.length
    return (
      <div style={{ height: "100%" }}>
        <Player
          beat       = {store.newBeat}
          playing    = {this.state.playingNewBeat}
          resolution = {newBeatResolution}
          />
        <Player
          beat       = {store.currentBeat}
          playing    = {this.state.playingCurrentBeat}
          resolution = {currentBeatResolution}
        />

        <MainPanel>
          <Header>
            <ConfigManager />
          </Header>

          <div style={{ display: "inline-block" }}>
            <div>
              <CreateBeat handlePlayBeat={this.handlePlayNewBeat} />
              <br />
              <br />

              <span>Generation: {store.generation}</span>
              <br />
              <span>Beat: {store.currentBeat.key}</span>
              <div>Score: {store.currentBeat.score}</div>
              <div>Parents: {store.currentBeat.parents}</div>
            </div>

            <div>
              <Beat
                beat              = {store.currentBeat}
                handleRemoveTrack = {store.removeTrackFromCurrentBeat}
                handleToggleNote  = {store.toggleNoteOnCurrentBeat}
                handleSetSample   = {store.setSampleOnCurrentBeat}
              />
            </div>

            <div>
              <form onSubmit={this.setScore}>
                <label>Rate Beat
                  <input
                    type        = "text"
                    value       = {this.state.inputScore}
                    onChange    = {this.handleInputChange}
                    placeholder = "Enter Score"
                  />
                </label>
              </form>
            </div>

            <div>
              <Button
                active  = {this.state.playingCurrentBeat}
                onClick = {this.handlePlayToggle}
              >
                {this.state.playingCurrentBeat ? 'Stop' : 'Play'}
              </Button>

              <Button onClick={this.handleMate} >
                Mate
              </Button>

              <Button
                active  = {store.selectPairMode}
                onClick = {store.toggleSelectPairMode}
              >
                Select
              </Button>

              <Button
                active  = {store.metronome}
                onClick = {store.toggleMetronome}
              >
                Metronome
              </Button>
            </div>
          </div>

          <p>{selectText}</p>

          <Arrangement/>

          <Footer>
            <Button title="Clear all saved families" onClick={this.clearSavedFamilies}>
              Clear
            </Button>

            <Button title="Start new family" onClick={this.reset}>
              Reset
            </Button>

            <FamilySelect />
          </Footer>
        </MainPanel>

        <FamilyPanel>
          <Header>
            Family Tree
          </Header>

          <GraphContainer familyTree={store.allGenerations} />

          <Footer>
            <Button onClick={store.prevBeat}>
              &lt; Previous Beat
            </Button>

            <Button right onClick={store.nextBeat}>
              Next Beat
              &gt;
            </Button>
          </Footer>
        </FamilyPanel>

        {typeof DevTools !== "undefined" ? <DevTools /> : null}
      </div>
    )
  }
}


export default App
