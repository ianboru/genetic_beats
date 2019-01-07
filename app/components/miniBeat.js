import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import { toJS } from "mobx"

import { MdAdd } from "react-icons/md"
import Player from "./player"

import AddTrackButton from "./addTrackButton"
import Button from "./button"
import ConfigControl from "./configControl"
import Note from "./note"
import PlayControls from "./playControls"
import StarRating from "./starRating"
import TempoControls from "./tempoControls"
import Track from "./track"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"

import { colors } from "../colors"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0px auto 7px;
  padding: 5px;
`



const TableRow = styled.div`
  display: table-row;
  width: 100%;
`


@observer
class MiniBeat extends Component {

  render() {
    const tracks = this.props.beat.tracks.map( (track, i) => {
      return (
        <MiniTrack
          key        = {`${this.props.beat.key}.${i}`}
          trackNum   = {i}
          track      = {track}
          beatKey = {this.props.beatKey}

        />
      )
    })

    return (
      <StyledBeat>
        {tracks}
      </StyledBeat>
    )
  }
}

const trackNameStyles = {
  display       : "inline-block",
  width         : 190,
  textAlign     : "center",
}

const StyledTrack = styled.div`
  margin : 0 auto;
  font-size : 8px;

`

@observer
class MiniTrack extends Component {
  state = {
    lastClickedNoteWasOn : null,
    lastEntered          : -1,
  }

  componentDidMount() {
  }

  render() {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <MiniNote
          key     = {`${i}.${note}`}
          value   = {note}
          index   = {i}
          beatKey = {this.props.beatKey}
        />
      )
    })

    const track = this.props.track

    return (
      <StyledTrack>

          {notes}

      </StyledTrack>
    )
  }
}

const StyledNote = styled.div`
  background-color: ${props => props.active ? "pink" : props.on ? "red" : "gray" };
  border-radius: 2px;
  border: 1px solid black;
  cursor: pointer;
  display: inline-block;
  height: 6px;
  width: 6px;
  margin: 0;
  transition: 0.2s background-color;
  vertical-align: middle;
  font-size : 6px;
`


@observer
class MiniNote extends Component {
  render() {
    console.log("render note" , this.props.index, playingStore.currentLitNote, playingStore.beatPlayers[this.props.beatKey])
    const active = this.props.index == playingStore.currentLitNote &&  playingStore.beatPlayers[this.props.beatKey]
    const separator = this.props.index % 4 === 3

    return (
        <StyledNote
          active      = {active}
          on          = {this.props.value === 1}
          onMouseDown = {this.props.onClick}
          onMouseOver = {this.props.onMouseOver}
          className   = "note"
        >&nbsp;</StyledNote>
    )
  }
}


export default MiniBeat
