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
        className = "note"
        style = {{
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
  render = () => {
    const notes = this.props.track.beat.map( (note, i) => {
      return <Note key={i} value={note} />
    })

    const trackNameParts = this.props.track.sample.split("/")
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
  render = () => {
    const tracks = this.props.beat.map( (track, i) => {
      return <Track key={i} track={track} />
    })

    return <div className="beat">{tracks}</div>
  }
}
