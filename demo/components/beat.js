import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { toJS } from "mobx"

import Button from "./button"

import {allNotesInRange} from "../utils"

import store from "../store"
import {
  itemBgColor,
  lightGray,
} from "../colors"


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


const RemoveTrackButton = styled.span`
  color: white;
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;
  position: relative;
  top: -5px;
  height: 15px;
  width: 15px;
  display: inline-block;

  &:hover {
    color: red;
  }
`


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


    if (this.props.track.trackType === "synth") {
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
      <div className="track">
        <div style={trackNameStyles}>
          <select value={this.props.track.sample} onChange={this.handleSampleChange}>
            {sampleOptions}
          </select>
        </div>
        {notes}
          <RemoveTrackButton
            title   = {"Delete track}"}
            onClick = {this.handleRemoveTrack}
          >&times;</RemoveTrackButton>
          <GainSlider sample={track.sample} trackType={track.trackType} />
      </div>
    )
  }
}


const StyledBeat = styled.div`
  background: ${itemBgColor};
  border-top: 1px solid ${lightGray};
  position: relative;
`

const BeatInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
`


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
        />
      )
    })

    return (
      <StyledBeat>
        <BeatInfo>
          <div>
            Beat: {this.props.beat.key}
          </div>
          <div>
            Score: {this.props.beat.score}
          </div>
          <div>
            <Button small onClick={() => store.addBeatToArrangement(this.props.beat.key)}>
              Add To Arrangement
            </Button>
          </div>
        </BeatInfo>
        {tracks}
      </StyledBeat>
    )
  }
}


export default Beat
