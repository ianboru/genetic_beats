import React, { Component } from "react"
import { observer } from "mobx-react"

import store from "../store"
import {allNotesInRange} from "../utils"
import Beat from "./beat"


@observer
class CreateBeat extends Component {
  state = {
    trackType : "sampler",
  }

  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    let sample

    if (this.state.trackType === "sampler") {
      const beat = store.newBeat
      const beatSamples = beat.tracks.map( (track) => { return track.sample } )
      const unusedSamples = Object.keys(store.samples).filter( (key) => {
        const sample = store.samples[key]
        return !beatSamples.includes(sample.path)
      })

      sample = unusedSamples[0]
    } else if (this.state.trackType === "synth") {
      sample = allNotesInRange[0]
    }

    const sequence = Array(steps).fill(0)
    const trackType = this.state.trackType
    store.addTrackToNewBeat({sample, sequence, trackType})
  }

  resetNewBeat = () => {
    if (confirm("Are you sure you want to reset the new beat?")) {
      store.resetNewBeat()
    }
  }

  toggleTrackType = () => {
    let newTrackType
    if (this.state.trackType === "sampler") {
      newTrackType = "synth"
    } else {
      newTrackType = "sampler"
    }
    this.setState({trackType : newTrackType })
  }

  render() {
    const beat = store.newBeat

    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    return (
      <div>
        <div>
          {
            beat.tracks.length > 0 ?
              <Beat
                beat    = {beat}
                handleRemoveTrack = {store.removeTrackFromNewBeat}
                handleToggleNote  = {store.toggleNoteOnNewBeat}
                handleSetSample   = {store.setSampleOnNewBeat}
              />
                :
              <div>No tracks yet</div>
          }
          <select 
            defaultValue={16} 
            disabled={beat.tracks.length > 0} 
            ref={(c) => { this.stepsSelect = c }}
          >
            {stepOptions}
          </select>
          <button onClick={this.props.togglePlayBeat}>{this.props.playing ? "Stop" : "Play"}</button>
          <button onClick={this.handleAddTrack}>Add {this.state.trackType} track</button>
          <button onClick={this.toggleTrackType}>Toggle track type</button>
        </div>

        <button
          onClick  = {this.resetNewBeat}
          disabled = {beat.tracks.length === 0}
        >reset</button>

        <button
          onClick  = {store.addNewBeatToCurrentGen}
          disabled = {beat.tracks.length === 0}
        >add beat to current generation</button>
      </div>
    )
  }
}

export default CreateBeat
