import React, { Component } from "react"
import { action, computed, observable, toJS } from "mobx"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import Player from "./player"

import familyStore from "../stores/familyStore"
import BeatStore from "../stores/BeatStore"

import { colors } from "../colors"


const lightGreen = chroma("lightgreen").darken(0.4)
const lighterGreen = chroma("lightgreen").brighten(0.4)
const lightestGreen = chroma("lightgreen").brighten(1.2)


const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0px auto;
  padding: 0 5px 6px;
  width: 220px;
`


@observer
class MiniBeat extends Component {
  constructor(props) {
    super(props)

    this.beatStore = new BeatStore()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.playing) {
      this.beatStore.clearLitNote()
    }
  }

  render() {
    const synthTracks = this.props.beat.sections.keyboard.tracks.map( (track, i) => {
      return (
        <MiniTrack
          key         = {`${this.props.beat.id}.${i}`}
          trackNum    = {i}
          track       = {track}
          activeNotes = {this.beatStore.activeNotes}
        />
      )
    })

    const samplerTracks = this.props.beat.sections.drums.tracks.map( (track, i) => {
      return (
        <MiniTrack
          key         = {`${this.props.beat.id}.${i}`}
          trackNum    = {i}
          track       = {track}
          activeNotes = {this.beatStore.activeNotes}
        />
      )
    })

    return (
      <StyledBeat>
        {synthTracks}
        <div style={{ display: "block", padding: 4 }} />
        {samplerTracks}

        <Player
          beat       = {this.props.beat}
          playing    = {this.props.playing}
          resolution = {familyStore.currentBeatResolution}
          setLitNote = {this.beatStore.setLitNote}
        />
      </StyledBeat>
    )
  }
}

const StyledTrack = styled.div`
  margin : 0 auto;
  font-size : 0px;
`

@observer
class MiniTrack extends Component {
  render() {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <MiniNote
          key         = {`${i}.${note}`}
          value       = {note}
          index       = {i}
          activeNotes = {this.props.activeNotes}
        />
      )
    })

    return (
      <StyledTrack>
        {notes}
      </StyledTrack>
    )
  }
}

const StyledNote = styled.div`
  background-color: ${props => props.active ? props.on ? lightestGreen : "darkgray" : props.on ? lightGreen : "gray" };
  box-shadow: ${props => props.on ? `0 0 2px 0px ${lightGreen}` : "none"};
  border-radius: 0px;
  border: 1px solid black;
  cursor: pointer;
  position: relative;
  z-index: ${props => props.on ? 1 : 0 };
  display: inline-block;
  font-size : 0px;
  height: 12px;
  width: 12px;
  margin: 0;
  margin-right: -1px;
  margin-bottom: -1px;
  vertical-align: middle;
`


@observer
class MiniNote extends Component {
  render() {
    const separator = this.props.index % 4 === 3
    return (
      <StyledNote
        active      = {this.props.activeNotes[this.props.index].value}
        on          = {this.props.value === 1}
        className   = "note"
      >&nbsp;</StyledNote>
    )
  }
}


export default MiniBeat
