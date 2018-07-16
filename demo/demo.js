import React, { Component } from "react"
import { connect } from "react-redux"

import {
  getRandomIndices,
  getSubarray,
  findBeatInGeneration,
  findInJSON,
  matePair,
} from "./utils"

import initialGeneration from "./initialGeneration"

import Beat from "./components/beat"
import CreateBeat from "./components/createBeat"
import FamilyTree from "./components/familyTree"
import Player from "./components/player"

import samples from "./samples"
import GraphContainer from "./components/graphContainer"
import "./index.css"

import { actions } from "./store"


/*TODO
make config
rename "beat" attribute on beats to "tracks"
fix mating after selecting
move more functions to utilities
fix beat labeling
*/

let numSurvivors = 5

const keepRandomSurvivors = (numSurvivors, nextGeneration) => {
  let randomIntegerArray = getRandomIndices(numSurvivors, nextGeneration.length)
  nextGeneration = getSubarray(nextGeneration, randomIntegerArray)
  return nextGeneration
}


const normalizeSubdivisions = (beat, newSubdivisions) => {
  let subdivisionRatio = newSubdivisions/beat.beat[0].sequence.length
  for (let i = 0; i < beat.length; i++) {
    let newSequence = []
    beat.beat[i].sequence.forEach( (note) => {
      newSequence.push(note)
      for (let i = 0; i < subdivisionRatio-1; i++) {
        newSequence.push(0)
      }
    })
    beat.beat[i].sequence = newSequence
  }
  return beat
}

// TODO: Mark "Mate" button as ready to mate after
// reviewing all beats in the current generation
// and reset it when a new generation is created.


class Demo extends Component {
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
    beat.key = "0." + this.props.currentGeneration.length
    this.setState({
      currentGeneration : [ ...this.props.currentGeneration, beat ],
    })
  }

  generateChildren = (numChildren = 3, numInitialSurvivors = 5) => {
    let nextGeneration = []
    const currentGen = this.props.currentGeneration

    const getScoreThreshold = (generation, survivorPercentile = 0.75) => {
      let allScores = generation.map((beat) => { return beat.score })
      allScores = allScores.sort( (a, b) => (a - b) )

      let percentileIndex = Math.floor(allScores.length * survivorPercentile) - 1
      return allScores[percentileIndex]
    }

    const threshold = getScoreThreshold(currentGen)

    // For all mom, dad pairs for all children in number of children per generation
    let childNum = 0
    currentGen.forEach( (momBeat, momIndex) => {
      currentGen.forEach( (dadBeat, dadIndex) => {
        //don't mate unfit pairs
        if ( (momBeat.score < threshold || dadBeat.score < threshold) &&
             nextGeneration.length > numSurvivors ) {
          return
        }

        //to pass on to children
        let aveParentScore = (momBeat.score + dadBeat.score) / 2

        // If mom and dad have different beat lengths
        if (momBeat.beat[0].sequence.length > momBeat.beat[0].sequence.length) {
          dadBeat = normalizeSubdivisions(dadBeat, momBeat.beat[0].sequence.length)
        } else {
          momBeat = normalizeSubdivisions(momBeat, dadBeat.beat[0].sequence.length)
        }

        for (let i=0; i < numChildren; i++) {
          let currentBeat = []
          samples.forEach((sample) => {
            // `sample` on a track comes from the `path` attribute of a
            // given sample in samples.js
            const path = sample.path

            let momBeat = findInJSON(momBeat.beat, 'sample', path)
            let dadBeat = findInJSON(dadBeat.beat, 'sample', path)

            // Handle case where mom and dad don't have the same samples
            if (momBeat.sample || dadBeat.sample) {
              if (!momBeat.sample) { momBeat = dadBeat }
              if (!dadBeat.sample) { dadBeat = momBeat }
              currentBeat.push({
                sample   : path,
                sequence : matePair(momBeat, dadBeat),
              })
            }
          })

          nextGeneration.push({
            beat       : currentBeat,
            key        : this.props.generation + "." + childNum,
            momKey     : momBeat.key,
            dadKey     : dadBeat.key,
            score      : aveParentScore,
            childIndex : childNum,
            generation : this.props.generation,
          })
          ++childNum
        }
      })
    })

    //so generations don't get huge.
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numInitialSurvivors, nextGeneration.length)
    nextGeneration = keepRandomSurvivors(numSurvivors, nextGeneration)

    this.props.addGeneration(nextGeneration)
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

  handleSelectNode = (id) => {
    let idData = id.split(".")
    let generation = parseInt(idData[0])
    let beat = findBeatInGeneration(id, this.props.currentGeneration)
    let beatNum = beat.childIndex

    this.props.selectBeat(generation, beatNum)
  }

  reset = () => {
    window.location.reload()
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
              samples        = {samples}
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
              onClick={this.generateChildren}
            >
              Mate
            </button>
          </div>
        </div>

        <GraphContainer
          familyTree       = {this.props.allGenerations}
          handleSelectNode = {this.handleSelectNode}
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
      allGenerations: state.allGenerations,
      beatNum: state.beatNum,
      newBeat: state.newBeat,
    }
  }, actions
)(Demo)
