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

const normalizeSubdivisions = (beat, newSubdivisions) => {
  let subdivisionRatio = newSubdivisions/beat["beat"][0].sequence.length
  for (let i = 0; i < beat.length; i++) {
    let newSequence = []
    beat["beat"][i].sequence.forEach( (note) => {
      newSequence.push(note)
      for (let i = 0; i < subdivisionRatio-1; i++) {
        newSequence.push(0)
      }
    })
    beat["beat"][i].sequence = newSequence
  }
  return beat
}


class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newBeat            : null,
      playingCurrentBeat : false,
      playingNewBeat     : false,
      beatNum            : 0,
      currentGeneration  : initialGeneration,
      currentBeat        : initialGeneration[0],
      generation         : 1,
      scoreThreshold     : -1,
      allSamples         : [],
      inputScore         : "",
      mateButtonClass    : "react-music-button",
      allGenerations     : [initialGeneration]
    }
    this.updateUniqueSampleList()
  }

  handlePlayToggle = () => {
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  updateUniqueSampleList = () => {
    let allSamples = []
    this.state.currentGeneration.forEach(
      function(parent){
        parent["beat"].forEach(
        function(beat){
          if(allSamples.indexOf(beat["sample"]) == -1){
            allSamples.push(beat["sample"])
          }
        })
      })
    this.state.allSamples = allSamples
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
        if(
            (
              currentGen[momIndex].score < this.state.scoreThreshold ||
              currentGen[dadIndex].score < this.state.scoreThreshold
            ) &&
            nextGeneration.length > numSurvivors
          ){
          continue
        }
        //to pass on to children
        let aveParentScore = (
          currentGen[momIndex].score +
          currentGen[dadIndex].score
          )/2
        // If mom and dad have different beat lengths
        if(currentGen[momIndex]["beat"][0].sequence.length > currentGen[momIndex]["beat"][0].sequence.length){
          currentGen[dadIndex] = normalizeSubdivisions(currentGen[dadIndex], currentGen[momIndex]["beat"][0].sequence.length)
        }else{
          currentGen[momIndex] = normalizeSubdivisions(currentGen[momIndex], currentGen[dadIndex]["beat"][0].sequence.length)
        }

        for(let childIndex = 0; childIndex < numChildren; childIndex++){
          var currentBeat = []
          this.state.allSamples.forEach(
            function(sample){
              let momBeat = findInJSON(currentGen[momIndex]["beat"],'sample',sample)
              let dadBeat = findInJSON(currentGen[dadIndex]["beat"],'sample',sample)

              //Handle case where mom and dad don't have the same samples
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
                    sample  : sample,
                    sequence    : childBeatForSample,
                })
              }

          }, this)
          nextGeneration.push({
                                "beat": currentBeat,
                                key     : this.state.generation + "." + childNum,
                                momKey  : currentGen[momIndex].key,
                                dadKey  : currentGen[dadIndex].key,
                                score   : aveParentScore,
                                childIndex : childNum,
                                generation : this.state.generation
                              })
          ++childNum
        }
      }
    }

    //so generations don't get huge.
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numInitialSurvivors,nextGeneration.length)
    nextGeneration = keepRandomSurvivors(numSurvivors, nextGeneration)
    this.state.allGenerations.push(nextGeneration)
    this.setState({
      beatNum           : 0,
      currentGeneration : nextGeneration,
      generation        : this.state.generation + 1,
      mateButtonClass   : "react-music-button",
      allGenerations    : this.state.allGenerations,
    })
  }

  nextBeat = () => {
    var beatNum = 0
    beatNum = (this.state.beatNum+1)%this.state.currentGeneration.length
    this.setState({
      beatNum: beatNum,
      currentBeat: this.state.currentGeneration[this.state.beatNum],
     })
    if(beatNum == 0){
      this.setState({
        mateButtonClass : "react-music-mate-ready-button",
      })
    }

  }

  lastBeat = () => {
    var beatNum = 0
    if(this.state.beatNum == 0){
      // to go backwards from beat 0
      beatNum = this.state.currentGeneration.length-1
    }else{
      beatNum = (this.state.beatNum-1)%this.state.currentGeneration.length
    }
    this.setState({
      beatNum: beatNum,
      currentBeat: this.state.currentGeneration[this.state.beatNum],
     })
  }

  setScore = (event) => {
    event.preventDefault()
    this.state.currentBeat["score"] = parseInt(this.state.inputScore)
    this.state.inputScore = ""
    this.nextBeat()
  }

  handleInputChange = (e) => {
    this.setState({ inputScore: e.target.value })
  }

  findBeatInGeneration = (id, generation) => {
    let beat = {}
    generation.forEach(
      function(curBeat){
        if(curBeat.key == id){
          beat =curBeat
        }
    })
    return beat
  }

  handleSelectNode = (id) => {
    let idData = id.split(".")
    let generation = parseInt(idData[0])

    let currentGeneration = this.state.allGenerations[generation]
    let currentBeat = this.findBeatInGeneration(id, currentGeneration)
    let beatNum = currentBeat.childIndex

    this.setState({
      currentBeat       : currentBeat,
      generation        : generation,
      beatNum           : beatNum,
      currentGeneration : currentGeneration,
    })
  }

  reset = () => {
    window.location.reload()
  }
  setGain = (gain,beatNum,trackNum) =>{
    console.log("setting gain in demo")
    console.log(this.state)
    console.log(beatNum)
    console.log(trackNum)
    var updatedGeneration = this.state.currentGeneration
    updatedGeneration[beatNum]["beat"][trackNum]["gain"] = gain/100
    console.log(updatedGeneration)
    this.setState({
      currentGeneration : updatedGeneration
    })
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
          beat    = {this.state.currentBeat}
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

            <span>Generation: {this.state.generation}</span>
            <br/>
            <span>Beat: {this.state.currentBeat.key}</span>
            <div>Score: {this.state.currentBeat['score']}</div>
            <div>Parents: {this.state.currentBeat['parents']}</div>
          </div>

          <div>
            <Beat beatNum = {this.state.beatNum} setGain={this.setGain}  beat={this.state.currentBeat} />
          </div>

          <div className="rate-beat">
            <form onSubmit = {this.setScore}>
              <label>Rate Beat
                <input type="text" value={this.state.inputScore} onChange={ this.handleInputChange.bind(this) } placeholder="Enter Score"/>
              </label>
            </form>
          </div>

          <div className="buttons">
            <button
              className="react-music-button"
              type="button"
              onClick={this.reset}
            >
              Reset
            </button>
            <button
              className="react-music-button"
              type="button"
              onClick={this.handlePlayToggle}
            >
              {this.state.playingCurrentBeat ? 'Stop' : 'Play'}
            </button>
            <button
              className="react-music-button"
              type="button"
              onClick={this.nextBeat}
            >
              Next Beat
            </button>
            <button
              className="react-music-button"
              type="button"
              onClick={this.lastBeat}
            >
              Last Beat
            </button>
            <button
              className={this.state.mateButtonClass}
              type="button"
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
    return {
      newBeat: state.newBeat,
    }
  }
)(Demo)
