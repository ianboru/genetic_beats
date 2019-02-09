import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import { reaction, toJS } from "mobx"

import Player from "./player"

import AddTrackButton from "./addTrackButton"
import Button from "./button"
import ConfigControl from "./configControl"
import Note from "./note"
import PlayControls from "./playControls"
import StarRating from "./starRating"
import TempoControls from "./tempoControls"
import Tooltip from "./tooltip"
import Track from "./track"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import BeatStore from "../stores/BeatStore"

import { colors } from "../colors"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"


const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0px auto 15px;
  overflow: visible;
  padding: 10px;
`

const BILabel = styled.span`
  font-size: ${props => props.size ? props.size : 20}px;
  color: #77777f;
  margin: 0 4px;
`

const BIData = styled.span`
  font-size: ${props => props.size ? props.size : 20}px;
  color: white;
  margin: 0 4px;
`

const TableRow = styled.div`
  display: table-row;
  width: 100%;
`

const HeaderTableRow = styled(TableRow)`
  > div {
    padding-bottom: 20px;
  }
`

const Controls = styled.div`
  background: ${colors.gray.light};
  display: inline-block;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #111;
  vertical-align: middle;
`


@observer
class Beat extends Component {
  state = {
    activeMuteAll : false,
    activeSoloAll : false,
  }

  constructor(props) {
    super(props)
    this.store = new BeatStore()
  }

  componentDidMount() {
    this.playReaction = reaction(() => this.store.playing, (playing) => this.store.resetNoteTimer(playing))
    if (this.store.playing) {
      this.store.resetNoteTimer(true)
    }
  }

  componentWillUnmount() {
    this.playReaction()
    this.store.resetNoteTimer(false)
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
    playingStore.toggleMuteAll(this.state.activeMuteAll)
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
    playingStore.toggleSoloAll(this.state.activeSoloAll)

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
    playingStore.handleMuteTrack(track)

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
    playingStore.handleSoloTrack(track)
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
          key                = {`${this.props.beat.key}.${i}`}
          trackNum           = {i}
          track              = {track}
          handleEdit         = {this.handleEdit}
          handleRemoveTrack  = {this.props.handleRemoveTrack}
          handleSampleChange = {this.handleSampleChange}
          handleMuteTrack    = {this.handleMuteTrack}
          handleSoloTrack    = {this.handleSoloTrack}
          activeNotes        = {this.store.activeNotes}
        />
      )
    })

    return (
      <StyledBeat>
        <Player
          beat       = {familyStore.currentBeat}
          playing    = {this.store.playing}
          resolution = {familyStore.currentBeatResolution}
        />
        <HeaderTableRow>
          <Column />
          <Column />

          <Column>
            <Controls>
              <PlayControls
                playing={this.store.playing}
                handleTogglePlaying = {this.store.togglePlaying}
              />
              <TempoControls />
            </Controls>

          </Column>
        </HeaderTableRow>

        <TableRow>
          <Column />
          <Column />

          <Column align="middle">
            <BILabel size={30}>Beat</BILabel>
            <BIData size={30}>{familyStore.beatNum}</BIData>
            &nbsp;
            &nbsp;
            <BILabel size={30}>Generation</BILabel>
            <BIData size={30}>{familyStore.generation}</BIData>
          </Column>

          <Column>
          </Column>
          <Column>
          </Column>
        </TableRow>

        <TableRow>
          <Column />

          <Column>
          </Column>

          <Column align="bottom">
            <StarRating
              score = {familyStore.currentBeat.score}
              handleSetScore = { (score) => {
                familyStore.setScore(score)
                playingStore.nextBeat()
              }}
            />
            <div style={{marginTop: -14, marginBottom: 10}}>
              <BILabel>Score</BILabel>
              <BIData>{this.props.beat.score}</BIData>
            </div>
          </Column>

          <Column>
          </Column>
          <Column>
          </Column>
        </TableRow>

        <TableRow>
          <Column />

          <Column>
          </Column>

          <Column />

          <Column align="bottom">
            <Tooltip
              position = "left"
              text     = "Mute All"
            >
              <MuteTrackButton
                active={this.state.activeMuteAll}
                onClick={()=>{this.handleMuteAll()}}
              >M</MuteTrackButton>
            </Tooltip>

            <Tooltip
              position = "right"
              text     = "Solo All"
            >
              <SoloTrackButton
                active={this.state.activeSoloAll}
                onClick={()=>{this.handleSoloAll()}}
              >S</SoloTrackButton>
            </Tooltip>
          </Column>

          <Column align="bottom">
            <span style={{ fontSize: 16}}>
              Volume
            </span>
          </Column>
        </TableRow>

        {tracks}

        <div style={{display:"table-row"}}>
          <Column />
          <Column />
          <Column style={{textAlign: "center"}}>
            <AddTrackButton />
          </Column>
        </div>
      </StyledBeat>
    )
  }
}


export default Beat
