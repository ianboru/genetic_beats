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

import "./index.css"


const generateSamplers = (data) => {
 return data.map((sample) => {
   let convertedBeat = []
   sample.beat.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     sample = {sample.sample}
     steps  = {convertedBeat}
   />)
 })
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
    const numMaters = 3
    var allScores = []
    this.state.musicData.forEach(
      function(beat){
        console.log(beat[0]["score"])
        allScores.push(beat[0]["score"])
    })
    allScores = allScores.sort()
    this.state.scoreThreshold = allScores[allScores.length-numMaters]
    console.log("current score threshold: " + this.state.scoreThreshold)
  }

  generateChildren = () => {
    const numChildren = 3
    const numSurvivors = 4
    var nextGeneration = []
    console.log("generating " + numChildren + " children")
    console.log(this.state.musicData)
    this.updateScoreThreshold()
    this.updateUniqueSampleList()
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
        for(let childIndex = 0; childIndex < numChildren; childIndex++){
          var currentBeat = []
          this.state.allSamples.forEach(
            function(sample){
              let momBeat = findInJSON(this.state.musicData[momIndex],'sample',sample)
              let dadBeat = findInJSON(this.state.musicData[dadIndex],'sample',sample)
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
                  "parents" : dadIndex + "+" + momIndex,
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
    this.setState({ beatNum: newBeatNum })
  }

  setScore = (event) => {
    event.preventDefault()
    console.log("setting score: " + this.state.currentScore)
    this.state.musicData[this.state.beatNum][0]["score"] = parseInt(this.state.currentScore)
  }

  handleInputChange = (e) => {
    this.setState({ currentScore: e.target.value })
  }

  restart = () => {
    this.setState({
      playing: false,
      beatNum: 0,
      totalBeats: initialMusicData.length,
      currentScore: 0,
      musicData: initialMusicData,
      generation: 0,
    })
  }

  render() {
    return (
      <div style={{ paddingTop: "30px" }}>
        <Song
          playing={this.state.playing}
          tempo={90}
        >

            <Sequencer
              resolution={16}
              bars={1}
            >
              {generateSamplers(this.state.musicData[this.state.beatNum])}
            </Sequencer>
        </Song>

        <button
          className="react-music-button"
          type="button"
          onClick={this.restart}
        >
          Restart
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

        <div style ={{textAlign:"center"}}>
          <div>Current Score: {this.state.musicData[this.state.beatNum][0]['score']}</div>
          <div>parents: {this.state.musicData[this.state.beatNum][0]['parents']}</div>

          <form onSubmit = {this.setScore}>
            <label>Score:
              <input type="text" value={this.state.currentScore} onChange={ this.handleInputChange.bind(this) } placeholder="Enter Score"/>
            </label>
              <input type="submit" value="Submit" />
          </form>
          <span>generation: {this.state.generation}</span><br/>
          <span>playing beat: {this.state.beatNum+1} / {this.state.totalBeats}</span>
        </div>
      </div>
    )
  }
}
