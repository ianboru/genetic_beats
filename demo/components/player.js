import React, { Component } from "react"
import { observer } from "mobx-react"

import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"

import store from "../store"


const generateSamplers = (beat, samples) => {
  return beat.tracks.map((track, i) => {
    let convertedSequence = []

    track.sequence.forEach((note, i) => {
      if (note === 1) { convertedSequence.push(i) }
    })

    return (<Sampler
      key    = {i}
      sample = {samples[track.sample].path}
      steps  = {convertedSequence}
      gain   = {samples[track.sample].gain}
    />)
  })
}

const generateMetronomeSampler = (resolution, on) => {
 if (!on) {
  return null
 }

  let staticFilePath = ""
  if (process.env.NODE_ENV) {
    staticFilePath = "/static/"
  }

 let sample = staticFilePath + "samples/clave.wav"

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
    const { beat, playing } = this.props
    if (!beat || !beat.tracks || beat.tracks.length < 1) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {store.tempo}
      >
        <Sequencer
          bars       = {1}
          resolution = {beat.tracks[0].sequence.length}
        >
          {generateSamplers(beat, store.samples)}
          {generateMetronomeSampler(beat.tracks[0].sequence.length, store.metronome)}
        </Sequencer>
      </Song>
    )
  }
}


export default Player
