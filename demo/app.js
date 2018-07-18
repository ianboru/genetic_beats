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
      newBeat            : null,
      playingCurrentBeat : false,
      playingNewBeat     : false,
      inputScore         : "",
    }
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  handleAddBeat = (beat) => {
    this.props.addBeat(beat)
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
    window.location.reload()
  }

  handleMate = () => {
    if(this.props.generation < this.props.allGenerations.length-1){
      this.props.killSubsequentGenerations(this.props.generation)
    }
    const nextGeneration = generateChildren(this.props.currentGeneration, this.props.generation, this.props.samples)
    this.props.addGeneration(nextGeneration)
  }

  handlePlayNewBeat = (beat) => {
    this.setState({
      newBeat        : beat,
      playingNewBeat : !this.state.playingNewBeat,
    })
  }

  render() {
    return (
      <div style={{ paddingTop: "30px" }}>
        <Player
          beat    = {this.state.newBeat}
          playing = {this.state.playingNewBeat}
        />
        <Player
          beat    = {this.props.currentBeat}
          playing = {this.state.playingCurrentBeat}
        />

        <div style={{ display: "inline-block" }}>
          <div>
            <CreateBeat
              handleAddBeat  = {this.handleAddBeat}
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
              onClick={this.reset}
            >
              Reset
            </button>
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
            </button>
            <button
              className="react-music-button"
              onClick={this.handleMate}
            >
              Mate
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
      beatNum: state.beatNum,
      generation: state.generation,
      allGenerations: state.allGenerations,
      samples: state.samples,
    }
  }, actions
)(App)
