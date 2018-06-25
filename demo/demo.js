import React, { Component } from "react"

import {
  Song,
  Sequencer,
  Sampler,
} from "../src"

import {
  arrayOfRandomIntegers,
  arrayFromIndexList,
  findInJSON,
  mateCurrentPair,
} from "./utils"

import Polysynth from "./polysynth"
import Visualization from "./visualization"
import initialMusicData from "./initialMusicData"

import Beat from "./components/beat"

import "./index.css"


const generateSamplers = (data) => {
 return data.map((sample) => {
   let convertedBeat = []
   sample.beat.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     gain = {sample.gain}
     sample = {sample.sample}
     steps  = {convertedBeat}
   />)
 })
}
//will be config
var numSurvivors = 4

const normalizeSubdivisions = (beat, newSubdivisions) => {
  let subdivisionRatio = newSubdivisions/beat[0].beat.length
  console.log("Normalizing to " + newSubdivisions)
  console.log("ratio = " + subdivisionRatio)
  console.log(beat)
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
  
  console.log(beat)
  return beat
}

export default class Demo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      playing        : false,
      beatNum        : 0,
      totalBeats     : initialMusicData.length,
      currentScore   : 0,
      musicData      : initialMusicData,
      generation     : 0,
      scoreThreshold : -1,
      allSamples     : [],
      inputScore     : ""
    }

    this.updateUniqueSampleList()
  }

  handlePlayToggle = () => {
    this.setState({
      playing: !this.state.playing,
    })
  }

  updateUniqueSampleList = () => {
    let allSamples = []
    this.state.musicData.forEach(
      function(parent){
        parent.forEach(
        function(beat){
          if(allSamples.indexOf(beat["sample"]) == -1){
            allSamples.push(beat["sample"])
          }
        })
      })
    console.log("all samples")
    console.log(allSamples)
    this.state.allSamples = allSamples
  }

  updateScoreThreshold = () => {
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numSurvivors,this.state.musicData.length)

    var allScores = []
    this.state.musicData.forEach(
      function(beat){
        console.log(beat[0]["score"])
        allScores.push(beat[0]["score"])
    })
    allScores = allScores.sort()
    this.state.scoreThreshold = allScores[allScores.length-numSurvivors]
    console.log("current score threshold: " + this.state.scoreThreshold)
  }

  generateChildren = () => {
    //Will become config
    const numChildren = 3
    //can't have more survivors then members of the generation
    numSurvivors = Math.min(numSurvivors,this.state.musicData.length)
    var nextGeneration = []
    console.log("generating " + numChildren + " children")
    console.log(this.state.musicData)
    this.updateScoreThreshold()
    this.updateUniqueSampleList()
    // For all mom, dad pairs for all children in number of children per generation
    for (let momIndex = 0; momIndex < this.state.musicData.length; momIndex++) {
      for (let dadIndex = momIndex+1; dadIndex < this.state.musicData.length; dadIndex++) {
        console.log("mating " + momIndex + " and " + dadIndex)
        //don't mate unfit pairs
        if(
          this.state.musicData[momIndex][0]["score"] < this.state.scoreThreshold ||
          this.state.musicData[dadIndex][0]["score"] < this.state.scoreThreshold
          ){
          continue
        }
        //to pass on to children
        let aveParentScore = (
          this.state.musicData[momIndex][0]["score"] +
          this.state.musicData[dadIndex][0]["score"]
          )/2
        console.log(aveParentScore)
        // If mom and dad have different beat lengths
        if(this.state.musicData[momIndex][0].beat.length > this.state.musicData[momIndex][0].beat.length){
          console.log("mom long")
          this.state.musicData[dadIndex] = normalizeSubdivisions(this.state.musicData[dadIndex], this.state.musicData[momIndex][0].beat.length)
        }else{
          this.state.musicData[momIndex] = normalizeSubdivisions(this.state.musicData[momIndex], this.state.musicData[dadIndex][0].beat.length)
        }

        for(let childIndex = 0; childIndex < numChildren; childIndex++){
          var currentBeat = []
          this.state.allSamples.forEach(
            function(sample){

              let momBeat = findInJSON(this.state.musicData[momIndex],'sample',sample)
              let dadBeat = findInJSON(this.state.musicData[dadIndex],'sample',sample)
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
                currentBeat.push({
                  "parents" : dadIndex + " & " + momIndex,
                  "score"   : aveParentScore,
                  "sample"  : sample,
                  "beat"    : childBeatForSample,
                })
              }

          }, this)

          nextGeneration.push(currentBeat)
        }
      }
    }

    //so generations don't get huge.
    console.log(nextGeneration)
    let randomIntegerArray = arrayOfRandomIntegers(numSurvivors,nextGeneration.length)
    console.log("random ints")
    console.log(randomIntegerArray)
    nextGeneration = arrayFromIndexList(nextGeneration,randomIntegerArray)
    this.setState({
      beatNum    : 0,
      musicData  : nextGeneration,
      totalBeats : nextGeneration.length,
      generation : this.state.generation + 1,
    })
  }


  nextBeat = () => {
    console.log("next beat")
    var newBeatNum = 0
    newBeatNum = (this.state.beatNum+1)%this.state.musicData.length
    console.log("beat num: " + newBeatNum )
    console.log(this.state.musicData[this.state.beatNum])
    this.state.currentScore = this.state.musicData[this.state.beatNum][0]["score"]
    this.setState({ beatNum: newBeatNum })
  }

  setScore = (event) => {
    event.preventDefault()
    console.log("setting score: " + this.state.currentScore)
    this.state.musicData[this.state.beatNum][0]["score"] = parseInt(this.state.inputScore)
    this.state.inputScore = ""
    this.nextBeat()
  }

  handleInputChange = (e) => {
    this.setState({ inputScore: e.target.value })
  }

  reset = () => {
    window.location.reload()
  }
  setGain(gain,beatNum,trackNum){
    var updatedMusicData = this.state.musicData
    updatedMusicData[beatNum][trackNum]["gain"] = gain
    this.setState({
      musicData : updatedMusicData
    })
  }
  render() {
    return (
      <div style={{ paddingTop: "30px" }}>
        <Song
          playing={this.state.playing}
          tempo={110}
        >
            <Sequencer
              resolution={this.state.musicData[this.state.beatNum][0]["beat"].length}
              bars={1}
            >
              {generateSamplers(this.state.musicData[this.state.beatNum])}
            </Sequencer>
        </Song>

        <div style={{textAlign: "center"}}>
          <Beat beat={this.state.musicData[this.state.beatNum]} key = {this.state.beatNum}/>
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
            {this.state.playing ? 'Stop' : 'Play'}
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
            onClick={this.generateChildren}
          >
            Mate
          </button>
        </div>
        <div style ={{textAlign:"center"}}>
          <span>Generation: {this.state.generation}</span><br/>
          <span>Beat: {this.state.beatNum+1} / {this.state.totalBeats}</span>
          <div>Score: {this.state.musicData[this.state.beatNum][0]['score']}</div>
          <div>Parents: {this.state.musicData[this.state.beatNum][0]['parents']}</div>

          <form onSubmit = {this.setScore}>
            <label>Rate Beat
              <input type="text" value={this.state.inputScore} onChange={ this.handleInputChange.bind(this) } placeholder="Enter Score"/>
            </label>
          </form>
        </div>
      </div>
    )
  }
}
