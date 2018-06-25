import React, { Component } from "react"

// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider'

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
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: this.props.track.gain
    }
  }

  handleChange = value => {
    this.props.setGain(this.props.track.gain, this.props.key,this.props.beatNum)
    this.setState({
      value: value
    })
  };
  render = () => {
    const notes = this.props.track.beat.map( (note, i) => {
      return <Note key={i} value={note} />
    })

    const trackNameParts = this.props.track.sample.split("/")
    const trackName = trackNameParts[trackNameParts.length - 1].split(".")[0]
    const { value } = this.state
    return (
      <div className="track">
        <div style={trackNameStyles}>
          {trackName}
        </div>
        {notes}
          <Slider
            min={0}
            max={100}
            value={value}
            onChange={this.handleChange}
          />
          <div className='value'>{value}</div>
      </div>
    )
  }
}


export default class Beat extends Component {
  render = () => {
    const tracks = this.props.beat.map( (track, i) => {
      return <Track key={i} track={track} beatNum = {this.props.beatNum}/>
    })

    return <div className="beat">{tracks}</div>
  }
}
