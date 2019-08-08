import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import {reaction} from "mobx"

import Player from "./player"

import Button from "./button"
import PlayControls from "./playControls"
import ChangeSlider from "./changeSlider"
import TempoControls from "./tempoControls"
import SamplerTrack from "./samplerTrack"
import SynthTrack from "./synthTrack"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import BeatStore from "../stores/BeatStore"

import templateBeats from "../templateBeats"
import {colors} from "../colors"

import Column from "../styledComponents/column"
import MuteTrackButton from "../styledComponents/muteTrackButton"
import {mutateMelody, mutateSampler} from "../mutate"
import {SCALES, synthTypes, BEAT_RESOLUTION, BEAT_LENGTH} from "../utils"

const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0px auto 15px;
  overflow: visible;
  padding: 10px;
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

const StyledSectionWrapper = styled.div`
  text-align: center;
`

const SectionHeader = styled.h3`
  color: #e6e983;
  font-size: 22px;
  font-weight: lighter;
  position: absolute;
  left: 20px;
  top: 10px;
  margin: 0;
  text-align: left;
  text-transform: uppercase;
`

const StyledSection = styled.div`
  display: inline-block;
  padding: 15px;
  background-color: ${chroma("rgb(41, 43, 48)").darken(0.5)};
  border: 2px solid rgb(41, 43, 48);
  border-radius: 4px;
  box-shadow: 0 0 4px 1px black;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
`

@observer
class BeatDetail extends Component {
  store = new BeatStore()

  componentDidMount() {
    this.disablePlayReaction = reaction(
      () => playingStore.player,
      (player) => {
        if (!player) {
          this.store.clearLitNote()
        }
      },
    )
  }

  componentWillUnmount() {
    this.disablePlayReaction()
  }

  handleMutateMelody = () => {
    const newBeat = mutateMelody(familyStore.currentBeat)
    familyStore.newBeatAfterCurrentBeat(newBeat)
  }

  handleMutateSampler = () => {
    const newBeat = mutateSampler(familyStore.currentBeat)
    familyStore.newBeatAfterCurrentBeat(newBeat)
  }

  handleMutateAllSections = () => {
    let newBeat = mutateMelody(familyStore.currentBeat)
    newBeat = mutateSampler(newBeat)
    familyStore.newBeatAfterCurrentBeat(newBeat)
  }

  handleKillLastBeat = () => {
    familyStore.removeLastBeatFromLineage()
  }

  handleNewRandomBeat = () => {
    const chosenBeat = Math.floor(Math.random() * templateBeats.length)
    familyStore.replaceFirstBeat(templateBeats[chosenBeat])
  }

  renderSamplerTracks = (samplerTracks) => {
    return samplerTracks.map((track, i) => {
      return (
        <SamplerTrack
          key={`${this.props.beat.key}.${i}`}
          trackNum={i}
          track={track}
          handleMuteTrack={playingStore.handleMuteTrack}
          handleSoloTrack={playingStore.handleSoloTrack}
          activeNotes={this.store.activeNotes}
        />
      )
    })
  }

  renderSynthTracks = (synthTracks) => {
    return synthTracks.map((track, i) => {
      const note = track.sample

      if (!track) {
        track = {
          sample: note,
          sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          synthType: "triangle",
        }
      }

      return (
        <SynthTrack
          key={`${note}.${i}`}
          trackNum={i}
          track={track}
          handleMuteTrack={playingStore.handleMuteTrack}
          handleSoloTrack={playingStore.handleSoloTrack}
          activeNotes={this.store.activeNotes}
        />
      )
    })
  }

  handleSelectScale = (evt) => {
    familyStore.setScale(evt.target.value)
  }

  handleSelectSynthType = (evt) => {
    familyStore.setSynthType(evt.target.value)
  }

