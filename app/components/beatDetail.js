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
import beatViewStore from "../stores/beatViewStore"
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
  vertical-align: middle;
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

const StyledDot = styled.span`
  background: ${props => props.active ? (props.activeColor || "lightgreen") : "gray"};
  border-radius: 8px;
  display: inline-block;
  height: 12px;
  width: 12px;
  margin: 0 2px;
  vertical-align: 4px;
`

@observer
class DotRow extends Component {
  render() {
    const { activeNum } = this.props
    const activeColor = this.props.rowType === "generation" ? "orange" : "lightgreen"
    let dots = new Array(this.props.count).fill(0).map((_, i) => {
      return (
        <StyledDot
          key         = {i}
          active      = {activeNum === i}
          activecolor = {activeColor}
        />
      )
    })

    return (
      <span>
        {dots}
      </span>
    )
  }
}


@observer
class BeatDetail extends Component {
  state = {
    activeMuteAll : false,
    activeSoloAll : false,
  }

  constructor(props) {
    super(props)
    this.store = new BeatStore()
  }

  componentDidMount() {
    this.disablePlayReaction = reaction(() => beatViewStore.playing, (playing) => { if (!playing) { this.store.clearLitNote() }} )
  }

  componentWillUnmount() {
    this.disablePlayReaction()
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
    //console.log(familyStore.currentGeneration, familyStore.currentGeneration.length)
    const tracks = this.props.beat.tracks.map( (track, i) => {
      return (
        <Track
          key             = {`${this.props.beat.key}.${i}`}
          trackNum        = {i}
          track           = {track}
          handleMuteTrack = {this.handleMuteTrack}
          handleSoloTrack = {this.handleSoloTrack}
          activeNotes     = {this.store.activeNotes}
        />
      )
    })

    return (
      <StyledBeat>
        <Player
          beat       = {familyStore.currentBeat}
          playing    = {beatViewStore.playing}
          resolution = {familyStore.currentBeatResolution}
          setLitNote = {this.store.setLitNote}
        />
        <HeaderTableRow>
          <Column />
          <Column />

          <Column>
            <Controls>
              <PlayControls/>
              <TempoControls />
            </Controls>

          </Column>
        </HeaderTableRow>

        <TableRow>
          <Column />
          <Column />

          <Column align="middle">
            <div style={{display: "table"}}>
              <TableRow>
                <Column textRight={true}>
                  <BILabel size={16}>Generation</BILabel>
                  <BIData size={30}>{familyStore.generation}</BIData>
                </Column>
                <Column textLeft={true}>
                  <BIData size={30}>
                    <DotRow
                      count={familyStore.allGenerations.length}
                      rowType="generation"
                      activeNum={familyStore.generation}
                    />
                  </BIData>
                </Column>
              </TableRow>

              <TableRow>
                <Column textRight={true}>
                  <BILabel size={16}>Beat</BILabel>
                  <BIData size={30}>{familyStore.beatNum}</BIData>
                </Column>
                <Column textLeft={true}>
                  <BIData size={30}>
                    <DotRow
                      count={familyStore.currentGeneration.length}
                      rowType="beat"
                      activeNum={familyStore.beatNum}
                    />
                  </BIData>
                </Column>
              </TableRow>

              <TableRow>
                <Column textRight={true}>
                  <div style={{display: "inline-block"}}>
                    <BILabel size={16}>Score</BILabel>
                    <BIData size={30}>{this.props.beat.score}</BIData>
                  </div>
                </Column>
                <Column textLeft={true}>
                  <StarRating
                    score = {familyStore.currentBeat.score}
                    handleSetScore = { (score) => {
                      familyStore.setScore(score)
                    }}
                  />
                </Column>
              </TableRow>
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

          <Column>
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


export default BeatDetail
