import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import Tone from "tone"
import familyStore from "../stores/familyStore"
import Note from "./note"
import Column from "../styledComponents/column"
import {BEAT_RESOLUTION} from "../utils"

const KeyboardBody = styled.div`
  background: black;
  display: inline-block;
  text-align: right;
  width: 300px;
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
  font-size: 20px;
  height: 28px;

  &:hover {
    background: #bbb;
  }

  &:active {
    background: #ddd;
  }
`

const StyledTrack = styled.div`
  margin: 0 auto;
`

@observer
class Track extends Component {
  state = {
    lastClickedNoteWasOn: null,
    lastEntered: -1,
  }

  handleNoteToggle = (noteNumber, wasOn, wasClicked) => {
    const {beat, trackNum} = this.props

    if (
      wasClicked ||
      !!wasOn === !!beat.sections.keyboard.tracks[trackNum].sequence[noteNumber]
    ) {
      familyStore.toggleNoteOnBeat(beat, "keyboard", trackNum, noteNumber)
    }
  }

  handleSampleChange = (e) => {
    const {beat, trackNum} = this.props
    familyStore.setSampleOnBeat(beat, "keyboard", trackNum, e.target.value)
  }

  render() {
    const notes = this.props.track.sequence.map((note, i) => {
      return (
        <Note
          key={`${i}.${note}`}
          value={note}
          activeNotes={this.props.activeNotes}
          onClick={() => {
            this.setState({
              lastEntered: i,
              lastClickedNoteWasOn:
                this.props.beat.sections.keyboard.tracks[this.props.trackNum]
                  .sequence[i] > 0,
            })
            this.handleNoteToggle(i, note, true)
          }}
          onMouseOver={(e) => {
            if (e.buttons === 1 && this.state.lastEntered !== i) {
              this.handleNoteToggle(i, this.state.lastClickedNoteWasOn, false)
              this.setState({
                lastEntered: i,
              })
            }
          }}
          index={i}
        />
      )
    })

    const track = this.props.track

    return (
      <StyledTrack>
        <Column>
          <KeyboardBody>
            <SynthTrackName
              onClick={() => {
                const synth = new Tone.Synth({
                  oscillator: {type: track.synthType},
                }).toMaster()
                synth.triggerAttackRelease(track.sample, BEAT_RESOLUTION)
              }}
            >
              {track.sample}
            </SynthTrackName>
          </KeyboardBody>
        </Column>

        {notes}

        <Column textLeft width={200}>
          &nbsp;
        </Column>
      </StyledTrack>
    )
  }
}

export default Track
