import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "./store"
import generateChildren from "./generateChildren"
import "./index.css"

import Beat from "./components/beat"
import ConfigControl from "./components/configControl"
import CreateBeat from "./components/createBeat"
import GraphContainer from "./components/graphContainer"
import Player from "./components/player"
import FamilySelect from "./components/familySelect"

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


const Button = styled.button`
  background-color: ${props => props.active ? "#FF9254" : "white"};
  border-radius: 3px;
  border: 2px solid #FF9254;
  color: ${props => props.active ? "white" : "#FF9254"};
  cursor: pointer;
  font-size: 18px;
  margin: 10px;
  padding: 6px;
  transition: background-color 0.1s, color 0.1s;
  width: 120px;

  &:hover {
    background: #FF9254;
    color: white;
  }
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
  handleSetTempo = (e) => {
    store.setTempo(parseInt(e.target.value))
  }
  handleSetMutationRate = (e) => {
    store.setMutationRate(parseInt(e.target.value))
  }
  handleSetSampleMutationRate = (e) => {
    store.setSampleMutationRate(parseInt(e.target.value))
  }
  handleSetNumChildren = (e) => {
    store.setNumChildren(parseInt(e.target.value))
  }
  handleSetNumSurvivors = (e) => {
    store.setNumSurvivors(parseInt(e.target.value))
  }
  handleSetScoreThreshold = (e) => {
    store.setScoreThreshold(parseInt(e.target.value))
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
      <div style={{ paddingTop: "30px" }}>
        <Player
          beat={store.newBeat}
          playing={this.state.playingNewBeat}
          resolution = {newBeatResolution}
          />
        <Player
          beat={store.currentBeat}
          playing={this.state.playingCurrentBeat}
          resolution = {currentBeatResolution}
        />
        <div>
          <FamilySelect />
          <ConfigControl
            name          = "Tempo"
            value         = {store.tempo}
            changeHandler = {this.handleSetTempo}
            min           = {0}
            max           = {200}
          />
          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {store.mutationRate}
            changeHandler = {this.handleSetMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {store.sampleMutationRate}
            changeHandler = {this.handleSetSampleMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Number of Children"
            value         = {store.numChildren}
            changeHandler = {this.handleSetNumChildren}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Number of Survivors"
            value         = {store.numSurvivors}
            changeHandler = {this.handleSetNumSurvivors}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Top Percentile of Survivors"
            value         = {store.scoreThreshold}
            changeHandler = {this.handleSetScoreThreshold}
            min           = {0}
            max           = {100}
          />
        </div>
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

          <div className="rate-beat">
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

          <div className="buttons">
            <Button
              active  = {this.state.playingCurrentBeat}
              onClick = {this.handlePlayToggle}
            >
              {this.state.playingCurrentBeat ? 'Stop' : 'Play'}
            </Button>
            <Button onClick={store.nextBeat}>
              Next Beat
            </Button>
            <Button onClick={store.prevBeat}>
              Last Beat
            </Button>
            <Button onClick={this.handleMate} >
              Mate
            </Button>

            <br/>

            <Button
              active  = {store.selectPairMode}
              onClick = {store.toggleSelectPairMode}
            >
              Select
            </Button>
            <Button onClick={this.reset}>
              Reset
            </Button>
            <Button onClick={this.clearSavedFamilies}>
              Clear
            </Button>
            <Button
              active  = {store.metronome}
              onClick = {store.toggleMetronome}
            >
              Metronome
            </Button>
          </div>
        </div>

        <GraphContainer familyTree={store.allGenerations} />
        <p>{selectText}</p>

        {typeof DevTools !== "undefined" ? <DevTools /> : null}
        <Arrangement/>
      </div>
    )
  }
}


export default App
