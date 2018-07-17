import React, { Component } from "react"
import { connect } from "react-redux"


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
          cursor     : this.props.editable ? "pointer" : "default",
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
  }

  handleGainChange = (evt) => {
    this.props.setGain(evt.target.value / 100, this.props.track.sample)
  }

  handleNoteToggle = (noteNumber) => {
    const { handleEdit, trackNum } = this.props
    handleEdit(trackNum, noteNumber)
  }

  render = () => {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key      = {i}
          value    = {note}
          editable = {this.props.editable}
          onClick  = {this.props.editable ? () => { this.handleNoteToggle(i) }: null}
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
        {
          this.props.editable ? null :
            <input
              type         = "range"
              min          = {0}
              max          = {100}
              defaultValue = {gain}
              onChange     = {this.handleGainChange}
            />
        }
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
    const tracks = this.props.beat.tracks.map( (track, i) => {
      return (
        <Track
          key        = {`${this.props.beat.key}.${i}`}
          setGain    = {this.props.setGain}
          trackNum   = {i}
          track      = {track}
          editable   = {this.props.editable}
          handleEdit = {this.handleEdit}
          samples    = {this.props.samples}
        />
      )
    })

    return <div className="beat">{tracks}</div>
  }
}
