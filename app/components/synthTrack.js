import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import Tone from "tone"

import { MdDeleteForever } from "react-icons/md"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"

import Note from "./note"
import Tooltip from "./tooltip"

import DrumsetIcon from "../svg/drumset.svg"
import SynthIcon from "../svg/synth.svg"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const KeyboardBody = styled.div`
  background: black;
  display: inline-block;
  text-align: right;
  width : 300px;
`

const SynthTrackName = styled.div`
  border-radius: 0 3px 3px 0;
  background: white;
  padding: 0 6px;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  color: black;
  display: inline-block;
  text-align: left;
  width: 90px;
  cursor: pointer;

  &:hover {
    background: #bbb;
  }

  &:active {
    background: #ddd;
  }
`


const RemoveTrackButton = styled.span`
  color: white;
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;
  margin-right: 10px;
  position: relative;
  top: -12px;
  height: 15px;
  width: 15px;
  display: inline-block;
  vertical-align: middle;

  &:hover {
    color: red;
  }
`

const StyledTrack = styled.div`
  //width : 1000px;
  margin : 0 auto;
`


@observer
class Track extends Component {
  state = {
    lastClickedNoteWasOn : null,
    lastEntered          : -1,
  }

  handleNoteToggle = (noteNumber, wasOn, wasClicked) => {
    const { trackNum } = this.props

    if (wasClicked) {
      familyStore.toggleNoteOnCurrentBeat("keyboard", trackNum, noteNumber)
    } else if (!wasClicked && wasOn && familyStore.currentBeat.sections.keyboard.tracks[trackNum].sequence[noteNumber]) {
      familyStore.toggleNoteOnCurrentBeat("keyboard", trackNum, noteNumber)
    } else if (!wasClicked && !wasOn && !familyStore.currentBeat.sections.keyboard.tracks[trackNum].sequence[noteNumber]) {
      familyStore.toggleNoteOnCurrentBeat("keyboard", trackNum, noteNumber)
    }
  }

  handleSampleChange = (e) => {
    const { trackNum } = this.props
    familyStore.setSampleOnCurrentBeat("keyboard", trackNum, e.target.value)
  }

  render() {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key   = {`${i}.${note}`}
          value = {note}
          activeNotes = {this.props.activeNotes}
          onClick = {(e) => {
            console.log("click")
            this.setState({
              lastEntered : i,
              lastClickedNoteWasOn: familyStore.currentBeat.sections.keyboard.tracks[this.props.trackNum].sequence[i] > 0,
            })
            this.handleNoteToggle(i,note,true)
          }}
          onMouseOver = {(e) => {
            console.log("mouse")
            if (e.buttons == 1 && this.state.lastEntered != i) {
              this.handleNoteToggle(i, this.state.lastClickedNoteWasOn, false)
              this.setState({
                lastEntered : i
              })
            }
          }}
          index   = {i}
        />
      )
    })

    const track = this.props.track

    return (
    <StyledTrack>
      <Column>
        <KeyboardBody>
          <SynthTrackName
            onClick={ () => {
              let synth = new Tone.Synth({
                oscillator: { type: track.synthType },
              }).toMaster()
              synth.triggerAttackRelease(track.sample, "16n")
            }}
          >
            {track.sample}
          </SynthTrackName>
        </KeyboardBody>
      </Column>

      {notes}

      <Column textLeft />
      </StyledTrack>
    )
  }
}


export default Track
