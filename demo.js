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
const musicData = [
  [
     {
       score: 0,
       sample: "samples/kick.wav",
       beat: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
     },
     {
      score: 0,
       sample: "samples/snare.wav",
       beat: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
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
     beat: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
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
      currentScore: 0,
      musicData: musicData
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
    this.toggleLightMode = this.toggleLightMode.bind(this);
    this.nextBeat = this.nextBeat.bind(this);
    this.setScore = this.setScore.bind(this);

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
    console.log("generating children")
  }
  nextBeat(){
    console.log("next beat")
    var newBeatNum = 0
    newBeatNum = (this.state.beatNum+1)%musicData.length
    console.log("beat num: " + newBeatNum )
    this.setState({ beatNum: newBeatNum })
  }
  setScore(event){
    event.preventDefault();
    console.log("setting score: " + this.state.currentScore)
    musicData[this.state.beatNum][0]["score"] = this.state.currentScore
    this.state.musicData = musicData
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
        <div>Current Score: {this.state.musicData[this.state.beatNum][0]['score']}</div>
        <form onSubmit = {this.setScore}>
          <label>Score:
            <input type="text" value={this.state.currentScore} onChange={ this.handleInputChange.bind(this) } placeholder="Enter Score"/>
          </label>
            <input type="submit" value="Submit" />
        </form>
        
      </div>
    );
  }
}
