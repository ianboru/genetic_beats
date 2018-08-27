import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"
import {observer} from "mobx-react"
import styled from "styled-components"

import Button from "./button"
import Player from "./player"

import store from "../store"
import { normalizeSubdivisions } from "../utils"
import {
  itemBgColor,
  lightGray,
} from "../colors"


const StyledArrangement = styled.div`
  background: ${itemBgColor};
  border-top: 1px solid ${lightGray};
  height: 125px;
  overflow: visible;
`

const StyledBlock = styled.div`
  border-right: 1px solid ${lightGray};
  background-color: ${props => props.highlight ? "#e9573f" : itemBgColor};
  display: inline-block;
  height: 100%;
  width: 80px;
  position:relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: lightGray;
  }
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
`


@observer
class Block extends Component {
  render() {
    return (
      <StyledBlock 
        highlight={this.props.highlight} 
        onClick={this.props.handleClickBeat}
        onMouseDown = {this.props.handleMouseDown}
        onMouseOver={(e) => { 
          if( e.buttons == 1 ){
            console.log("held")
            console.log(this.props)
            this.props.updateLastEntered(this.props.index)
          }
            if(
                e.buttons == 1 && 
                this.props.lastEntered != this.props.index && 
                this.props.lastEntered != this.props.lastClicked 
              ){
              console.log("time to move")
              this.props.handleMoveBeat(this.props.lastClicked, this.props.index) 

            }
          }}
      >
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
    beatToAdd : store.allBeatKeys[0],
    lastEntered : -1,
    lastClicked : -1,
  }

  deleteBlock = (index) => {
    store.deleteBeatFromArrangement(index)
  }

  addBlock = () => {
    store.addBeatToArrangement(this.state.beatToAdd)
  }

  handleSelectBeatToAdd = (evt) => {
    this.setState({
      beatToAdd : evt.target.value
    })
  }
  handleClickBeat = (beatKey, arrangementIndex) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    store.selectBeat(generation,beatNum)
    console.log("updating last clicked " + arrangementIndex)
    
  }
  handleMouseDown = (arrangementIndex) => {
    console.log("mouse down on " + arrangementIndex)
    this.setState({
      lastClicked: arrangementIndex
    })
  } 
  handleMoveBeat = (arrangementIndex, destinationIndex) => {
        console.log("move " ,arrangementIndex,destinationIndex)

    store.moveBeatInArrangement(arrangementIndex,destinationIndex)
  }
  updateLastEntered = (arrangementIndex) => {
    console.log("last entered ", arrangementIndex)
    this.setState({
      lastEntered: arrangementIndex
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

  randomizeBestBeats = () => {
    const confirmMessage = "Randomizing beats now will clear your existing arrangement.\nAre you sure you want to do that?"
    if (store.arrangementBeats.length > 0) {
      if (confirm(confirmMessage)) {
        store.randomizeBestBeats()
      }
    } else {
      store.randomizeBestBeats()
    }
  }

  render() {
    let backgroundColor = ""
    const beats = store.arrangementBeats.map( (beatKey, i) => {
    const highlight = (i === store.currentLitBeat && store.playingArrangement)

      return (
        <Block
          key       = {i}
          index     = {i}
          beatKey   = {beatKey}
          highlight = {highlight}
          lastClicked = {this.state.lastClicked}
          lastEntered = {this.state.lastEntered}
          deleteBlock = {()=>{this.deleteBlock(i)}}
          handleClickBeat = {()=>{this.handleClickBeat(beatKey,i)}}
          handleMoveBeat = {this.handleMoveBeat}
          handleMouseDown = {()=>{this.handleMouseDown(i)}}

          updateLastEntered = {()=>{this.updateLastEntered(i)}}
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

    const playButtonText = store.playingArrangement ? "Stop" : "Play"

    return (
      <div>
        <ArrangementControls>
          <Button onClick={store.togglePlayArrangement}>{playButtonText}</Button>
          <Button onClick={this.randomizeBestBeats}>Randomize Best Beats</Button>
        </ArrangementControls>

        <StyledArrangement>
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
            playing={store.playingArrangement}
            resolution = {maxSubdivisions}
            bars = {store.arrangementBeats.length}
          />
        </StyledArrangement>
      </div>
    )
  }
}


export default Arrangement
