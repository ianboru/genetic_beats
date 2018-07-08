import React, { Component } from "react"

import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"


const tempo = 100


const generateSamplers = (beat) => {
 return beat.map((track, i) => {
   let convertedBeat = []
   track.sequence.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     key    = {i}
     sample = {track.sample}
     steps  = {convertedBeat}
   />)
 })
}


export default class Player extends Component {
  render = () => {
    const { beat, playing } = this.props
    if (!beat) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {tempo}
      >
        <Sequencer
          bars       = {1}
          resolution = {beat[0].sequence.length}
        >
          {generateSamplers(beat)}
        </Sequencer>
      </Song>
    )
  }
}
