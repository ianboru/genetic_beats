import React, { Component } from "react"
import { connect } from "react-redux"

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
} from "../../src"


const tempo = 100


const generateSamplers = (beat, samples) => {
 return beat.tracks.map((track, i) => {
   let convertedBeat = []
   track.sequence.forEach((note, i) => {
     if (note === 1) { convertedBeat.push(i) }
   })

   return (<Sampler
     key    = {i}
     sample = {track.sample}
     steps  = {convertedBeat}
     gain   = {samples[track.sample].gain}
   />)
 })
}


class Player extends Component {
  render = () => {
    const { beat, playing } = this.props
    if (!beat || !beat.tracks || beat.tracks.length < 1) { return null }

    return (
      <Song
        playing = {playing}
        tempo   = {tempo}
      >
        <Analyser onAudioProcess={this.props.handleAudioProcess}>
          <Sequencer
            bars       = {1}
            resolution = {beat.tracks[0].sequence.length}
          >
            {generateSamplers(beat, this.props.samples)}
          </Sequencer>
        </Analyser>
      </Song>
    )
  }
}

export default connect(
  (state) => {
    return {
      samples: state.samples,
    }
  }
)(Player)
