import React, { Component } from "react"
import { observer } from "mobx-react"

import store from "../store"
import {allNotesInRange} from "../utils"
import Beat from "./beat"

console.log("imported notes " , allNotesInRange)
@observer
class CreateBeat extends Component {
  
  state = {
      trackType : "sampler",
  }
  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    const sample = this.sampleSelect.value
    const sequence = Array(steps).fill(0)
    const trackType = this.state.trackType
    store.addTrackToNewBeat({sample, sequence, trackType})
  }
  handleToggleTrackType = () => {
    let newTrackType 
    if(this.state.trackType == "sampler"){
      newTrackType = "synth"
    }else{
      newTrackType = "sampler"
    }
    this.setState({trackType : newTrackType })
  }
  render() {
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

    let sampleOptions
    if(this.state.trackType == "sampler"){
      sampleOptions = unusedSampleKeys.map( (key) => {
        const sample = store.samples[key]
        return (
          <option
            key   = {sample.path}
            value = {key}
          >{sample.name}</option>
        )
      })
    }else{
      sampleOptions = allNotesInRange.map( (noteName) => {
        return (
          <option
            key   = {noteName}
            value = {noteName}
          >{noteName}</option>
        )
      })
    }
    

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
          <select defaultValue={16} disabled={beat.tracks.length > 0} ref={(c) => { this.stepsSelect = c }}>{stepOptions}</select>
          <select ref={(c) => { this.sampleSelect = c }}>{sampleOptions}</select>
          <button onClick={this.handleAddTrack}>Add track</button>
          <button onClick={this.props.handlePlayBeat}>Play beat</button>
          <button onClick={this.handleToggleTrackType}>Track Type:{this.state.trackType}</button>

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
