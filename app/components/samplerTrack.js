import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import { MdDeleteForever } from "react-icons/md"

import store from "../stores/store"
import familyStore from "../stores/familyStore"

import Note from "./note"
import Tooltip from "./tooltip"
import GainSlider from "./gainSlider"
import SamplePicker from "./samplePicker"

import DrumsetIcon from "../svg/drumset.svg"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const trackNameStyles = {
  display       : "inline-block",
  width         : 225,
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

const StyledLeftButtons = styled.div`
  width : 300px;
 display : inline-block;
 text-align : right;

`

const StyledTrack = styled.div`
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

    if (wasClicked || (!!wasOn == !!familyStore.currentBeat.sections.drums.tracks[trackNum].sequence[noteNumber])) {
      familyStore.toggleNoteOnCurrentBeat("drums", trackNum, noteNumber)
    }
  }

  handleSampleChange = (e) => {
    const { trackNum } = this.props
    familyStore.setSampleOnCurrentBeat("drums", trackNum, e.target.value)
  }

  renderSamplePreviewer = () => {
    const { track } = this.props
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

  componentDidMount() {
    this.samplePreviewer.volume = store.samples[this.props.track.sample].gain
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
              lastClickedNoteWasOn: familyStore.currentBeat.sections.drums.tracks[this.props.trackNum].sequence[i] > 0,
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
          <StyledLeftButtons>
            {this.renderSamplePreviewer()}
            <div style={trackNameStyles}>
              <DrumsetIcon
                height={25}
                width={35}
                style={{
                  verticalAlign: "middle",
                  filter: "brightness(0) invert(1)",
                  padding: "0 5px 0 5px",
                }}
              />
              <SamplePicker
                track = {track}
                handleSampleChange = {this.handleSampleChange}
              />
            </div>
          </StyledLeftButtons>
        </Column>

        {notes}

        <Column textLeft>
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
          <GainSlider
            sample    = {track.sample}
            synthType = {track.synthType}
            trackType = {"drums"}
          />
          <RemoveTrackButton
            className = "remove-track"
            title     = {"Delete track"}
            onClick   = {() => {familyStore.removeTrackFromCurrentBeat("drums", this.props.trackNum)}}
          ><MdDeleteForever/></RemoveTrackButton>
        </Column>
      </StyledTrack>
    )
  }
}


export default Track
