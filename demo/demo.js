import React, { Component } from "react"
import { connect } from "react-redux"

import {
  getRandomIndices,
  getSubarray,
  findInJSON,
  mateCurrentPair,
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
fix mating after selecting
move more functions to utilities
fix beat labeling
*/

const numChildren = 3
const survivorPercentile = .75
const numInitialSurvivors = 5
let numSurvivors = 5

const keepRandomSurvivors = (numSurvivors, nextGeneration) => {
  let randomIntegerArray = getRandomIndices(numSurvivors,nextGeneration.length)
  nextGeneration = getSubarray(nextGeneration,randomIntegerArray)
  return nextGeneration
}

const findBeatInGeneration = (id, generation) => {
  let beat = {}
  generation.forEach( (curBeat) => {
    if (curBeat.key == id) {
      beat = curBeat
    }
  })
  return beat
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
      currentGeneration  : initialGeneration,
      scoreThreshold     : -1,
      inputScore         : "",
      allGenerations     : [initialGeneration]
    }
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  handleAddBeat = (beat) => {
    beat.key = "0." + this.state.currentGeneration.length
    this.setState({
      currentGeneration : [ ...this.state.currentGeneration, beat ],
    })
  }

  updateScoreThreshold = () => {
    let allScores = []
    this.state.currentGeneration.forEach(
      function(beat){
        allScores.push(beat["score"])
    })
    allScores = allScores.sort((a, b) => a - b)

    let percentileIndex = Math.floor(allScores.length*survivorPercentile) - 1;
    this.setState({
      scoreThreshold: allScores[percentileIndex]
    })
  }

  generateChildren =   () => {
    let nextGeneration = []
    this.updateScoreThreshold()

    const currentGen = this.state.currentGeneration
    // For all mom, dad pairs for all children in number of children per generation
    let childNum = 0
    for (let momIndex = 0; momIndex < currentGen.length; momIndex++) {
      for (let dadIndex = momIndex+1; dadIndex < currentGen.length; dadIndex++) {
        //don't mate unfit pairs
        if (
            (
              currentGen[momIndex].score < this.state.scoreThreshold ||
              currentGen[dadIndex].score < this.state.scoreThreshold
            ) &&
            nextGeneration.length > numSurvivors
          ) {
          continue
        }
        //to pass on to children
        let aveParentScore = (
          currentGen[momIndex].score +
          currentGen[dadIndex].score
          ) / 2
        // If mom and dad have different beat lengths
        if (currentGen[momIndex].beat[0].sequence.length > currentGen[momIndex].beat[0].sequence.length) {
          currentGen[dadIndex] = normalizeSubdivisions(currentGen[dadIndex], currentGen[momIndex].beat[0].sequence.length)
        } else {
          currentGen[momIndex] = normalizeSubdivisions(currentGen[momIndex], currentGen[dadIndex].beat[0].sequence.length)
        }

        for (let childIndex = 0; childIndex < numChildren; childIndex++) {
          let currentBeat = []
          samples.forEach((sample) => {
            // `sample` on a track comes from the `path` attribute of a
            // given sample in samples.js
            const path = sample.path

            let momBeat = findInJSON(currentGen[momIndex].beat, 'sample', path)
            let dadBeat = findInJSON(currentGen[dadIndex].beat, 'sample', path)

            // Handle case where mom and dad don't have the same samples
            if (momBeat.sample || dadBeat.sample) {
              if (!momBeat.sample) {
                momBeat = dadBeat
              }
              if (!dadBeat.sample) {
                dadBeat = momBeat
              }
              const childBeatForSample = mateCurrentPair(
                momBeat,
                dadBeat
              )
              currentBeat.push({
                  sample   : path,
                  sequence : childBeatForSample,
              })
            }
          })

          nextGeneration.push({
            beat       : currentBeat,
            key        : this.props.generation + "." + childNum,
            momKey     : currentGen[momIndex].key,
            dadKey     : currentGen[dadIndex].key,
            score      : aveParentScore,
            childIndex : childNum,
            generation : this.props.generation,
          })
          ++childNum
        }
      }
    }

    //so generations don't get huge.
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numInitialSurvivors, nextGeneration.length)
    nextGeneration = keepRandomSurvivors(numSurvivors, nextGeneration)
    this.state.allGenerations.push(nextGeneration)

    this.props.setBeatNum(0)
    this.setState({
      currentGeneration : nextGeneration,
      generation        : this.props.generation + 1,
      allGenerations    : this.state.allGenerations,
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

  handleSelectNode = (id) => {
    let idData = id.split(".")
    let generation = parseInt(idData[0])

    let currentGeneration = this.state.allGenerations[generation]
    let currentBeat = findBeatInGeneration(id, currentGeneration)
    let beatNum = currentBeat.childIndex

    this.props.setBeatNum(beatNum)
    this.setState({
      currentBeat       : currentBeat,
      generation        : generation,
      currentGeneration : currentGeneration,
    })
  }

  reset = () => {
    window.location.reload()
  }

  handlePlayNewBeat = (beat) => {
    this.setState({
      newBeat : beat,
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
              beatNum = {this.props.beatNum}
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
          familyTree       = {this.state.allGenerations}
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
    const currentBeat = state.currentGeneration[state.beatNum]

    return {
      currentBeat,
      beatNum: state.beatNum,
      newBeat: state.newBeat,
      allGenerations: state.allGenerations,
    }
  }, actions
)(Demo)