  render() {
    const synthTracks = this.props.beat.sections.keyboard.tracks
    const samplerTracks = this.props.beat.sections.drums.tracks

    const scaleOptions = []
    Object.keys(SCALES).forEach((scale, index) => {
      scaleOptions.push(
        <option key={index} value={scale}>
          {scale}
        </option>,
      )
    })

    const scaleSelect = (
      <select
        style={{fontSize: "20px"}}
        onChange={this.handleSelectScale}
        value={familyStore.currentBeat.scale}
      >
        {scaleOptions}
      </select>
    )

    const synthTypeOptions = []
    synthTypes.forEach((type, index) => {
      synthTypeOptions.push(
        <option key={index} value={type}>
          {type}
        </option>,
      )
    })

    const synthTypeSelect = (
      <select
        style={{fontSize: "20px"}}
        onChange={this.handleSelectSynthType}
        value={synthTracks[0].synthType}
      >
        {synthTypeOptions}
      </select>
    )

    return (
      <StyledBeat>
        <Player
          beat={familyStore.currentBeat}
          playing={playingStore.player === playingStore.players.BEAT_DETAIL}
          length={BEAT_LENGTH}
          resolution={BEAT_RESOLUTION}
          setLitNote={this.store.setLitNote}
        />

        <div style={{textAlign: "center"}}>
          <Controls>
            <PlayControls />
            <TempoControls />
          </Controls>
        </div>
        <div style={{textAlign: "center"}}>
          {familyStore.lineage.length > 1 ? (
            <Button
              width={150}
              color={["red"]}
              onClick={this.handleKillLastBeat}
            >
              Kill Last Beat
            </Button>
          ) : (
            <Button
              width={150}
              color={[colors.blue.base]}
              onClick={this.handleNewRandomBeat}
            >
              New Random Beat
            </Button>
          )}
          <Button width={150} onClick={this.handleMutateAllSections}>
            Mutate Both Sections
          </Button>
        </div>

        <StyledSectionWrapper>
          <StyledSection>
            <SectionHeader>Keyboard</SectionHeader>
            <MuteTrackButton
              onClick={playingStore.toggleMuteSynth}
              active={playingStore.muteSynth}
            >
              M
            </MuteTrackButton>
            <div style={{width: "250px", margin: "0 auto", textAlign: "left"}}>
              <span style={{display: "inline-block", width: "150px"}}>
                Monosynth
              </span>
              <input
                style={{fontSize: "15px"}}
                type="checkbox"
                onChange={familyStore.toggleMonosynth}
                checked={familyStore.currentBeat.sections.keyboard.monosynth}
              />
            </div>
            <div style={{width: "250px", margin: "0 auto", textAlign: "left"}}>
              <span style={{display: "inline-block", width: "150px"}}>
                Waveform{" "}
              </span>
              {synthTypeSelect}
            </div>
            <div style={{width: "250px", margin: "0 auto", textAlign: "left"}}>
              <span style={{display: "inline-block", width: "150px"}}>
                Scale{" "}
              </span>
              {scaleSelect}
            </div>

            <div style={{marginBottom: 20, marginTop: 10}}>
              <ChangeSlider
                score={familyStore.currentBeat.synthScore}
                handleSetScore={(score) => {
                  familyStore.setSynthScore(score)
                }}
              />
              <Button
                style={{marginLeft: "10px"}}
                width={150}
                onClick={this.handleMutateMelody}
              >
                Mutate Keyboard
              </Button>
            </div>
            {this.renderSynthTracks(synthTracks)}
          </StyledSection>
        </StyledSectionWrapper>

        <StyledSectionWrapper>
          <StyledSection>
            <SectionHeader>Drums</SectionHeader>
            <MuteTrackButton
              onClick={playingStore.toggleMuteSampler}
              active={playingStore.muteSampler}
            >
              M
            </MuteTrackButton>
            <div style={{marginBottom: 20, marginTop: 10}}>
              <ChangeSlider
                score={familyStore.currentBeat.samplerScore}
                handleSetScore={(score) => {
                  familyStore.setSamplerScore(score)
                }}
              />
              <Button
                style={{marginLeft: "10px"}}
                width={150}
                onClick={this.handleMutateSampler}
              >
                Mutate Drums
              </Button>
            </div>
            {this.renderSamplerTracks(samplerTracks)}
          </StyledSection>
        </StyledSectionWrapper>

        <div style={{display: "table-row"}}>
          <Column />
          <Column />
          <Column style={{textAlign: "center"}} />
        </div>
      </StyledBeat>
    )
  }
}

export default BeatDetail
