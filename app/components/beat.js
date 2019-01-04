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
  margin: 0px auto 15px;
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

const TableRow = styled.div`
  display: table-row;
  width: 100%;
`


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
          beat       = {familyStore.currentBeat}
          playing    = {playingStore.playingCurrentBeat && familyStore.currentBeat.key == this.props.beat.key}
          resolution = {familyStore.currentBeatResolution}
        />
        <TableRow>
          <Column />

          <Column>
            <TempoControls />
          </Column>

          <Column>
            <PlayControls />
          </Column>
        </TableRow>

        <TableRow>
          <Column />

          <Column>
            <div>
              <BeatInfo>
                <BILabel>Beat</BILabel>
                <BIData>{this.props.beat.key}</BIData>
              </BeatInfo>
            </div>
          </Column>

          <Column>
            <StarRating
              score = {familyStore.currentBeat.score}
              handleSetScore = { (score) => {
                familyStore.setScore(score)
                playingStore.nextBeat()
              }}
            />
            <br />
            <div>
              <BILabel>Score</BILabel>
              <BIData>{this.props.beat.score}</BIData>
            </div>
          </Column>

          <Column align="bottom">
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
        </TableRow>

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
