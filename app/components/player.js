import React, { Component } from "react"
import { observer } from "mobx-react"

import {
  Song,
  Sequencer,
  Sampler,
  Synth,
} from "../react-music"

import store from "../stores/store"
import playingStore from "../stores/playingStore"


const generateSamplers = (beat, samples) => {
  const synthTypes = ["sine","square"]
  let convertedSynthSequences = {}
  let synthType = null

  let samplers = beat.tracks.map((track, i) => {
    if(track.trackType == "synth"){

      synthType = track.synthType ? track.synthType : "sine"
      if(!convertedSynthSequences[synthType]){
        convertedSynthSequences[synthType] = []
      }
      track.sequence.forEach((note, j) => {
        if (note === 1 && !track.mute) { 
          convertedSynthSequences[synthType].push([j, 2, track.sample]) 
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
  synthTypes.forEach((synthType)=>{
    if(convertedSynthSequences[synthType]){
      samplers.push(
        <Synth
          key   = {"synth" + synthType +  store.generation + "."+ store.beatNum}
          type  = {synthType}
          steps = {convertedSynthSequences[synthType]}
          gain  = {store.synthGain[synthType]/store.synthGainCorrection[synthType]}
        />
      ) 
    }
    
  })
  

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
        tempo   = {playingStore.tempo}
        ref     = {(c)=>{this.song=c}}
      >
        <Sequencer
          bars       = {bars ? bars : 1}
          resolution = {resolution}
        >
          {generateSamplers(beat, store.samples)}
          {generateMetronomeSampler(resolution, playingStore.metronome)}
        </Sequencer>
      </Song>
    )
  }
}


export default Player
