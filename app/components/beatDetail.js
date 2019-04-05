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
  color: #77777f;
  font-size: ${props => props.size ? props.size : 20}px;
  line-height: 120%;
  margin: 0 4px;
`

const BIData = styled.span`
  color: white;
  font-size: ${props => props.size ? props.size : 20}px;
  line-height: 120%;
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
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #111;
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  vertical-align: middle;
`

const hoverGreen = `${chroma("#90EE90").alpha(0.70).rgba()}`

const StyledDot = styled.span`
  background: ${props => props.active ? (props.activeColor || "lightgreen") : "gray"};
  border-radius: 8px;
  cursor: pointer;
  display: inline-block;
  height: 14px;
  width: 14px;
  margin: 0 2px;
  vertical-align: 4px;
  transition: 0.2s background;
  &:hover {
    background: ${props => props.active ? (props.activeColor || hoverGreen) : "gray"};
    background: rgba(${hoverGreen});
  }
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
          onClick     = {() => { this.props.handleClickDot(i) }}
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
    console.log(track.mute)
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
                  <BILabel size={16}>generation</BILabel>
                  <BIData size={30}>{familyStore.generation}</BIData>
                </Column>
                <Column textLeft={true}>
                  <BIData size={30}>
                    <DotRow
                      count={familyStore.allGenerations.length}
                      rowType="generation"
                      activeNum={familyStore.generation}
                      handleClickDot={(index) => {
                        familyStore.setBeatNum(0)
                        familyStore.setGeneration(index)
                      }}
                    />
                  </BIData>
                </Column>
              </TableRow>

              <TableRow>
                <Column textRight={true}>
                  <BILabel size={16}>beat</BILabel>
                  <BIData size={30}>{familyStore.beatNum}</BIData>
                </Column>
                <Column textLeft={true}>
                  <BIData size={30}>
                    <DotRow
                      count={familyStore.currentGeneration.length}
                      rowType="beat"
                      activeNum={familyStore.beatNum}
                      handleClickDot={(index) => {
                        familyStore.setBeatNum(index)
                      }}
                    />
                  </BIData>
                </Column>
              </TableRow>

              <TableRow>
                <Column textRight={true}>
                  <BILabel size={16}>score</BILabel>
                  <BIData size={30}>{this.props.beat.score}</BIData>
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
