import React, { Component } from "react"

import {
  Song,
  Sequencer,
  Sampler,
} from "../src"

import {
  getRandomIndices,
  getSubarray,
  findInJSON,
  mateCurrentPair,
} from "./utils"

import Polysynth from "./polysynth"
import Visualization from "./visualization"
import initialGeneration from "./initialGeneration"

import Beat from "./components/beat"
import FamilyTree from "./components/familyTree"
import CreateBeat from "./components/createBeat"

import samples from "./samples"

import "./index.css"

//Will become config
const numChildren = 3
const survivorPercentile = .75
const tempo = 100
var numInitialSurvivors = 5
var numSurvivors = 5
var totalMembers = initialGeneration.length

const generateSamplers = (data) => {
 return data.map((sample, i) => {
   let convertedBeat = []
   sample.beat.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     key    = {i}
     sample = {sample.sample}
     steps  = {convertedBeat}
   />)
 })
}

const keepRandomSurvivors = (numSurvivors, nextGeneration) => {
    let randomIntegerArray = getRandomIndices(numSurvivors,nextGeneration.length)
    console.log("keeping the following random survivors")
    console.log(randomIntegerArray)
    nextGeneration = getSubarray(nextGeneration,randomIntegerArray)
    return nextGeneration
}
const normalizeSubdivisions = (beat, newSubdivisions) => {
  let subdivisionRatio = newSubdivisions/beat[0].beat.length
  for (let i = 0; i < beat.length; i++) {
    var newSequence = []
    beat[i].beat.forEach(
        function(note){
          newSequence.push(note)
          for(let i = 0; i < subdivisionRatio-1; i++) {
            newSequence.push(0)
          }
      })
    beat[i].beat = newSequence
  }

  return beat
}

