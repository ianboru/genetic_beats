import React, { Component } from "react"
import { observer } from "mobx-react"

import store from "../store"

import Beat from "./beat"


@observer
class CreateBeat extends Component {
  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    const sample = this.sampleSelect.value
    const sequence = Array(steps).fill(0)
    store.addTrackToNewBeat(sample, sequence)
  }

  render = () => {
    const beat = store.newBeat
    store.newBeat.tracks

    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    const beatSamples = beat.tracks.map( (track) => { return track.sample } )
    const unusedSampleKeys = Object.keys(store.samples).filter( (key) => {
      const sample = store.samples[key]
      return !beatSamples.includes(sample.path)
    })

    const sampleOptions = unusedSampleKeys.map( (key) => {
      const sample = store.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {key}
        >{sample.name}</option>
      )
    })

    return (
      <div>
        <div>
          {
            beat.tracks.length > 0 ?
              <Beat
                beat    = {beat}
                samples = {store.samples}
                setGain = {store.setGain}
                onEdit  = {store.setNewBeat}
                handleRemoveTrack = {store.removeTrackFromNewBeat}
              />
                :
              <div>No tracks yet</div>
          }
          <select defaultValue={16} disabled={beat.tracks.length > 0} ref={(c) => { this.stepsSelect = c }}>{stepOptions}</select>
          <select ref={(c) => { this.sampleSelect = c }}>{sampleOptions}</select>
          <button onClick={this.handleAddTrack}>Add track</button>
          <button onClick={store.handlePlayBeat}>Play beat</button>
        </div>
        <button
          onClick  = {store.addNewBeatToCurrentGen}
          disabled = {beat.tracks.length === 0}
        >add beat to current generation</button>
      </div>
    )
  }
}

export default CreateBeat
