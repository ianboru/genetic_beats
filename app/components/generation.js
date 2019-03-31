import React, { Component } from "react"
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



const StyledGeneration = styled.div`
  border: 1px solid #333;
  border-width: 1px 0;
  padding: 10px 20px;
  background: ${colors.blue.lighter};
`



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

  handleClickBeat = (beatKey) => {
    if(familyViewStore.selectPairMode){
      familyViewStore.toggleSelect(beatKey)
    }
  }

  render() {
    const beatBlocks = familyStore.allGenerations[this.props.index].map( (currentBeat, i) => {
      const selected = familyViewStore.selectedBeats.includes(currentBeat.key)
      return (
        <BeatBlock
          index         = {i}
          key           = {i}
          beat          = {currentBeat}
          handleClickPlay = {()=>{this.handleClickPlay(currentBeat.key)}}
          playing = {familyViewStore.playingBeats[currentBeat.key]}
          familyBlock = {true}
          handleClickBeat = {()=>{this.handleClickBeat(currentBeat.key)}}
          selected = {selected}
        />
      )
    })

    return (
      <StyledGeneration>
        <h3
          style={{
            color  : "#333",
            margin : "4px 8px",
            fontSize: 30,
          }}
        >Generation  {this.props.index}</h3>

        {beatBlocks}
      </StyledGeneration>
    )
  }
}


export default Generation
