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
       sample: "samples/snare.wav",
       beat: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
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
       sample: "samples/snare.wav",
       beat: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
     },

  ]
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
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
    this.toggleLightMode = this.toggleLightMode.bind(this);
    this.nextBeat = this.nextBeat.bind(this);
    this.setScore = this.setScore.bind(this);
    this.generateChildren = this.generateChildren.bind(this);
    this.mateCurrentPair = this.mateCurrentPair.bind(this);

  }
  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }
  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }
  toggleLightMode(){
    this.setState({lightMode: !this.state.lightMode});
  }
  generateChildren(){
    const numChildren = 3
    var nextGeneration = []
    console.log("generating " + numChildren + " children")
    for (let momIndex = 0; momIndex < this.state.musicData.length; momIndex++) { 
      for (let dadIndex = momIndex+1; dadIndex < this.state.musicData.length; dadIndex++) { 
        console.log("mating " + momIndex + " and " + dadIndex)
        for(let childIndex = 0; childIndex < numChildren; childIndex++){
          var currentBeat = []
          for(let sampleIndex = 0; sampleIndex < this.state.musicData[momIndex].length; sampleIndex++){
              const childBeatForSample = this.mateCurrentPair(
                  this.state.musicData[momIndex][sampleIndex],
                  this.state.musicData[dadIndex][sampleIndex]
                  )
              currentBeat.push({
                "score" : 0,
                "sample": this.state.musicData[momIndex][sampleIndex]["sample"],
                "beat" : childBeatForSample
              })
          }
          nextGeneration.push(currentBeat)
          console.log("current child")
          console.log(nextGeneration)
        }
      }
    }
    
    this.setState({ 
      beatNum: 0,
      musicData : nextGeneration,
      totalBeats : nextGeneration.length,
      generation : this.state.generation + 1
    })
  }
  mateCurrentPair(mom,dad){
    console.log("mating current pair")
    var percentDifference = 0
    if(Math.max(dad["score"],mom["score"]) > 0){
      percentDifference = Math.abs((dad["score"] - mom["score"])/Math.max(dad["score"],mom["score"]))
    }
    const comparitor = 100*(.5 - percentDifference)
    console.log("comparitor " + comparitor)
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
      const randomInteger = Math.floor(Math.random() * 100) 
      if(randomInteger > comparitor){
        childBeat.push(fittestBeat["beat"][noteIndex])
      }else{
        childBeat.push(weakestBeat["beat"][noteIndex])
      }
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
    this.state.musicData[this.state.beatNum][0]["score"] = this.state.currentScore
    
  }
  handleInputChange(e) {
    this.setState({ currentScore: e.target.value });
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
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={1}
            >
              {generateSamplers(this.state.musicData[this.state.beatNum])}
            </Sequencer>
            
          </Analyser>
        </Song>

        <div style={{ textAlign: 'center' }}>
          <p style={this.state.lightMode ? {color: 'black'} : {color: 'white'}}>Light Mode</p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleLightMode} checked={this.state.lightMode} />
            <div className="slider round"></div>
          </label>
        </div>

        <Visualization ref={(c) => { this.visualization = c; }} />

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
        <div>Current Score: {this.state.musicData[this.state.beatNum][0]['score']}</div>
        <form onSubmit = {this.setScore}>
          <label>Score:
            <input type="text" value={this.state.currentScore} onChange={ this.handleInputChange.bind(this) } placeholder="Enter Score"/>
          </label>
            <input type="submit" value="Submit" />
        </form>
        <span>generation: {this.state.generation}</span><br/>
        <span>playing beat: {this.state.beatNum+1} / {this.state.totalBeats}</span>
      </div>
    );
  }
}
