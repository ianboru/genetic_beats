import React, { Component } from "react"
import { connect } from "react-redux"

import { throttle } from "throttle-debounce"


class Note extends Component {
  render = () => {
    let color

    if (this.props.value === 1) {
      color = "red"
    } else {
      color = "gray"
    }

    return (
      <div
        onClick   = {this.props.onClick}
        className = "note"
        style     = {{
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
  display : "inline-block",
  width   : 160,
}

class Track extends Component {
  constructor (props, context) {
    super(props, context)

    this.setGain = throttle(200, this.props.setGain)
  }

  handleGainChange = (evt) => {
    this.setGain(evt.target.value / 100, this.props.track.sample)
  }

  handleNoteToggle = (noteNumber) => {
    const { handleEdit, trackNum } = this.props
    handleEdit(trackNum, noteNumber)
  }

  handleRemoveTrack = () => {
    this.props.handleRemoveTrack(this.props.trackNum)
  }

  render = () => {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key     = {i}
          value   = {note}
          onClick = {() => { this.handleNoteToggle(i) }}
        />
      )
    })

    const { track } = this.props
    const trackNameParts = track.sample.split("/")
    const trackName = trackNameParts[trackNameParts.length - 1].split(".")[0]
    const gain = this.props.samples[track.sample].gain * 100
    return (
      <div className="track">
        <div style={trackNameStyles}>
          {trackName}
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


export default class Beat extends Component {
  handleEdit = (track, note) => {
    let { beat } = this.props
    beat.tracks[track].sequence[note] = beat.tracks[track].sequence[note] === 1 ? 0 : 1
    this.props.onEdit(beat)
  }

  render = () => {
    console.log("BEAT RENDER")
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
        />
      )
    })

    return <div className="beat">{tracks}</div>
  }
}
