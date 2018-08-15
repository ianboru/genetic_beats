import React, { Component } from "react"
import { observer } from "mobx-react"
import { toJS  } from "mobx"

import {
  Song,
  Sequencer,
  Sampler,
  Synth,
} from "../../src"

import store from "../store"


const generateSamplers = (beat, samples) => {
  console.log(toJS(beat.tracks[0]))
  if(beat.type == "synth"){

    return beat.tracks.map((track, i) => {
      let convertedSequence = []

      track.sequence.forEach((note, j) => {
        console.log(note)
        if (note === 1) { 
          convertedSequence.push([j, 2, track.sample]) 
        }
      })

      console.log("loading sampler ", track.sample)
      return (<Synth
        key    = {"synth"}
        type = {beat.synthType}
        steps  = {convertedSequence}
      />)
      console.log("making synth")
    })
    
  }else{
    return beat.tracks.map((track, i) => {
      let convertedSequence = []

      track.sequence.forEach((note, j) => {
        console.log(note)
        if (note === 1) { convertedSequence.push(j) }
      })

      console.log("loading sampler ", track.sample)
      return (<Sampler
        key    = {i}
        sample = {samples[track.sample].path}
        steps  = {convertedSequence}
        
      />)
      console.log("making synth")
    })
  }
}

const generateMetronomeSampler = (resolution, on) => {
 if (!on) {
  return null
 }

  let staticFilePath = ""
  if (process.env.NODE_ENV === "PRODUCTION") {
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
    const { beat, playing, resolution, bars } = this.props
    if (!beat || !beat.tracks || beat.tracks.length < 1) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {store.tempo}
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
