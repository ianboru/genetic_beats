import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import { reaction, toJS } from "mobx"

import Player from "./player"

import Button from "./button"
import ConfigControl from "./configControl"
import Note from "./note"
import PlayControls from "./playControls"
import StarRating from "./starRating"
import TempoControls from "./tempoControls"
import Tooltip from "./tooltip"
import Track from "./track"
import SynthTrack from "./synthTrack"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import beatViewStore from "../stores/beatViewStore"
import BeatStore from "../stores/BeatStore"

import templateBeats from "../templateBeats"
import { colors } from "../colors"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import SoloTrackButton from "../styledComponents/soloTrackButton"
import { mutateMelody, mutateSampler } from "../mutate"
import {SCALES, synthTypes } from "../utils"

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
  display: inline-block;
  //width: 100%;
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

const StyledSectionWrapper = styled.div`
  text-align: center;
`

const StyledSection = styled.div`
  display: inline-block;
  padding: 15px;
  background-color: ${chroma("rgb(41, 43, 48)").darken(0.5)};
  border: 2px solid rgb(41, 43, 48);
  border-radius: 4px;
  box-shadow: 0 0 4px 1px black;
  margin-top: 30px;
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
  handleMutateMelody = () => {
    const newBeat = mutateMelody(familyStore.currentBeat)
    const newBeatId = familyStore.newBeat(newBeat)
    familyStore.incrementNumMutations()
  }

  handleMutateSampler = () => {
    const newBeat = mutateSampler(familyStore.currentBeat)
    const newBeatID = familyStore.newBeat(newBeat)
    familyStore.incrementNumMutations()
  }

  handleKillLastBeat = () => {
    familyStore.removeLastBeatFromCurrentGen()
  }

  handleNewRandomBeat = () => {
    const chosenBeat = Math.floor(Math.random() * templateBeats.length)

    familyStore.replaceFirstBeat(templateBeats[chosenBeat])
    console.log("replace" , toJS(familyStore.currentBeat))
  }

  renderSynthTracks = (synthTracks) => {
    return synthTracks.map( (track, i) => {
      const note = track.sample

      if (!track) {
        track = {
          "sample": note,
          "sequence": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "trackType": "synth",
          "synthType": "triangle"
        }
      }

      return (
        <SynthTrack
          key             = {`${note}.${i}`}
          trackNum        = {i}
          track           = {track}
          handleMuteTrack = {this.handleMuteTrack}
          handleSoloTrack = {this.handleSoloTrack}
          activeNotes     = {this.store.activeNotes}
        />
      )
    })
  }
  handleSelectScale = (evt) => {
    familyStore.setScale(evt.target.value)
  }
  handleSelectSynthType= (evt) => {
    familyStore.setSynthType(evt.target.value)
  }
  render() {
    const synthTracks = this.props.beat.tracks.filter( (track) => (track.trackType === "synth") )
    const samplerTracks = this.props.beat.tracks.reduce( (filtered, track, i) => {
      if (track.trackType === "sampler") {
        return [
            ...filtered,
            <Track
              key             = {`${this.props.beat.key}.${i}`}
              trackNum        = {i}
              track           = {track}
              handleMuteTrack = {this.handleMuteTrack}
              handleSoloTrack = {this.handleSoloTrack}
              activeNotes     = {this.store.activeNotes}
            />
        ]
      }
      return filtered
    }, [])

    let scaleOptions = []
    Object.keys(SCALES).forEach((scale,index) => {
      scaleOptions.push(
        <option key={index} value={scale}>
          {scale}
        </option>
      )
    })

    const scaleSelect =
      <select
          style={{fontSize : "20px"}}
          onChange={this.handleSelectScale}
          value={familyStore.currentBeat.scale}
        >
          {scaleOptions}
      </select>

    let synthTypeOptions = []
    synthTypes.forEach((type,index) => {
      synthTypeOptions.push(
        <option key={index} value={type}>
          {type}
        </option>
      )
    })

    const synthTypeSelect =
      <select
          style={{fontSize : "20px"}}
          onChange={this.handleSelectSynthType}
          value={synthTracks[0].synthType}
        >
          {synthTypeOptions}
      </select>

    return (
      <StyledBeat>
        <Player
          beat       = {familyStore.currentBeat}
          playing    = {beatViewStore.playing}
          resolution = {familyStore.currentBeatResolution}
          setLitNote = {this.store.setLitNote}
        />

        <div style={{textAlign: "center"}}>
          <Controls>
            <PlayControls/>
            <TempoControls />
          </Controls>
        </div>
        <div style={{textAlign: "center"}}>
          {
            familyStore.currentGeneration.length > 1 ?
            <Button width={150} color={["red"]} onClick={this.handleKillLastBeat}>Kill Last Beat</Button> :
            <Button width={150} color={["green"]} onClick={this.handleNewRandomBeat}>New Random Beat</Button>
          }
        </div>

        <StyledSectionWrapper>
          <StyledSection>
           <MuteTrackButton
              onClick={playingStore.toggleMuteSynth}
              active={playingStore.muteSynth}
            >M</MuteTrackButton>
            <div>
              <span style={{ display: "inline-block",width: "150px"}}>Waveform :</span>{synthTypeSelect}
            </div>
            <div>
              <span style={{ display: "inline-block",width: "150px"}}>Scale :</span>{scaleSelect}
            </div>

            <div style={{ marginBottom: 20, marginTop: 10 }}>
              <StarRating
                score = {familyStore.currentBeat.synthScore}
                handleSetScore = { (score) => {
                  familyStore.setSynthScore(score)
                }}
              />
              <Button width={150} onClick={this.handleMutateMelody}>Mutate Keyboard</Button>
            </div>
            {this.renderSynthTracks(synthTracks)}
          </StyledSection>
        </StyledSectionWrapper>

        <StyledSectionWrapper>
          <StyledSection>
            <MuteTrackButton
              onClick={playingStore.toggleMuteSampler}
              active={playingStore.muteSampler}
            >M</MuteTrackButton>
            <div style={{ marginBottom: 20, marginTop: 10 }}>
              <StarRating
                score = {familyStore.currentBeat.samplerScore}
                handleSetScore = { (score) => {
                  familyStore.setSamplerScore(score)
                }}
              />
              <Button width={150} onClick={this.handleMutateSampler}>Mutate Drums</Button>
            </div>

            {samplerTracks}
          </StyledSection>
        </StyledSectionWrapper>

        <div style={{display:"table-row"}}>
          <Column />
          <Column />
          <Column style={{textAlign: "center"}}>
          </Column>
        </div>
      </StyledBeat>
    )
  }
}


export default BeatDetail
