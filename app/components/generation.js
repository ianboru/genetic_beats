import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../react-music"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import Button from "./button"
import Player from "./player"
import { toJS } from "mobx"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import familyViewStore from "../stores/familyViewStore"

import playingStore from "../stores/playingStore"
import BeatBlock from "./beatBlock"
import { colors } from "../colors"



@observer
class Generation extends Component {
  /*
  Decide on local vs global instance. 
  constructor(props){
    super(props)
    this.familyViewStore = new FamilyViewStore()

  }*/
  handleClickPlay = (beatKey) => {
    
    familyViewStore.togglePlayingBeat(beatKey)
  }
  render() {
    const beatBlocks = familyStore.allGenerations[this.props.index].map( (currentBeat, i) => {
      return (
        <BeatBlock
          index         = {i}
          key           = {i}
          beat          = {currentBeat}
          isCurrentBeat = {true}
          handleClickPlay = {()=>{this.handleClickPlay(currentBeat.key)}}
          playing = {familyViewStore.playingBeats[currentBeat.key]}
          familyBlock = {true}
        />
      )
    })

    return (
      <div>
        {beatBlocks}
      </div>
    )
  }
}


export default Generation
