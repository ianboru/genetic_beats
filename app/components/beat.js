import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import { toJS } from "mobx"
import {
  Song,
  Sequencer,
  Sampler,
  Synth,
} from "../react-music"

import {
  MdAdd,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
} from "react-icons/md"
import Player from "./player"

import Button from "./button"
import ConfigControl from "./configControl"

import {allNotesInRange} from "../utils"

import store from "../store"
import { colors } from "../colors"


const StyledTempoControl = styled.div`
  display: inline-block;

  input[type="number"] {
    width: 45px;
    font-size: 16px;
  }
`

@observer
class TempoControl extends Component {
  render() {
    return (
      <StyledTempoControl>
        <BILabel>Tempo</BILabel>

        <input
          type     = "number"
          value    = {store.tempo}
          min      = {40}
          max      = {200}
          onChange = { e => store.setTempo(parseInt(e.target.value)) }
        />
      </StyledTempoControl>
    )
  }
}


const Column = styled.div`
  display: table-cell;
  text-align: ${props => props.textLeft ? "left" : "center"};
  width: ${props => props.width ? props.width + "px" : "auto" };
`

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
        style    = {{ verticalAlign: "middle", width: 80 }}
        type     = "range"
        min      = {0}
        max      = {100}
        value    = {gain}
        onChange = {this.handleGainChange}
      />
    )
  }
}


const NoteWrapper = styled.div`
  border-right: ${props => props.separator ? "1px solid white" : "0"};
  display: inline-block;

  &:last-child {
    border-right: 0;
  }
`


const StyledNote = styled.div`
  background-color: ${props => props.active ? "pink" : props.on ? "red" : "gray" };
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  height: 20px;
  margin: 0 5px;
  font-size: 15px;
  width: 20px;

  &:hover {
    background-color: ${props => props.active ? "lightpink" : props.on ? "#FF6666" : "darkgray" };
  }
`


@observer
class Note extends Component {
  render() {
    const active = this.props.index == store.currentLitNote && store.playingCurrentBeat
    const separator = this.props.index % 4 === 3

    return (
      <NoteWrapper separator={separator}>
        <StyledNote
          on          = {this.props.value === 1}
          active      = {active}
          onMouseDown = {this.props.onClick}
          onMouseOver = {this.props.onMouseOver}
          className   = "note"
        >&nbsp;</StyledNote>
      </NoteWrapper>
    )
  }
}

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

const MuteTrackButton = styled.span`
  background-color: ${props => props.active ? "orange" : "gray" };
  border-radius: 2px;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  height: 20px;
  margin: 3px;
  margin-left: 10px;
  width: 20px;

  &:hover {
    background-color: orange;
  }
`

const SoloTrackButton = styled.span`
  background-color: ${props => props.active ? "green" : "gray" };
  border-radius: 2px;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  height: 20px;
  margin: 3px;
  width: 20px;

  &:hover {
    background-color: green;
  }
`

const StyledTrack = styled.div`
  display: table-row;
`


@observer
class Track extends Component {
  state = {
    lastEntered : -1
  }

  handleNoteToggle = (noteNumber, wasOn, wasClicked) => {
    const { handleEdit, trackNum } = this.props

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
    if(this.props.track.trackType == "synth"){
      return(
          <span>
            <button
              style   = {{verticalAlign:"middle"}}
              onClick = {() => {store.toggleTrackPreviewer(this.props.track.sample) }}
            >Play</button>
            <Song
              playing = {store.trackPreviewers[this.props.track.sample]}
              tempo   = {store.tempo}
              ref     = {(c)=>{this.song=c}}
            >
              <Sequencer
                bars       = {1}
                resolution = {this.props.track.sequence.length}
              >
                <Synth
                  key   = {this.props.track.key + "synth"}
                  type  = {"square"}
                  steps = {[[0, 2, this.props.track.sample]]}
                  gain  = {store.synthGain/store.synthGainCorrection}
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
        return (
          <option
            key   = {noteName}
            value = {noteName}
          >{noteName}</option>
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
          <GainSlider sample={track.sample} trackType={track.trackType} />
        </Column>

        <Column>
          <RemoveTrackButton
            className = "remove-track"
            title     = {"Delete track}"}
            onClick   = {this.handleRemoveTrack}
          >&times;</RemoveTrackButton>
        </Column>
      </StyledTrack>
    )
  }
}


const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0px auto 15px;
  border: 2px solid #ccc;
  padding: 10px;
`

const BeatInfo = styled.span`
  margin: 0 10px;
`

const BILabel = styled.span`
  color: #77777f;
  margin: 4px;
`

const BIData = styled.span`
  color: white;
  margin: 4px;
`

const StyledPlayControls = styled.div`
  display: inline-block;
  vertical-align: middle;

  svg {
    display: inline-block;
    transition: 0.2s color;
    vertical-align: middle;
  }

  svg:hover {
    cursor: pointer;
    color: lightgreen;
  }
`

const ControlPanel = styled.div`
  display: table-row;
  width: 100%;
`

@observer
class PlayControls extends Component {
  static defaultProps = {
    size: 40,
  }

  render() {
    const {
      size,
    } = this.props

    const PlayStopButton = store.playingCurrentBeat ? MdStop : MdPlayArrow

    return (
      <StyledPlayControls>
        <span title="Previous Beat">
          <MdSkipPrevious
            size    = {size}
            onClick = {store.prevBeat}
          />
        </span>
        <span title="Play / Stop">
          <PlayStopButton
            size    = {size}
            onClick = {store.togglePlayCurrentBeat}
          />
        </span>
        <span title="Next Beat">
          <MdSkipNext
            size    = {size}
            onClick = {store.nextBeat}
          />
        </span>
      </StyledPlayControls>
    )
  }
}


const StyledAddTrackButton = styled.div`
  background: ${colors.gray.darkest};
  border-radius: 3px;
  border: 1px solid #777;
  cursor: pointer;
  font-size: 18px;
  margin-top: 6px;
  padding: 2px 0;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: #444;
  }

