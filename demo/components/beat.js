import React, { Component } from "react"
import { observer } from "mobx-react"


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
  constructor (props, context) {
    super(props, context)

    this.setGain = this.props.setGain
  }

  handleGainChange = (evt) => {
    this.setGain(this.props.track.sample, evt.target.value / 100)
  }

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
    const gain = this.props.samples[track.sample].gain * 100

    const sampleOptions = Object.keys(this.props.samples).map( (key) => {
      const sample = this.props.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {key}
        >{sample.name}</option>
      )
    })

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
          <input
            type         = "range"
            min          = {0}
            max          = {100}
            value        = {gain}
            onChange     = {this.handleGainChange}
          />
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
          setGain    = {this.props.setGain}
          trackNum   = {i}
          track      = {track}
          handleEdit = {this.handleEdit}
          handleRemoveTrack = {this.props.handleRemoveTrack}
          samples    = {this.props.samples}
          handleSampleChange = {this.handleSampleChange}
        />
      )
    })

    return <div className="beat">{tracks}</div>
  }
}


export default Beat
