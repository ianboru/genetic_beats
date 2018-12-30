import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import {
  Sequencer,
  Song,
  Synth,
} from "../react-music"

import { MdDeleteForever } from "react-icons/md"

import store from "../store"
import familyStore from "../familyStore"
import playingStore from "../playingStore"
  
import Note from "./note"

import { allNotesInRange } from "../utils"

import Column from "../styledComponents/column"
import GainSlider from "./gainSlider"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const trackNameStyles = {
  display       : "inline-block",
  width         : 190,
  textAlign     : "center",
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
    const { handleEdit, trackNum } = this.props

    if(wasClicked){
      handleEdit(trackNum, noteNumber)
    }else if(!wasClicked && wasOn && familyStore.currentBeat.tracks[trackNum].sequence[noteNumber]){
      handleEdit(trackNum, noteNumber)
    }
    else if(!wasClicked && !wasOn && !familyStore.currentBeat.tracks[trackNum].sequence[noteNumber]){
      handleEdit(trackNum, noteNumber)
    }
  }

  handleRemoveTrack = () => {
    this.props.handleRemoveTrack(this.props.trackNum)
  }

  handleSampleChange = (e) => {
    this.props.handleSampleChange(this.props.trackNum, e.target.value)
  }

  renderSamplePreviewer = () => {
    if(this.props.track.trackType == "synth"){
      const synthType = this.props.track.synthType ? this.props.track.synthType : "sine"
      return(
          <span>
            <button
              style   = {{verticalAlign:"middle"}}
              onClick = {() => {playingStore.toggleTrackPreviewer(this.props.track.sample) }}
            >Play</button>
            <Song
              playing = {playingStore.trackPreviewers[this.props.track.sample]}
              tempo   = {store.tempo}
              ref     = {(c)=>{this.song=c}}
            >
              <Sequencer
                bars       = {1}
                resolution = {this.props.track.sequence.length}
              >
                <Synth
                  key   = {this.props.track.key + this.props.synthType + "synth"}
                  type  = {synthType }
                  steps = {[[0, 2, this.props.track.sample]]}
                  gain  = {store.synthGain[synthType]/store.synthGainCorrection[synthType]}
                />
              </Sequencer>
            </Song>
          </span>
      )
    } else {
      return (
        <span>
          <button
            style   = {{verticalAlign:"middle"}}
            onClick = {() => this.samplePreviewer.play()}
          >Play</button>
          <audio key={this.props.track.sample} ref={ref => this.samplePreviewer = ref}>
            <source src={store.samples[this.props.track.sample].path}/>
          </audio>
        </span>
      )
    }

  }
  componentDidMount(){
    if (this.props.track.trackType === "sampler") {
      this.samplePreviewer.volume = store.samples[this.props.track.sample].gain
    }
  }
  render() {
    const notes = this.props.track.sequence.map( (note, i) => {
      return (
        <Note
          key     = {`${i}.${note}`}
          value   = {note}
          onClick = {(e) => {
              this.setState({
                lastEntered : i,
                lastClickedNoteWasOn :  familyStore.currentBeat.tracks[this.props.trackNum].sequence[i] > 0,
              })
              this.handleNoteToggle(i,note,true)
          }}
          onMouseOver = {(e) => {
            if (e.buttons == 1 && this.state.lastEntered != i) {
              this.handleNoteToggle(i,this.state.lastClickedNoteWasOn,false)
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

    const trackNameParts = track.sample.split("/")
    const trackName = trackNameParts[trackNameParts.length - 1].split(".")[0]
    let activeSolo
    let activeMute
    activeMute = track.mute
    activeSolo = track.solo
    let sampleOptions = Object.keys(store.samples).map( (key) => {
      const sample = store.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {key}
        >{sample.name}</option>
      )
    })

    if (track.trackType === "synth") {
      sampleOptions = allNotesInRange.map( (noteName) => {
        const synthType = track.synthType ? track.synthType : "sine"
        const noteString = noteName + "-" + synthType
        return (
          <option
            key   = {noteName}
            value = {noteName}
          >{noteString}</option>
        )
      })
    }

    return (
      <StyledTrack>
        <Column>
          {this.renderSamplePreviewer()}
        </Column>

        <Column>
          <div style={trackNameStyles}>
            <select style={{fontSize:15, backgroundColor: 'lightgray'}} value={track.sample} onChange={this.handleSampleChange}>
              {sampleOptions}
            </select>
          </div>
        </Column>

        <Column>
          {notes}
        </Column>

        <Column>
          <MuteTrackButton
            active={activeMute}
            onClick={()=>{this.props.handleMuteTrack(track)}}
            title="Mute"
          >M</MuteTrackButton>

          <SoloTrackButton
            active={activeSolo}
            onClick={()=>{this.props.handleSoloTrack(track)}}
            title="Solo"
          >S</SoloTrackButton>
        </Column>

        <Column>
          <GainSlider sample={track.sample} trackType={track.trackType} synthType={track.synthType}/>
        </Column>

        <Column>
          <RemoveTrackButton
            className = "remove-track"
            title     = {"Delete track"}
            onClick   = {this.handleRemoveTrack}
          ><MdDeleteForever/></RemoveTrackButton>
        </Column>
      </StyledTrack>
    )
  }
}




export default Track
