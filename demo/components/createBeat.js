import React, { Component } from "react"
import { connect } from "react-redux"

import { actions } from "../store"
import Beat from "./beat"


class CreateBeat extends Component {
  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    const sample = this.sampleSelect.value
    const sequence = Array(steps).fill(0)
    this.props.addTrackToNewBeat(sample, sequence)
  }

  render = () => {
    const { beat } = this.props

    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    const beatSamples = beat.tracks.map( (track) => { return track.sample } )
    const unusedSampleKeys = Object.keys(this.props.samples).filter( (key) => {
      const sample = this.props.samples[key]
      return !beatSamples.includes(sample.path)
    })

    const sampleOptions = unusedSampleKeys.map( (key) => {
      const sample = this.props.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {sample.path}
        >{sample.name}</option>
      )
    })

    return (
      <div>
        <div>
          {
            beat.tracks.length > 0 ?
              <Beat
                beat     = {beat}
                editable = {true}
                samples  = {this.props.samples}
                onEdit   = {this.props.setNewBeat}
                handleRemoveTrack = {this.props.removeTrackFromNewBeat}
              />
                :
              <div>No tracks yet</div>
          }
          <select defaultValue={16} disabled={beat.tracks.length > 0} ref={(c) => { this.stepsSelect = c }}>{stepOptions}</select>
          <select ref={(c) => { this.sampleSelect = c }}>{sampleOptions}</select>
          <button onClick={this.handleAddTrack}>Add track</button>
          <button onClick={this.props.handlePlayBeat}>Play beat</button>
        </div>
        <button onClick={this.props.addNewBeatToCurrentGen}>add beat to current generation</button>

      </div>
    )
  }
}


export default connect(
  (state) => {
    return {
      beat: state.newBeat,
      samples: state.samples,
    }
  }, actions
)(CreateBeat)
