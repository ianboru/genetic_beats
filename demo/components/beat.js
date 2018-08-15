import React, { Component } from "react"
import { observer } from "mobx-react"
import { toJS  } from "mobx"

import store from "../store"


@observer
class GainSlider extends Component {
  handleGainChange = (e) => {
    if(this.props.trackType == "synth"){
      store.setSynthGain(e.target.value / 100)
    }else{
      store.setGain(this.props.sample, e.target.value / 100)
    }
  }

  render() {
    const { sample } = this.props
    let gain
    if(this.props.trackType == "synth"){
      gain = store.synthGain * 100
    }else{
      gain = store.samples[sample].gain * 100
    }
    console.log(sample, gain)
    return (
      <input
        type     = "range"
        min      = {0}
        max      = {100}
        value    = {gain}
        onChange = {this.handleGainChange}
      />
    )
  }
}


@observer
class Note extends Component {
  render() {
    let color

    if (this.props.value === 1) {
      color = "red"
    } else {
      color = "gray"
    }

    return (
      <div
        onMouseDown = {this.props.onClick}
        className   = "note"
        style       = {{
          cursor     : "pointer",
          margin     : 3,
          height     : 20,
          width      : 20,
          display    : "inline-block",
          background : color,
        }}
      ></div>
    )
  }
}

const trackNameStyles = {
  display       : "inline-block",
  width         : 160,
  textAlign     : "center",
  verticalAlign : "top",
}


@observer
class Track extends Component {
  handleNoteToggle = (noteNumber) => {
    const { handleEdit, trackNum } = this.props
    handleEdit(trackNum, noteNumber)
  }

  handleRemoveTrack = () => {
    this.props.handleRemoveTrack(this.props.trackNum)
  }

  handleSampleChange = (e) => {
    this.props.handleSampleChange(this.props.trackNum, e.target.value)
  }

  render() {

    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key     = {`${i}.${note}`}
          value   = {note}
          onClick = {() => { this.handleNoteToggle(i) }}
        />
      )
    })

    const { track } = this.props
    const trackNameParts = track.sample.split("/")
    const trackName = trackNameParts[trackNameParts.length - 1].split(".")[0]

    let sampleOptions = Object.keys(store.samples).map( (key) => {
      const sample = store.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {key}
        >{sample.name}</option>
      )
    })
    // hack to allow synth notes in select options 
    if(!sampleOptions.includes(this.props.track.sample)){
      sampleOptions.push(
         <option
          key   = {this.props.track.sample}
          value = {this.props.track.sample}
        >{this.props.track.sample}</option>
      )
    }
    console.log("MAKING TRACKS",toJS(this.props.track))
    return (
      <div className="track">
        <div style={trackNameStyles}>
          <select value={this.props.track.sample} onChange={this.handleSampleChange}>
            {sampleOptions}
          </select>
        </div>
        {notes}
          <span
            className = "remove-track"
            onClick   = {this.handleRemoveTrack}
          >remove track</span>
          <GainSlider sample={track.sample} trackType={track.trackType} />
      </div>
    )
  }
}


@observer
class Beat extends Component {
  handleEdit = (track, note) => {
    let { beat } = this.props
    this.props.handleToggleNote(track, note)
  }

  handleSampleChange = (track, sample) => {
    let { beat } = this.props
    this.props.handleSetSample(track, sample)
  }

  render() {
    const tracks = this.props.beat.tracks.map( (track, i) => {
      return (
        <Track
          key        = {`${this.props.beat.key}.${i}`}
          trackNum   = {i}
          track      = {track}
          handleEdit = {this.handleEdit}
          handleRemoveTrack = {this.props.handleRemoveTrack}
          handleSampleChange = {this.handleSampleChange}
          beatType = {this.props.beat.type}
        />
      )
    })

    return <div className="beat">{tracks}</div>
  }
}


export default Beat
