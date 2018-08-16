import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"
import {observer} from "mobx-react"
import styled from "styled-components"

import Player from "./player"
import store from "../store"
import { normalizeSubdivisions } from "../utils"


const StyledArrangement = styled.div`
  margin-top: 35px;
  height: 125px;
  border: 1px solid black;
  overflow: visible;
  position: relative;
`

const StyledBlock = styled.div`
  border-left: 1px solid black;
  border-right: 1px solid black;
  display: inline-block;
  height: 100%;
  width: 80px;
  position:relative;
  vertical-align: top;
  text-align: center;
`

const AddBlockButton = styled.div`
  cursor: pointer;
  font-size: 30px;

  &:hover {
    color: red;
  }
`

const DeleteBlockButton = styled.div`
  position: absolute;
  top: 0;
  right: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    color: red;
  }
`

const ArrangementControls = styled.div`
  position: absolute;
  top: -35px;
  left: 0;
`


@observer
class Block extends Component {
  render() {
    return (
      <StyledBlock>
        <p>{this.props.beatKey}</p>
        <DeleteBlockButton onClick={this.props.deleteBlock}>
          &times;
        </DeleteBlockButton>
      </StyledBlock>
    )
  }
}


@observer
class Arrangement extends Component {
  state = {
    playArrangement : false,
    beatToAdd       : store.allBeatKeys[0]
  }

  deleteBlock = (index) => {
    store.deleteBeatFromArrangement(index)
  }

  addBlock = () => {
    store.addBeatToArrangement(this.state.beatToAdd)
  }

  togglePlayArrangement = () => {
    this.setState({
      playArrangement : !this.state.playArrangement
    })
  }

  handleSelectBeatToAdd = (evt) => {
    this.setState({
      beatToAdd : evt.target.value
    })
  }

  concatenateBeats = (beats, resolution) => {
    let finalBeat = {"tracks":[]}
    let uniqueSamples = {}
    let numUniqueSamples = 0
    let allSamples = []

    beats.forEach( (beat,i)=>{
      beat.tracks.forEach(( track, i )=>{
        const sample = track.sample
        if( uniqueSamples[sample] == null  ){
          uniqueSamples[sample] = numUniqueSamples
          finalBeat.tracks.push({
            "sample": sample,
            "sequence" : [],
            "trackType" : track.trackType
          })
          ++numUniqueSamples
        }
      })
    })

    beats.forEach( (beat, i) => {
      let beatSamples = []
      beat.tracks.forEach(( track, i )=>{
        const sample = track.sample
        const sampleIndex = uniqueSamples[sample]
        if(finalBeat.tracks[sampleIndex].sequence.length > 0  ){
            finalBeat.tracks[sampleIndex].sequence = finalBeat.tracks[sampleIndex].sequence.concat(track.sequence)
        }else{
          finalBeat.tracks[sampleIndex].sequence = track.sequence
        }
        if (!beatSamples.includes(sample)){
          beatSamples.push(sample)
        }
      })
      // fill one measure of zeros if samples weren't in current beat
      for (var sample in uniqueSamples){
        const sampleIndex = uniqueSamples[sample]

        if(!beatSamples.includes(sample)){
           finalBeat.tracks[sampleIndex].sequence =
           finalBeat.tracks[sampleIndex].sequence.concat(
            new Array(resolution).fill(0)
           )
        }
      }
    })
    return finalBeat
  }

  getMaxSubdivisions = (beats) => {
    let maxSubdivisions = 0
    beats.forEach( (beatKey, i) => {
      const beatKeySplit = beatKey.split(".")
      const generation = parseInt(beatKeySplit[0])
      const childIndex = parseInt(beatKeySplit[1])
      const beat = store.allGenerations[generation][childIndex]
      const subdivisions = beat["tracks"][0].sequence.length
      if(subdivisions > maxSubdivisions){
        maxSubdivisions = subdivisions
      }
    })
    return maxSubdivisions
  }

  getNormalizedBeats = (beats, maxSubdivisions) => {
    let normalizedBeats = []
    beats.forEach( (beatKey, i) => {
      const beatKeySplit = beatKey.split(".")
      const generation = parseInt(beatKeySplit[0])
      const childIndex = parseInt(beatKeySplit[1])
      const beat = store.allGenerations[generation][childIndex]
      const normalizedBeat = normalizeSubdivisions(beat,maxSubdivisions)
      normalizedBeats.push(normalizedBeat)
    })
    return normalizedBeats
  }

  render() {
    const beats = store.arrangementBeats.map( (beatKey, i) => {
      return (
        <Block
          key = {i}
          beatKey = {beatKey}
          deleteBlock = {()=>{this.deleteBlock(i)}}
        />
      )
    })

    // get max subdivisions
    const maxSubdivisions = this.getMaxSubdivisions(store.arrangementBeats)
    const normalizedBeats = this.getNormalizedBeats(store.arrangementBeats, maxSubdivisions)
    const finalArrangementBeat = this.concatenateBeats(normalizedBeats, maxSubdivisions)
    const beatKeyOptions = store.allBeatKeys.map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      )
    })

    const playButtonText = this.state.playArrangement ? "Stop" : "Play"

    return (
      <StyledArrangement>
        <ArrangementControls>
          <button onClick={this.togglePlayArrangement}>{playButtonText}</button>
          <button onClick={store.randomizeBestBeats}>Randomize Best Beats</button>
        </ArrangementControls>

        {beats}

        <StyledBlock>
          <p>
            <select
              defaultValue={beatKeyOptions[0]}
              onChange={this.handleSelectBeatToAdd}
            >
              {beatKeyOptions}
            </select>
          </p>
          <AddBlockButton onClick={this.addBlock}>+</AddBlockButton>
        </StyledBlock>

        <Player
          beat={finalArrangementBeat}
          playing={this.state.playArrangement}
          resolution = {maxSubdivisions}
          bars = {store.arrangementBeats.length}
        />
      </StyledArrangement>
    )
  }
}


export default Arrangement