  &:active {
    background: #333;
  }
`


@observer
class AddTrackButton extends Component {
  state = {
    showTrackTypes: false,
  }

  handleAddTrack = (trackType) => {
    const steps = this.props.beat.tracks[0].sequence.length
    let sample

    if (trackType === "sampler") {
      const beatSamples = this.props.beat.tracks.map( (track) => { return track.sample } )
      const unusedSamples = Object.keys(store.samples).filter( (key) => {
        const sample = store.samples[key]
        return !beatSamples.includes(sample.path)
      })

      sample = unusedSamples[0]
    } else if (trackType === "synth") {
      sample = allNotesInRange[0]
    }

    const sequence = Array(steps).fill(0)
    store.addTrackToCurrentBeat({sample, sequence, trackType})
  }

  handleAddSamplerTrack = () => {
    this.handleAddTrack("sampler")
    this.toggleShowTrackTypes()
  }

  handleAddSynthTrack = () => {
    this.handleAddTrack("synth")
    this.toggleShowTrackTypes()
  }

  toggleShowTrackTypes = () => {
    this.setState({ showTrackTypes: !this.state.showTrackTypes})
  }

  renderTrackTypes = () => {
    return (
      <div>
        <Button small onClick={this.handleAddSamplerTrack}>Add Sampler</Button>
        <Button small onClick={this.handleAddSynthTrack}>Add Synth</Button>
      </div>
    )
  }

  renderAddInstrument = () => {
    return (
      <StyledAddTrackButton onClick={this.toggleShowTrackTypes}>
        Add Instrument
      </StyledAddTrackButton>
    )
  }

  render() {
    if (this.state.showTrackTypes) {
      return this.renderTrackTypes()
    } else {
      return this.renderAddInstrument()
    }
  }
}


const AddToArrangementButton = styled.button`
  position: absolute;
  background: ${colors.yellow.dark};
  border: 2px solid white;
  color: white;
  bottom: -10px;
  left: -10px;
  font-size: 35px;
  font-weight: bold;
  border-radius: 100%;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: ${colors.yellow.darker};
  }
`


@observer
class Beat extends Component {
  state = {
    mousedown : false,
    activeMuteAll : false,
    activeSoloAll : false,
  }

  handleEdit = (track, note) => {
    let { beat } = this.props
    this.props.handleToggleNote(track, note)
    console.log(toJS(beat))
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

    this.setState({
      activeSoloAll : !this.state.activeSoloAll
    },()=>{
      if(this.state.activeSoloAll){
        this.setState({
          activeMuteAll : false
        })
      }
    })
  }

  handleMuteTrack = (track) => {
    store.handleMuteTrack(track)

    if(!track.mute){
      this.setState({
        activeMuteAll : false
      })
    }
    let numMutedSamples = 0
    let numSamples = 0
    let numSynth = 0
    this.props.beat.tracks.forEach((track)=>{
      if(track.mute){
        ++numMutedSamples
      }
      ++numSamples
    })

    if(numMutedSamples == numSamples){
      this.setState({
        activeMuteAll : true
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
    let numSoloSamples = 0
    let numSamples = 0
    let numSynth = 0
    this.props.beat.tracks.forEach((track)=>{
      if(track.solo){
        ++numSoloSamples
      }
      ++numSamples
    })

    if(numSoloSamples == numSamples){
      this.setState({
        activeSoloAll : true
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
        {store.showCreateArrangement ?
            <AddToArrangementButton
              title="Add to Arrangement"
              onClick={() => store.addBeatToArrangement(this.props.beat.key)}
            ><MdAdd size={25} /></AddToArrangementButton> : null}
        <Player
          beat       = {store.currentBeat}
          playing    = {store.playingCurrentBeat && store.currentBeat.key == this.props.beat.key}
          resolution = {store.currentBeatResolution}
        />
        <ControlPanel>
          <Column>
            <Button
              small
              active  = {store.metronome}
              onClick = {store.toggleMetronome}
            >
              Metronome
            </Button>
          </Column>

          <Column>
            <PlayControls />
          </Column>

          <Column textLeft>
            <TempoControl />

            <BeatInfo>
              <BILabel>Beat</BILabel>
              <BIData>{this.props.beat.key}</BIData>
            </BeatInfo>

            <BeatInfo>
              <BILabel>Score</BILabel>
              <BIData>{this.props.beat.score}</BIData>
            </BeatInfo>
          </Column>

          <Column>
            <MuteTrackButton
              active={this.state.activeMuteAll}
              onClick={()=>{this.handleMuteAll()}}
              title="Mute All"
            >M</MuteTrackButton>

            <SoloTrackButton
              active={this.state.activeSoloAll}
              onClick={()=>{this.handleSoloAll()}}
              title="Solo All"
            >S</SoloTrackButton>
          </Column>

          <Column>
            <span style={{ fontSize: 16}}>
              Volume
            </span>
          </Column>
        </ControlPanel>

        {tracks}

        <div style={{display:"table-row"}}>
          <Column />
          <Column />
          <Column />
        </div>
        <div style={{display:"table-row"}}>
          <Column />
          <Column />
          <Column style={{textAlign: "center"}}>
            <AddTrackButton beat={this.props.beat} />
          </Column>
        </div>
      </StyledBeat>
    )
  }
}


export default Beat
