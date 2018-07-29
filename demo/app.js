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
import ReactFileReader from 'react-file-reader';
/*TODO
* fix mating after selecting
* Mark "Mate" button as ready to mate after
  reviewing all beats in the current generation
  and reset it when a new generation is created.
*/

class ConfigControl extends Component {
  render = () => {
    const { name, value, changeHandler, min, max } = this.props

    return (
      <div>
        {name}
        <input type="text" value={value} onChange={changeHandler} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={changeHandler}
        />
      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)
    this.props.updateFamilyInStorage()
    this.state = {
      playingCurrentBeat : false,
      playingNewBeat     : false,
      inputScore         : "",
      selectText         : "",
    }
    this.props.fetchAllSamples()
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  setScore = (e) => {
    this.props.setScore(parseInt(this.state.inputScore))
    this.props.nextBeat()
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
      this.props.clearSavedFamilies()
      window.location.reload()
    }
  }
  handleMate = () => {
    if (this.props.generation < this.props.allGenerations.length - 1) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${this.props.generation}).`)) {
        this.props.killSubsequentGenerations(this.props.generation)
      } else {
        return
      }
    }

    let options = {}

    if (this.props.selectPairMode) {
      options.newCurrentGeneration = this.props.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return this.props.allGenerations[generation][beatNum]
      })
      options.numGeneration = this.props.allGenerations.length - 1
      this.props.toggleSelectPairMode()
    } else {
      options.newCurrentGeneration = this.props.allGenerations[this.props.generation]
      options.numGeneration = this.props.generation
    }

    const nextGeneration = generateChildren(
      options.newCurrentGeneration,
      options.numGeneration,
      this.props.samples,
      this.props.numSurvivors,
      this.props.numChildren,
      this.props.mutationRate,
      this.props.sampleMutationRate,
      this.props.scoreThreshold
    )

    this.props.addGeneration(nextGeneration)
    this.props.updateFamilyInStorage()
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
    this.props.toggleSelectPairMode()
  }
  handleSetTempo = (evt) => {
    this.props.setTempo(evt.target.value)
  }
  handleSetMutationRate = (evt) => {
    this.props.setMutationRate(evt.target.value)
  }
  handleSetSampleMutationRate = (evt) => {
    this.props.setSampleMutationRate(evt.target.value)
  }
  handleSetNumChildren = (evt) => {
    this.props.setNumChildren(evt.target.value)
  }
  handleSetNumSurvivors = (evt) => {
    this.props.setNumSurvivors(evt.target.value)
  }
  handleSetScoreThreshold = (evt) => {
    this.props.setScoreThreshold(evt.target.value)
  }
  handlePlayNewBeat = () => {
    this.setState({
      playingNewBeat: !this.state.playingNewBeat,
    })
  }
  handleSelectFamily = (evt) => {
    this.props.setFamilyName(evt.target.value)
  }

  render() {
    let selectText = ""
    if (this.props.selectPairMode) {
      selectText =
        "In Select Mode. Selecting beats : " +
        this.props.selectedBeats.join(" , ")
    } else {
      selectText = ""
    }
    const familyNamesOptions = this.props.familyNames.map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      )
    })
    return (
      <div style={{ paddingTop: "30px" }}>
        <Player beat={this.props.newBeat} playing={this.state.playingNewBeat} />
        <Player
          beat={this.props.currentBeat}
          playing={this.state.playingCurrentBeat}
        />
        <div>
          <div>
            <input type="file" onChange={this.handleUploadSample} ></input>

            Family:
            {this.props.familyName}
            <select
              defaultValue={this.props.familyName}
              onChange={this.handleSelectFamily}
            >
              {familyNamesOptions}
            </select>
          </div>
          <ConfigControl
            name          = "Tempo"
            value         = {this.props.tempo}
            changeHandler = {this.handleSetTempo}
            min           = {0}
            max           = {200}
          />
          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {this.props.mutationRate}
            changeHandler = {this.handleSetMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {this.props.sampleMutationRate}
            changeHandler = {this.handleSetSampleMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Number of Children"
            value         = {this.props.numChildren}
            changeHandler = {this.handleSetNumChildren}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Number of Survivors"
            value         = {this.props.numSurvivors}
            changeHandler = {this.handleSetNumSurvivors}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Top Percentile of Survivors"
            value         = {this.props.scoreThreshold}
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

            <span>Generation: {this.props.generation}</span>
            <br />
            <span>Beat: {this.props.currentBeat.key}</span>
            <div>Score: {this.props.currentBeat.score}</div>
            <div>Parents: {this.props.currentBeat.parents}</div>
          </div>
          
          <div>
            <Beat
              beat    = {this.props.currentBeat}
              samples = {this.props.samples}
              setGain = {this.props.setGain}
              onEdit  = {this.props.setCurrentBeat}
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
              onClick={this.props.nextBeat}
            >
              Next Beat
            </button>
            <button
              className="react-music-button"
              onClick={this.props.prevBeat}
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
              onClick={this.props.setMetronome}
            >
              Metronome
            </button>
          </div>

        </div>

        <GraphContainer
          familyTree = {this.props.allGenerations}
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
      beatNum        : state.beatNum,
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
