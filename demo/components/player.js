import React, { Component } from "react"

import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"


const tempo = 100


const generateSamplers = (data) => {
 return data.map((sample, i) => {
   let convertedBeat = []
   sample.beat.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     key    = {i}
     sample = {sample.sample}
     steps  = {convertedBeat}
   />)
 })
}


export default class Player extends Component {
  render = () => {
    const { beat, playing } = this.props
    const samplers = generateSamplers(beat)

    return (
      <Song
        playing = {playing}
        tempo   = {tempo}
      >
        <Sequencer
          bars       = {1}
          resolution = {beat[0]["beat"].length}
        >
          {samplers}
        </Sequencer>
      </Song>
    )
  }
}
