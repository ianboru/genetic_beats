import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import { toJS } from "mobx"

import familyViewStore from "../stores/familyViewStore"

import BeatBlock from "./beatBlock"
import { colors } from "../colors"


const bgColor = chroma(colors.green.lightest).alpha(1).rgba()

const StyledLineage = styled.div`
  border: 2px solid rgba(${bgColor.join(",")});
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 5px;
`



@observer
class Lineage extends Component {
  handleClickPlay = (beatKey) => {
    familyViewStore.togglePlayingBeat(beatKey)
  }

  handleClickBeat = (beatKey) => {
    if(familyViewStore.selectPairMode){
      familyViewStore.toggleSelect(beatKey)
    }
  }

  render() {
    const beatBlocks = this.props.beats.map( (beat, i) => {
      return (
        <BeatBlock
          index         = {i}
          key           = {i}
          beat          = {beat}
          handleClickPlay = {()=>{this.handleClickPlay(beat.key)}}
          playing = {familyViewStore.playingBeats[beat.key]}
          familyBlock = {true}
          handleClickBeat = {()=>{this.handleClickBeat(beat.key)}}
          templateBlock = {true}
        />
      )
    })

    return (
      <StyledLineage>
        <h3
          style={{
            margin : "4px 8px",
            fontSize: 30,
          }}
        >Lineage</h3>

        {beatBlocks}
      </StyledLineage>
    )
  }
}


export default Lineage
