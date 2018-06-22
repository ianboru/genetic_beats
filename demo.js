import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
} from '../src';

import Polysynth from './polysynth';
import Visualization from './visualization';

import './index.css';
const initialMusicData = [
  [
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/8580__ST_060.wav",
       beat: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/hihat.wav",
       beat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
     },
  ],
  [
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/8580_PST_090.wav",
       beat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
     },
     
  ],
  [
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/8580_PST_102.wav",
       beat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
     },
     
  ],
  /*[
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/cowbell.wav",
       beat: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
     },
     {
      score: 0,
       sample: "samples/hihat.wav",
       beat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     },

  ],
  [
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
     },
     {
      score: 0,
       sample: "samples/cowbell.wav",
       beat: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
     },
     {
      score: 0,
       sample: "samples/hihat.wav",
       beat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
     },

  ]*/
]

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
    super(props);

    this.state = {
      playing: false,
      lightMode: true,
      beatNum: 0,
      totalBeats: initialMusicData.length,
      currentScore: 0,
      musicData: initialMusicData,
      generation: 0,
      scoreThreshold: -1,
      allSamples: []
    };

    this.handlePlayToggle = this.handlePlayToggle.bind(this);
    this.toggleLightMode = this.toggleLightMode.bind(this);
    this.nextBeat = this.nextBeat.bind(this);
    this.setScore = this.setScore.bind(this);
    this.generateChildren = this.generateChildren.bind(this);
    this.mateCurrentPair = this.mateCurrentPair.bind(this);
    this.restart = this.restart.bind(this);
    this.updateUniqueSampleList = this.updateUniqueSampleList.bind(this);
    this.findInJSON = this.findInJSON.bind(this);
    this.updateUniqueSampleList()

  }
  
  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }
  toggleLightMode(){
    this.setState({lightMode: !this.state.lightMode});
  }
  arrayOfRandomIntegers(numIntegers,arrayLength){
    let randomIntegerArray = []
    for (let i = 0; i < numIntegers; i++) { 
      var randomInteger = Math.floor(Math.random() * arrayLength)
      while(randomIntegerArray.indexOf(randomInteger) > -1){
        randomInteger = Math.floor(Math.random() * arrayLength)
      }
      randomIntegerArray.push(randomInteger)
    }
    return randomIntegerArray
  }
  arrayFromIndexList(array,indexList){
    let randomIntegerArray = []
    console.log(array)
    console.log(indexList)
    console.log("final random ints")
    indexList.forEach(
      function(i){
        console.log(i)
        randomIntegerArray.push(array[i])
    })
    console.log(randomIntegerArray)
    return randomIntegerArray
  }
  updateUniqueSampleList(){
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
  updateScoreThreshold(){
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
  findInJSON(object,key,value){
    let result = {}
    object.forEach(
      function(element){
        if(element[key] && element[key] == value ){
          result = element
        }
    })
    //console.log('finding ' + key +' equals ' + value)
    //console.log(result)
    return result
  }
  generateChildren(){
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
              let momBeat = this.findInJSON(this.state.musicData[momIndex],'sample',sample)
              let dadBeat = this.findInJSON(this.state.musicData[dadIndex],'sample',sample)
              if(momBeat["sample"] || dadBeat["sample"]){
 
                if(!momBeat["sample"]){
                  momBeat = dadBeat
                }
                if(!dadBeat["sample"]){
                  dadBeat = momBeat
                }
                const childBeatForSample = this.mateCurrentPair(
                  momBeat,
                  dadBeat
                )
                currentBeat.push({
                  "parents" : dadIndex + "+" + momIndex,
                  "score" : aveParentScore,
                  "sample": sample,
                  "beat" : childBeatForSample
                })
              }

          }, this)
        
          nextGeneration.push(currentBeat)
        }
      }
    }
    //so generations don't get huge.
    console.log(nextGeneration)
    let randomIntegerArray = this.arrayOfRandomIntegers(numSurvivors,nextGeneration.length)
    console.log("random ints")
    console.log(randomIntegerArray)
    nextGeneration = this.arrayFromIndexList(nextGeneration,randomIntegerArray)
    this.setState({ 
      beatNum: 0,
      musicData : nextGeneration,
      totalBeats : nextGeneration.length,
      generation : this.state.generation + 1
    })
  }
  mateCurrentPair(mom,dad){
    console.log("mating current pair")
    console.log(mom)
    console.log(dad)
    var percentDifference = 0
    const mutationRate = .05

    if(Math.max(dad["score"],mom["score"]) > 0){
      percentDifference = Math.abs((dad["score"] - mom["score"])/Math.max(dad["score"],mom["score"]))
    }
    const inheritanceComparitor = 100*(.5 - percentDifference)
    const mutationComparitor = 100*mutationRate

    var fittestBeat = {}
    var weakestBeat = {}
    if(dad["score"] > mom["score"]){
      fittestBeat = dad
      weakestBeat = mom
    }else{
      fittestBeat = mom
      weakestBeat = dad
    }
    var childBeat = []
    for (let noteIndex = 0; noteIndex < mom["beat"].length; noteIndex++) {
      var randomInteger = Math.floor(Math.random() * 100)
      var survivingNote = 0 
      if(randomInteger > inheritanceComparitor){
        survivingNote = fittestBeat["beat"][noteIndex]
      }else{
        survivingNote = weakestBeat["beat"][noteIndex]
      }
      randomInteger = Math.floor(Math.random() * 100)
      if(randomInteger < mutationComparitor){
        survivingNote = 1 - survivingNote
      }
      childBeat.push(survivingNote)
    }
    
      return childBeat
  
  }
  nextBeat(){
    console.log("next beat")
    var newBeatNum = 0
    newBeatNum = (this.state.beatNum+1)%this.state.musicData.length
    console.log("beat num: " + newBeatNum )
    this.setState({ beatNum: newBeatNum })
  }
  setScore(event){
    event.preventDefault();
    console.log("setting score: " + this.state.currentScore)
    this.state.musicData[this.state.beatNum][0]["score"] = parseInt(this.state.currentScore)
    
  }
  handleInputChange(e) {
    this.setState({ currentScore: e.target.value });
  }
  restart(){
    this.setState({
      playing: false,
      lightMode: true,
      beatNum: 0,
      totalBeats: initialMusicData.length,
      currentScore: 0,
      musicData: initialMusicData,
      generation: 0,
    })
  }
  render() {
    return (
      <div style={this.state.lightMode ? {
        paddingTop: '30px'
      } : {
        backgroundColor: '#000',
        width: '100%',
        height: '100%',
        paddingTop: '30px'
      }}>
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
    );
  }
}