export default class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newBeat        : null,
      playingCurrentBeat : false,
      playingNewBeat : false,
      beatNum        : 0,
      totalBeats     : initialGeneration.length,
      currentScore   : 0,
      currentGeneration : initialGeneration,
      generation     : 0,
      scoreThreshold : -1,
      allSamples     : [],
      inputScore     : "",
      mateButtonClass : "react-music-button",
      allGenerations : [initialGeneration]
    }
    this.updateUniqueSampleList()
  }

  handlePlayToggle = () => {
    console.log("playing current beat ")
    console.log(this.state.playingCurrentBeat)
    this.setState({
      playingCurrentBeat: !this.state.playingCurrentBeat,
    })
  }

  updateUniqueSampleList = () => {
    let allSamples = []
    this.state.currentGeneration.forEach(
      function(parent){
        parent.forEach(
        function(beat){
          if(allSamples.indexOf(beat["sample"]) == -1){
            allSamples.push(beat["sample"])
          }
        })
      })
    console.log("all samples")
    this.state.allSamples = allSamples
    console.log(this.state.allSamples)

  }
  handleAddBeat = (beat) => {
    console.log("adding beat")
    this.state.currentGeneration.push(beat)
    //initialGeneration.push(beat)

    this.setState({
      currentGeneration : this.state.currentGeneration,
      totalBeats : this.state.totalBeats + 1
    },()=>{
      console.log("set state")
      console.log(this.state.currentGeneration)
      console.log(this.state.totalBeats)

    })

  }
  updateScoreThreshold = () => {
    var allScores = []
    this.state.currentGeneration.forEach(
      function(beat){
        console.log(beat[0]["score"])
        allScores.push(beat[0]["score"])
    })
    allScores = allScores.sort((a, b) => a - b)
    console.log("all sorted scores")
    console.log(allScores)

    let percentileIndex = Math.floor(allScores.length*survivorPercentile) - 1;
    this.state.scoreThreshold =  allScores[percentileIndex]
    console.log("current score threshold: " + this.state.scoreThreshold)
  }

  generateChildren =   () => {

    var nextGeneration = []
    console.log("generating " + numChildren + " children")

    this.updateScoreThreshold()

    // For all mom, dad pairs for all children in number of children per generation
    for (let momIndex = 0; momIndex < this.state.currentGeneration.length; momIndex++) {
      for (let dadIndex = momIndex+1; dadIndex < this.state.currentGeneration.length; dadIndex++) {
        console.log("mating " + momIndex + " and " + dadIndex)
        //don't mate unfit pairs
        if(
            (
              this.state.currentGeneration[momIndex][0]["score"] < this.state.scoreThreshold ||
              this.state.currentGeneration[dadIndex][0]["score"] < this.state.scoreThreshold
            ) &&
            nextGeneration.length > numSurvivors
          ){
          continue
        }
        //to pass on to children
        let aveParentScore = (
          this.state.currentGeneration[momIndex][0]["score"] +
          this.state.currentGeneration[dadIndex][0]["score"]
          )/2
        // If mom and dad have different beat lengths
        if(this.state.currentGeneration[momIndex][0].beat.length > this.state.currentGeneration[momIndex][0].beat.length){
          this.state.currentGeneration[dadIndex] = normalizeSubdivisions(this.state.currentGeneration[dadIndex], this.state.currentGeneration[momIndex][0].beat.length)
        }else{
          this.state.currentGeneration[momIndex] = normalizeSubdivisions(this.state.currentGeneration[momIndex], this.state.currentGeneration[dadIndex][0].beat.length)
        }

        for(let childIndex = 0; childIndex < numChildren; childIndex++){
          var currentBeat = []
          console.log("child # " + childIndex)
          this.state.allSamples.forEach(
            function(sample){
              let momBeat = findInJSON(this.state.currentGeneration[momIndex],'sample',sample)
              let dadBeat = findInJSON(this.state.currentGeneration[dadIndex],'sample',sample)

              //Handle case where mom and dad don't have the same samples
              if (momBeat["sample"] || dadBeat["sample"]) {

                if (!momBeat["sample"]) {
                  momBeat = dadBeat
                }
                if (!dadBeat["sample"]) {
                  dadBeat = momBeat
                }
                const childBeatForSample = mateCurrentPair(
                  momBeat,
                  dadBeat
                )
                let dadIndexString = dadIndex + totalMembers - initialGeneration.length
                let momIndexString = momIndex + totalMembers - initialGeneration.length
                currentBeat.push({
                  "parents" : dadIndexString + " & " + momIndexString,
                  "score"   : aveParentScore,
                  "sample"  : sample,
                  "beat"    : childBeatForSample,
                })
              }

          }, this)
          console.log("adding")
          console.log(currentBeat)
          nextGeneration.push(currentBeat)
        }
      }
    }

    //so generations don't get huge.
    console.log("done mating, next generation:")
    console.log(nextGeneration)
    console.log(nextGeneration.length)
    totalMembers += nextGeneration.length
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numInitialSurvivors,nextGeneration.length)
    nextGeneration = keepRandomSurvivors(numSurvivors, nextGeneration)
    this.state.allGenerations.push(nextGeneration)
    this.setState({
      beatNum    : 0,
      currentGeneration  : nextGeneration,
      totalBeats : nextGeneration.length,
      generation : this.state.generation + 1,
      mateButtonClass : "react-music-button",
      allGenerations : this.state.allGenerations,

    })

  }

  nextBeat = () => {
    console.log("next beat")
    var beatNum = 0
    beatNum = (this.state.beatNum+1)%this.state.currentGeneration.length
    console.log("beat num: " + beatNum )
    this.setState({ beatNum: beatNum })
    if(beatNum == 0){
      this.setState({ mateButtonClass : "react-music-mate-ready-button" })
    }
    this.state.currentScore = this.state.currentGeneration[this.state.beatNum][0]["score"]
  }

  lastBeat = () => {
    console.log("last beat")
    var beatNum = 0
    if(this.state.beatNum == 0){
      // to go backwards from beat 0
      beatNum = this.state.currentGeneration.length-1
    }else{
      beatNum = (this.state.beatNum-1)%this.state.currentGeneration.length
    }
    console.log("beat num: " + beatNum )
    this.setState({ beatNum: beatNum })

    this.state.currentScore = this.state.currentGeneration[this.state.beatNum][0]["score"]
  }

  setScore = (event) => {
    event.preventDefault()
    console.log("setting score: " + this.state.currentScore)
    this.state.currentGeneration[this.state.beatNum][0]["score"] = parseInt(this.state.inputScore)
    this.state.inputScore = ""
    this.nextBeat()
  }

  handleInputChange = (e) => {
    this.setState({ inputScore: e.target.value })
  }

  reset = () => {
    window.location.reload()
  }

  handlePlayNewBeat = (beat) => {
    console.log("playing new beat")
    this.setState({ 
      newBeat : beat,
      playingNewBeat : !this.state.playingNewBeat,
    })
  }

  render() {
    let beat
    if (this.state.newBeat) {
      beat = this.state.newBeat
    } else {
      beat = this.state.currentGeneration[this.state.beatNum]
    }
    return (
      <div style={{ paddingTop: "30px" }}> 
        <Song
          playing={this.state.playingNewBeat}
          tempo={tempo}
        >
            <Sequencer
              resolution={beat[0]["beat"].length}
              bars={1}
            >
              {generateSamplers(beat)}
            </Sequencer>
        </Song>
        <Song
          playing={this.state.playingCurrentBeat}
          tempo={tempo}
        >
            <Sequencer
              resolution={this.state.currentGeneration[this.state.beatNum][0]["beat"].length}
              bars={1}
            >
              {generateSamplers(this.state.currentGeneration[this.state.beatNum])}
            </Sequencer>
        </Song>

        <div style ={{textAlign:"center"}}>
          <CreateBeat samples={samples} handleAddBeat = {this.handleAddBeat} handlePlayBeat={this.handlePlayNewBeat} />
          <br /><br />

          <span>Generation: {this.state.generation}</span><br/>
          <span>Beat: {this.state.beatNum+1} / {this.state.totalBeats}</span>
          <div>Score: {this.state.currentGeneration[this.state.beatNum][0]['score']}</div>
          <div>Parents: {this.state.currentGeneration[this.state.beatNum][0]['parents']}</div>
        </div>

        <div style={{textAlign: "center"}}>
          <Beat beat={this.state.currentGeneration[this.state.beatNum]} />
        </div>

        <div className="rate-beat" style ={{textAlign:"center"}}>
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
    )
  }
}
