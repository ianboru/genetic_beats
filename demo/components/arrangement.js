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
    return (
      <div className="arrangement-controls">
        <button onClick={this.props.togglePlayArrangement}>Play</button>
        <button>Stop</button>
        <button>Restart</button>

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
  
  deleteBlock(index, beatList){
    beatList.splice(index,1)
    console.log(beatList)

  }
  addBlock(beatKey){
    store.addBeatToArrangement(beatKey)
    console.log("adding beatkey " + beatKey)
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
          beatKey = {beatKey}
          index = {i}
          deleteBlock = {()=>{this.deleteBlock(i, beatList)}}
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
    return <div className="arrangement-div">
            
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
            <Controls
              togglePlayArrangement = {this.togglePlayArrangement}
              />
            <Player 
              beat={finalArrangementBeat} 
              playing={this.state.playArrangement} 
              resolution = {maxSubdivisions}
              bars = {store.arrangementBeats.length}
            />
          </div>
  }
}
export default Arrangement
