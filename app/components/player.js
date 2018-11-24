import React, { Component } from "react"
import { observer } from "mobx-react"

import {
  Song,
  Sequencer,
  Sampler,
  Synth,
} from "../react-music"

import store from "../store"


const generateSamplers = (beat, samples) => {
  let convertedSynthSequence = []
  let samplers = beat.tracks.map((track, i) => {
    if(track.trackType == "synth"){
      track.sequence.forEach((note, j) => {
        if (note === 1 && !track.mute) { 
          convertedSynthSequence.push([j, 2, track.sample]) 
        }
      })
    }else{
      let convertedSamplerSequence = []
      track.sequence.forEach((note, j) => {
        if (note === 1) { convertedSamplerSequence.push(j) }
      })
      return (<Sampler
        key    = {i}
        sample = {samples[track.sample].path}
        steps  = {convertedSamplerSequence}
        gain   = {track.mute ? 0 : samples[track.sample].gain*samples[track.sample].gainCorrection}
      />)
    }
  })
  samplers.push(
    <Synth
      key   = {"synth" + store.generation + "."+ store.beatNum}
      type  = {"square"}
      steps = {convertedSynthSequence}
      gain  = {store.synthGain/store.synthGainCorrection}
    />
  ) 

  return samplers
}

const generateMetronomeSampler = (resolution, on) => {
  if (!on) { return null }

  let sample = "/static/samples/clave.wav"

  let sequence = []
  for (let i = 0; i < resolution; i++) {
    let comparitor = resolution / 4
    if (resolution == 2) {
      comparitor = 1
    }
    if (i % comparitor == 0) {
      sequence.push(i)
    }
  }

  return (<Sampler
      key    = {100}
      sample = {sample}
      steps  = {sequence}
      gain   = {0.5}
  />)
}


@observer
class Player extends Component {

  render() {
    const { beat, playing, resolution, bars } = this.props
    if (!beat || !beat.tracks || beat.tracks.length < 1) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {store.tempo}
        ref     = {(c)=>{this.song=c}}
      >
        <Sequencer
          bars       = {bars ? bars : 1}
          resolution = {resolution}
        >
          {generateSamplers(beat, store.samples)}
          {generateMetronomeSampler(resolution, store.metronome)}
        </Sequencer>
      </Song>
    )
  }
}


export default Player
