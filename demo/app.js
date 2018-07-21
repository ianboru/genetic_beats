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


/*TODO
* fix mating after selecting
* Mark "Mate" button as ready to mate after
  reviewing all beats in the current generation
  and reset it when a new generation is created.
*/


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      playingCurrentBeat : false,
      playingNewBeat     : false,
      inputScore         : "",
      selectText         : ""
    }
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
      this.props.scoreThreshold,
    )

    this.props.addGeneration(nextGeneration)
  }

  handleSelectPair = () => {
    this.props.toggleSelectPairMode()
  }

  handleSetMutationRate  = (evt) => {
    this.props.setMutationRate(evt.target.value)
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
      playingNewBeat : !this.state.playingNewBeat,
    })
  }

  render() {
    let selectText = ""
    if (this.props.selectPairMode) {
      selectText = "In Select Mode. Selecting beats : " + this.props.selectedBeats.join(' , ')
    } else {
      selectText = ""
    }

    return (
      <div style={{ paddingTop: "30px" }}>
        <Player
          beat    = {this.props.newBeat}
          playing = {this.state.playingNewBeat}
        />
        <Player
          beat    = {this.props.currentBeat}
          playing = {this.state.playingCurrentBeat}
        />
        <div>
          Mutation Rate:
          <input
                type         = "range"
                min          = {0}
                max          = {100}
                defaultValue = {this.props.mutationRate}
                onChange     = {this.handleSetMutationRate}
          /><br/>
          Number of Children:
          <input
            type         = "range"
            min          = {1}
            max          = {20}
            defaultValue = {this.props.numChildren}
            onChange     = {this.handleSetNumChildren}
          /><br/>
          Number of Survivors:
          <input
              type         = "range"
              min          = {1}
              max          = {20}
              defaultValue = {this.props.numSurvivors}
              onChange     = {this.handleSetNumSurvivors}
          /><br/>
          Top Percentile of Survivors:
          <input
              type         = "range"
              min          = {0}
              max          = {100}
              defaultValue = {this.props.scoreThreshold}
              onChange     = {this.handleSetScoreThreshold}
          /><br/>
        </div>
        <div style={{ display: "inline-block" }}>
          <div>
            <CreateBeat
              handlePlayBeat = {this.handlePlayNewBeat}
            />
            <br /><br />

            <span>Generation: {this.props.generation}</span>
            <br/>
            <span>Beat: {this.props.currentBeat.key}</span>
            <div>Score: {this.props.currentBeat.score}</div>
            <div>Parents: {this.props.currentBeat.parents}</div>
          </div>

          <div>
            <Beat
              beat    = {this.props.currentBeat}
              setGain = {this.props.setGain}
              samples = {this.props.samples}
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
      numSurvivors   : state.numSurvivors,
      numChildren    : state.numChildren,
      scoreThreshold : state.scoreThreshold,
    }
  }, actions
)(App)
