import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import Button from "./button"
import { toJS } from "mobx"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import familyViewStore from "../stores/familyViewStore"

import playingStore from "../stores/playingStore"
import BeatBlock from "./beatBlock"
import { colors } from "../colors"


const bgColor = chroma(colors.green.lightest).alpha(1).rgba()

const StyledGeneration = styled.div`
  border: 2px solid rgba(${bgColor.join(",")});
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 5px;
`



@observer
class Generation extends Component {
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
