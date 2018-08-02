import React, { Component } from "react"
import { observer } from "mobx-react"

import appState from "../appState"

import Beat from "./beat"


@observer
class CreateBeat extends Component {
  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    const sample = this.sampleSelect.value
    const sequence = Array(steps).fill(0)
    appState.addTrackToNewBeat(sample, sequence)
  }

  render = () => {
    const beat = appState.newBeat
    appState.newBeat.tracks

    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    const beatSamples = beat.tracks.map( (track) => { return track.sample } )
    const unusedSampleKeys = Object.keys(appState.samples).filter( (key) => {
      const sample = appState.samples[key]
      return !beatSamples.includes(sample.path)
    })

    const sampleOptions = unusedSampleKeys.map( (key) => {
      const sample = appState.samples[key]
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
                samples = {appState.samples}
                setGain = {appState.setGain}
                onEdit  = {appState.setNewBeat}
                handleRemoveTrack = {appState.removeTrackFromNewBeat}
              />
                :
              <div>No tracks yet</div>
          }
          <select defaultValue={16} disabled={beat.tracks.length > 0} ref={(c) => { this.stepsSelect = c }}>{stepOptions}</select>
          <select ref={(c) => { this.sampleSelect = c }}>{sampleOptions}</select>
          <button onClick={this.handleAddTrack}>Add track</button>
          <button onClick={appState.handlePlayBeat}>Play beat</button>
        </div>
        <button
          onClick  = {appState.addNewBeatToCurrentGen}
          disabled = {beat.tracks.length === 0}
        >add beat to current generation</button>
      </div>
    )
  }
}

export default CreateBeat
