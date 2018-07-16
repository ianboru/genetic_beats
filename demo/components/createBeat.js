import React, { Component } from "react"

import Beat from "./beat"


export default class CreateBeat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      beat: {},
    }
  }

  handleAddTrack = () => {
    const steps = parseInt(this.stepsSelect.value)
    const sample = this.sampleSelect.value

    this.setState( {
      beat: { ...this.state.beat,
        tracks: [
          ...this.state.beat.tracks,
          {
            sample,
            sequence: Array(steps).fill(0),
          },
        ]
      },
    })
  }

  handleBeatEdit = (beat) => {
    this.setState({beat: beat})
  }

  handlePlayBeat = () => {
    this.props.handlePlayBeat(this.state.beat)
  }

  handleAddBeat = () => {
    this.props.handleAddBeat(this.state.beat)
  }

  render = () => {
    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    const sampleOptions = this.props.samples.map( (sample) => {
      return (
        <option
          key   = {sample.path}
          value = {sample.path}
        >{sample.name}</option>
      )
    })

    const { beat } = this.state

    return (
      <div>
        <div>
          {
            beat.length > 0 ?
              <Beat
                beat     = {beat}
                editable = {true}
                onEdit   = {this.handleBeatEdit}
              />
                :
              <div>No tracks yet</div>
          }
          <select defaultValue={16} disabled={beat.length > 0} ref={(c) => { this.stepsSelect = c }}>{stepOptions}</select>
          <select ref={(c) => { this.sampleSelect = c }}>{sampleOptions}</select>
          <button onClick={this.handleAddTrack}>Add track</button>
          <button onClick={this.handlePlayBeat}>Play beat</button>
        </div>
        <button onClick={this.handleAddBeat}>add beat to first generation</button>

      </div>
    )
  }
}
