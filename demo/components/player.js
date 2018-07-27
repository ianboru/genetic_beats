import React, { Component } from "react"
import { connect } from "react-redux"

import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"




const generateSamplers = (beat, samples) => {
 return beat.tracks.map((track, i) => {
   let convertedSequence = []

   track.sequence.forEach((note, i) => {
     if (note === 1) { convertedSequence.push(i) }
   })

   return (<Sampler
     key    = {i}
     sample = {track.sample}
     steps  = {convertedSequence}
     gain   = {samples[track.sample].gain}
   />)
 })
}
const generateMetronomeSampler = (resolution, on) => {
 if(!on){
  return (null)
 }
 let sample =  "samples/clave.wav"
                 
  let sequence = []
  for (let i = 0; i < (resolution); i++) {
    let comparitor = resolution/4
    if(resolution == 2){
      comparitor = 1
    }
    if(i % comparitor == 0){
      sequence.push(i)
    }
  }
 return (<Sampler
     key    = {100}
     sample = {sample}
     steps  = {sequence}
     gain   = {.5}
  />)
}


class Player extends Component {
  render = () => {
    const { beat, playing } = this.props
    if (!beat || !beat.tracks || beat.tracks.length < 1) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {this.props.tempo}
      >
        <Sequencer
          bars       = {1}
          resolution = {beat.tracks[0].sequence.length}
        >
          {generateSamplers(beat, this.props.samples)}
          {generateMetronomeSampler(beat.tracks[0].sequence.length,this.props.metronome)}
        </Sequencer>
      </Song>
    )
  }
}

export default connect(
  (state) => {
    return {
      samples: state.samples,
      tempo : state.tempo,
      metronome : state.metronome,
    }
  }
)(Player)
