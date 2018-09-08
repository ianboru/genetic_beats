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


const StyledNote = styled.div`
  background-color: ${props => props.active ? "pink" : props.on ? "red" : "gray" };
  cursor: pointer;
  margin: 3px;
  height: 20px;
  width: 20px;
  display: inline-block;
  border-radius: 2px;

  &:hover {
    background-color: ${props => props.active ? "lightpink" : props.on ? "#FF6666" : "darkgray" };
  }
`


@observer
class Note extends Component {
  render() {
    const active = this.props.index == store.currentLitNote && store.playingCurrentBeat

    return (
      <StyledNote
        on          = {this.props.value === 1}
        active      = {active}
        onMouseDown = {this.props.onClick}
        onMouseOver = {this.props.onMouseOver}
        className   = "note"
      ></StyledNote>
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

const MuteTrackButton = styled.span`
  cursor: pointer;
  margin: 3px;
  height: 20px;
  width: 20px;
  color: black;
  display: inline-block;
  border-radius: 2px;
  background-color: ${props => props.active ? "orange" : "gray" };
  vertical-align: top;

`

const SoloTrackButton = styled.span`
  cursor: pointer;
  margin: 3px;
  height: 20px;
  width: 20px;
  color: black;
  display: inline-block;
  border-radius: 2px;
  background-color: ${props => props.active ? "green" : "gray" };
  vertical-align: top;

`

@observer
class Track extends Component {
  state = {
    lastEntered : -1
  }
  handleNoteToggle = (noteNumber, wasOn, wasClicked) => {
    const { handleEdit, trackNum } = this.props
    console.log(
      store.currentBeat.tracks[trackNum].sequence[noteNumber],
      wasClicked,
      wasOn
      )
    if(wasClicked){
      handleEdit(trackNum, noteNumber)
    }else if(!wasClicked && wasOn && store.currentBeat.tracks[trackNum].sequence[noteNumber]){
      handleEdit(trackNum, noteNumber)
    }
    else if(!wasClicked && !wasOn && !store.currentBeat.tracks[trackNum].sequence[noteNumber]){
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
    return (
      <span>
        <button style={{verticalAlign:"top"}} onClick={() => this.samplePreviewer.play()}>Play</button>
        <audio ref={ref => this.samplePreviewer = ref}>
          <source src={store.samples[this.props.track.sample].path}/>
        </audio>
      </span>
    )
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
                lastClickedNoteWasOn :  store.currentBeat.tracks[this.props.trackNum].sequence[i] > 0,
              })
              this.handleNoteToggle(i,note,true)

          }}
          onMouseOver = {(e) => {
            if(e.buttons == 1 && this.state.lastEntered != i){

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
    if(track.trackType == "sampler"){
      activeMute = track.mute
      activeSolo = track.solo
    }else{
      activeMute = store.synthMute
      activeSolo = store.synthSolo
    }
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
        {track.trackType === "sampler" ? this.renderSamplePreviewer() : null}

        <div style={trackNameStyles}>
          <select style={{fontSize:15, backgroundColor: 'lightgray'}} value={track.sample} onChange={this.handleSampleChange}>
            {sampleOptions}
          </select>
        </div>
        {notes}
        <MuteTrackButton
          active={activeMute}
          onClick={()=>{this.props.handleMuteTrack(track)}}
        >M</MuteTrackButton>
        <SoloTrackButton
          active={activeSolo}
          onClick={()=>{this.props.handleSoloTrack(track)}}
        >S</SoloTrackButton>

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

const BeatInfo = styled.span`
  margin: 10px;
`

const BILabel = styled.span`
  color: #77777f;
  margin: 4px;
`

const BIData = styled.span`
  color: white;
  margin: 4px;
`


@observer
class Beat extends Component {
  state = {
    trackType : "sampler",
    mousedown : false,
    activeMuteAll : false,
    activeSoloAll : false,
  }
  toggleTrackType = () => {
    let newTrackType
    if (this.state.trackType === "sampler") {
      newTrackType = "synth"
    } else {
      newTrackType = "sampler"
    }
    this.setState({trackType : newTrackType })
  }
  handleAddTrack = () => {
    const steps = this.props.beat.tracks[0].sequence.length
    let sample

    if (this.state.trackType === "sampler") {
      const beat = store.newBeat
      const beatSamples = this.props.beat.tracks.map( (track) => { return track.sample } )
      const unusedSamples = Object.keys(store.samples).filter( (key) => {
        const sample = store.samples[key]
        return !beatSamples.includes(sample.path)
      })

      sample = unusedSamples[0]
    } else if (this.state.trackType === "synth") {
      sample = allNotesInRange[0]
    }

    const sequence = Array(steps).fill(0)
    const trackType = this.state.trackType
    store.addTrackToCurrentBeat({sample, sequence, trackType})
  }

  handleEdit = (track, note) => {
    let { beat } = this.props
    this.props.handleToggleNote(track, note)
  }

  handleSampleChange = (track, sample) => {
    let { beat } = this.props
    this.props.handleSetSample(track, sample)
  }
  handleMuteAll = () => {
    store.toggleMuteAll(this.state.activeMuteAll)
    this.setState({
      activeMuteAll : !this.state.activeMuteAll
    },()=>{
      if(this.state.activeMuteAll){
        this.setState({
          activeSoloAll : false
        })
      }
    })
    
  }
  handleSoloAll = () => {
    store.toggleSoloAll(this.state.activeSoloAll)
    console.log("soling all", this.state.activeSoloAll)

    this.setState({
      activeSoloAll : !this.state.activeSoloAll
    },()=>{
      if(this.state.activeSoloAll){
        this.setState({
          activeMuteAll : false
        })
        console.log("muting all", this.state.activeMuteAll)

      }
    })
  }
  handleMuteTrack = (track) => {
    console.log("muting " , toJS(track))
    store.handleMuteTrack(track)
    console.log("all? " , toJS(track))

    if(!track.mute){
      this.setState({
        activeMuteAll : false
      })
    }
  }
  handleSoloTrack = (track) => {
    store.handleSoloTrack(track)
    if(!track.solo){
      this.setState({
        activeSoloAll : false
      })
    }
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
          handleMuteTrack = {this.handleMuteTrack}
          handleSoloTrack = {this.handleSoloTrack}
        />
      )
    })

    return (
      <StyledBeat>
        <div>
          <BeatInfo>
            <BILabel>Beat</BILabel>
            <BIData>{this.props.beat.key}</BIData>
          </BeatInfo>

          <BeatInfo>
            <BILabel>Score</BILabel>
            <BIData>{this.props.beat.score}</BIData>
          </BeatInfo>
        </div>
        <MuteTrackButton
          active={this.state.activeMuteAll}
          onClick={()=>{this.handleMuteAll()}}
        >M</MuteTrackButton>
        <SoloTrackButton
          active={this.state.activeSoloAll}
          onClick={()=>{this.handleSoloAll()}}
        >S</SoloTrackButton>
        {tracks}

        <div>
          <Button small onClick={() => store.addBeatToArrangement(this.props.beat.key)}>
            Add beat to arrangement
          </Button>
          <Button small onClick={this.handleAddTrack}>+ Add {this.state.trackType} track</Button>
          <Button small onClick={this.toggleTrackType}>Toggle track type</Button>
        </div>
      </StyledBeat>
    )
  }
}


export default Beat
