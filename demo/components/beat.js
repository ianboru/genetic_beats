import React, { Component } from "react"


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
  handleClick = (noteNumber) => {
    const { handleEdit, number } = this.props
    handleEdit(number, noteNumber)
  }

  render = () => {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key      = {i}
          value    = {note}
          editable = {this.props.editable}
          onClick  = {this.props.editable ? () => { this.handleClick(i) }: null}
        />
      )
    })

    const { track } = this.props
    const trackNameParts = track.sample.split("/")
    const trackName = trackNameParts[trackNameParts.length - 1].split(".")[0]

    return (
      <div className="track">
        <div style={trackNameStyles}>
          {trackName}
        </div>
        {notes}
      </div>
    )
  }
}


export default class Beat extends Component {
  handleEdit = (track, note) => {
    let beat = this.props.beat
    beat[track].sequence[note] = beat[track].sequence[note] === 1 ? 0 : 1
    this.props.onEdit(beat)
  }

  render = () => {
    const tracks = this.props.beat.map( (track, i) => {
      return (
        <Track
          key        = {i}
          number     = {i}
          track      = {track}
          editable   = {this.props.editable}
          handleEdit = {this.handleEdit}
        />
      )
    })

    return <div className="beat">{tracks}</div>
  }
}
