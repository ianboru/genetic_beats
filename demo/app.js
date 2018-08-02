import Raven from 'raven-js'
import React, { Component } from "react"
import { connect } from "react-redux"

import { actions } from "./store"
import generateChildren from "./generateChildren"
import initialGeneration from "./initialGeneration"
import "./index.css"

import Beat from "./components/beat"
import CreateBeat from "./components/createBeat"
import FamilyTree from "./components/familyTree"
import GraphContainer from "./components/graphContainer"
import Player from "./components/player"
import ConfigControl from "./components/configControl"
import ReactFileReader from 'react-file-reader'
/*TODO
* fix mating after selecting
* Mark "Mate" button as ready to mate after
  reviewing all beats in the current generation
  and reset it when a new generation is created.
*/

import { observer } from "mobx-react"

if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


import appState from "./appState"


@observer
class App extends Component {
  constructor(props) {
    super(props)
    appState.updateFamilyInStorage()
    this.state = {
      playingCurrentBeat : false,
      playingNewBeat     : false,
      inputScore         : "",
      selectText         : "",
    }
    //appState.fetchAllSamples()
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  setScore = (e) => {
    appState.setScore(parseInt(this.state.inputScore))
    appState.nextBeat()
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
      appState.clearSavedFamilies()
      window.location.reload()
    }
  }
  handleMate = () => {
    if (appState.generation < appState.allGenerations.length - 1) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${appState.generation}).`)) {
        appState.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}

    if (appState.selectPairMode) {
      options.newCurrentGeneration = appState.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return appState.allGenerations[generation][beatNum]
      })
      options.numGeneration = appState.allGenerations.length - 1
      appState.toggleSelectPairMode()
    } else {
      options.newCurrentGeneration = appState.currentGeneration
      options.numGeneration = appState.generation
    }

    const nextGeneration = generateChildren(
      options.newCurrentGeneration,
      options.numGeneration,
      appState.samples,
      appState.numSurvivors,
      appState.numChildren,
      appState.mutationRate,
      appState.sampleMutationRate,
      appState.scoreThreshold
    )

    appState.addGeneration(nextGeneration)
    appState.updateFamilyInStorage()
  }
  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.addEventListener("load", function () {
    }, false);

    if (file) {
      console.log(file)
      reader.readAsDataURL(file);
      console.log(reader)
    }
  }
  handleSelectPair = () => {
    appState.toggleSelectPairMode()
  }
  handleSetTempo = (evt) => {
    appState.setTempo(evt.target.value)
  }
  handleSetMutationRate = (evt) => {
    appState.setMutationRate(evt.target.value)
  }
  handleSetSampleMutationRate = (evt) => {
    appState.setSampleMutationRate(evt.target.value)
  }
  handleSetNumChildren = (evt) => {
    appState.setNumChildren(evt.target.value)
  }
  handleSetNumSurvivors = (evt) => {
    appState.setNumSurvivors(evt.target.value)
  }
  handleSetScoreThreshold = (evt) => {
    appState.setScoreThreshold(evt.target.value)
  }
  handlePlayNewBeat = () => {
    this.setState({
      playingNewBeat: !this.state.playingNewBeat,
    })
  }
  handleSelectFamily = (evt) => {
    appState.selectFamily(evt.target.value)
  }

  render() {
    let selectText = ""
    if (appState.selectPairMode) {
      selectText =
        "In Select Mode. Selecting beats : " +
        appState.selectedBeats.join(" , ")
    } else {
      selectText = ""
    }
    const familyNamesOptions = appState.familyNames.map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      )
    })
    return (
      <div style={{ paddingTop: "30px" }}>
        <Player beat={appState.newBeat} playing={this.state.playingNewBeat} />
        <Player
          beat={appState.currentBeat}
          playing={this.state.playingCurrentBeat}
        />
        <div>
          <div>
            <input type="file" onChange={this.handleUploadSample} ></input>

            Family:
            {appState.familyName}
            <select
              defaultValue={appState.familyName}
              onChange={this.handleSelectFamily}
            >
              {familyNamesOptions}
            </select>
          </div>
          <ConfigControl
            name          = "Tempo"
            value         = {appState.tempo}
            changeHandler = {this.handleSetTempo}
            min           = {0}
            max           = {200}
          />
          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {appState.mutationRate}
            changeHandler = {this.handleSetMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {appState.sampleMutationRate}
            changeHandler = {this.handleSetSampleMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Number of Children"
            value         = {appState.numChildren}
            changeHandler = {this.handleSetNumChildren}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Number of Survivors"
            value         = {appState.numSurvivors}
            changeHandler = {this.handleSetNumSurvivors}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Top Percentile of Survivors"
            value         = {appState.scoreThreshold}
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

            <span>Generation: {appState.generation}</span>
            <br />
            <span>Beat: {appState.currentBeat.key}</span>
            <div>Score: {appState.currentBeat.score}</div>
            <div>Parents: {appState.currentBeat.parents}</div>
          </div>

          <div>
            <Beat
              beat    = {appState.currentBeat}
              samples = {appState.samples}
              setGain = {appState.setGain}
              onEdit  = {appState.setCurrentBeat}
              handleRemoveTrack = {this.props.removeTrackFromCurrentBeat}
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

            <button
              className="react-music-button"
              onClick={this.handlePlayToggle}
            >
              {this.state.playingCurrentBeat ? 'Stop' : 'Play'}
            </button>
            <button
              className="react-music-button"
              onClick={appState.nextBeat}
            >
              Next Beat
            </button>
            <button
              className="react-music-button"
              onClick={appState.prevBeat}
            >
              Last Beat
            </button><br/>
            <button
              className="react-music-button"
              onClick={this.handleMate}
            >
              Mate
            </button>
            <button
              className="react-music-button"
              onClick={this.handleSelectPair}
            >
              Select
            </button>
            <button
              className="react-music-button"
              onClick={this.reset}
            >
              Reset
            </button>
            <button
              className="react-music-button"
              onClick={this.clearSavedFamilies}
            >
              Clear
            </button>
            <button
              className="react-music-button"
              onClick={appState.toggleMetronome}
            >
              Metronome
            </button>
          </div>

        </div>

        <GraphContainer
          familyTree = {appState.allGenerations}
          style = {{
            display: "inline-block",
            verticalAlign: "top",
          }}
        />
        <p>{selectText}</p>
      </div>
    )
  }
}


export default connect(
  (state) => {
    const currentGeneration = state.allGenerations[state.generation]
    const currentBeat = currentGeneration[state.beatNum]

    return {
      currentBeat,
      currentGeneration,
      newBeat        : state.newBeat,
      generation     : state.generation,
      allGenerations : state.allGenerations,
      samples        : state.samples,
      selectedBeats  : state.selectedBeats,
      selectPairMode : state.selectPairMode,
      mutationRate   : state.mutationRate,
      sampleMutationRate: state.sampleMutationRate,
      numSurvivors   : state.numSurvivors,
      numChildren    : state.numChildren,
      scoreThreshold : state.scoreThreshold,
      familyName     : state.familyName,
      familyNames    : state.familyNames,
      tempo          : state.tempo,
    }
  }, actions
)(App)
