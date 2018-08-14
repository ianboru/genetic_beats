import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"
import {observer} from "mobx-react"
import Player from "./player"
import store from "../store"
import { toJS  } from "mobx"
import { normalizeSubdivisions } from "../utils"


@observer
class Block extends Component {

 render(){
    return (
      <div className="arrangement-block">
        <p className="arrangement-block-text">{this.props.beatKey}</p>
        <p className="delete-block" onClick={this.props.deleteBlock}>X</p>
      </div>
    )
  }
}


@observer
class Controls extends Component {
 render(){
   const buttonText = this.props.playArrangement ? "Stop" : "Play"
   return (
     <div className="arrangement-controls">
       <button onClick={this.props.togglePlayArrangement}>{buttonText}</button>
     </div>
   )
  }
}

@observer
class Arrangement extends Component {
  constructor(props){
    super(props)
    this.state = {
      playArrangement : false,
      beatToAdd       : store.allBeatKeys[0]
    }
  }

  deleteBlock(index){
    store.deleteBeatFromArrangement(index)
  }
  addBlock(beatKey){
    store.addBeatToArrangement(beatKey)
  }
  togglePlayArrangement =()=>{
    this.setState({
      playArrangement : !this.state.playArrangement
    })
  }
  handleSelectBeatToAdd = (evt) => {
    this.setState({
      beatToAdd : evt.target.value
    })
  }
  concatenateBeats(beats, resolution){
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
            "sequence" : []
          })
          ++numUniqueSamples

        }
      })
    })
    beats.forEach( (beat,i)=>{
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
  getMaxSubdivisions(beats){
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
  getNormalizedBeats(beats, maxSubdivisions){
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
    return (
      <div className="arrangement-div">
        <Controls
          playArrangement       = {this.state.playArrangement}
          togglePlayArrangement = {this.togglePlayArrangement}
        />
        {beats}
        <div className="arrangement-block">
          <p className="arrangement-block-text" onClick={()=>{this.addBlock(this.state.beatToAdd)}} >+</p>
          <select
            defaultValue={beatKeyOptions[0]}
            onChange={this.handleSelectBeatToAdd}

          >
            {beatKeyOptions}
          </select>
        </div>
        <button onClick={store.randomizeBestBeats}>Randomize Best Beats</button>

        <Player
          beat={finalArrangementBeat}
          playing={this.state.playArrangement}
          resolution = {maxSubdivisions}
          bars = {store.arrangementBeats.length}
        />
      </div>
    )
  }
}
export default Arrangement
