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
import GainSlider from "./gainSlider"
import SamplePicker from "./samplePicker"

import DrumsetIcon from "../svg/drumset.svg"
import SynthIcon from "../svg/synth.svg"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const trackNameStyles = {
  display       : "inline-block",
  width         : 220,
  textAlign     : "left",
}


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
  display: table-row;
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
      familyStore.toggleNoteOnCurrentBeat(trackNum, noteNumber)
    } else if (!wasClicked && wasOn && familyStore.currentBeat.tracks[trackNum].sequence[noteNumber]) {
      familyStore.toggleNoteOnCurrentBeat(trackNum, noteNumber)
    } else if (!wasClicked && !wasOn && !familyStore.currentBeat.tracks[trackNum].sequence[noteNumber]) {
      familyStore.toggleNoteOnCurrentBeat(trackNum, noteNumber)
    }
  }

  handleSampleChange = (e) => {
    const { trackNum } = this.props
    familyStore.setSampleOnCurrentBeat(trackNum, e.target.value)
  }

  renderSamplePreviewer = () => {
    const { track } = this.props
    if (track.trackType === "synth") {
      const synthType = track.synthType ? track.synthType : "sine"
      return(
        <span>
          <button
            style   = {{verticalAlign:"middle"}}
            onClick = {() => {
              if (track.trackType === "synth") {
                let synth = new Tone.Synth({
                  oscillator: { type: track.synthType },
                }).toMaster()
                synth.triggerAttackRelease(track.sample, "16n")
              } else if (track.trackType === "sampler") {
                var sampler = new Tone.Sampler({
                  [track.sample]: store.samples[track.sample],
                }, () => {
                  sampler.triggerAttack(track.sample)
                })
              }
            }}
          >Play</button>
        </span>
      )
    } else {
      return (
        <span>
          <button
            style   = {{verticalAlign:"middle"}}
            onClick = {() => this.samplePreviewer.play()}
          >Play</button>
          <audio key={track.sample} ref={ref => this.samplePreviewer = ref}>
            <source src={store.samples[track.sample].path}/>
          </audio>
        </span>
      )
    }
  }

  componentDidMount() {
    if (this.props.track.trackType === "sampler") {
      this.samplePreviewer.volume = store.samples[this.props.track.sample].gain
    }
  }

  render() {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key   = {`${i}.${note}`}
          value = {note}
          activeNotes = {this.props.activeNotes}
          onClick = {(e) => {
            this.setState({
              lastEntered : i,
              lastClickedNoteWasOn: familyStore.currentBeat.tracks[this.props.trackNum].sequence[i] > 0,
            })
            this.handleNoteToggle(i,note,true)
          }}
          onMouseOver = {(e) => {
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
          {this.renderSamplePreviewer()}
        </Column>

        <Column>
          <div style={trackNameStyles}>
            {track.trackType === "sampler" ?
              <DrumsetIcon
                height={25}
                width={35}
                style={{
                  verticalAlign: "middle",
                  filter: "brightness(0) invert(1)",
                  padding: "0 5px 0 5px",
                }}
              /> :
              <SynthIcon
                height={25}
                width={35}
                style={{
                  verticalAlign: "middle",
                  filter: "brightness(0) invert(1)",
                  padding: "0 5px 0 5px",
                }}
              />
            }
            <SamplePicker
              track = {track}
              handleSampleChange = {this.handleSampleChange}
            />
          </div>
        </Column>

        <Column>
          {notes}
        </Column>

        <Column>
          <Tooltip position="left" text="Mute">
            <MuteTrackButton
              active={track.mute}
              onClick={() => {this.props.handleMuteTrack(track)}}
            >M</MuteTrackButton>
          </Tooltip>

          <Tooltip position="right" text="Solo">
            <SoloTrackButton
              active={track.solo}
              onClick={()=>{this.props.handleSoloTrack(track)}}
            >S</SoloTrackButton>
          </Tooltip>
        </Column>

        <Column>
          <GainSlider
            sample    = {track.sample}
            synthType = {track.synthType}
            trackType = {track.trackType}
          />
        </Column>

        <Column>
          <RemoveTrackButton
            className = "remove-track"
            title     = {"Delete track"}
            onClick   = {() => {familyStore.removeTrackFromCurrentBeat(this.props.trackNum)}}
          ><MdDeleteForever/></RemoveTrackButton>
        </Column>
      </StyledTrack>
    )
  }
}


export default Track
