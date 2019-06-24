import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import { toJS } from "mobx"

import {
  MdPlayArrow,
  MdStop,
} from "react-icons/md"

import familyStore from "../stores/familyStore"
import lineageViewStore from "../stores/lineageGlobalViewStore"

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
  handleClickPlayLineage = () => {
    lineageViewStore.togglePlayLineage()
  }

  handleClickPlayBeat = (beatId, i) => {
    lineageViewStore.togglePlayingBeat(beatId, i)
  }

  handleClickBeat = (beatId) => {
    familyStore.setCurrentBeat(beatId)
  }

  render() {
    const beatBlocks = this.props.beats.map( (beat, i) => {
      console.log(beat, lineageViewStore.beatPlayingStates[beat.id])
      return (
        <BeatBlock
          index         = {i}
          key           = {i}
          beat          = {beat}
          handleClickPlay = {() => {this.handleClickPlayBeat(beat.id, i)}}
          playing = {() => lineageViewStore.beatPlayingStates[beat.id]}
          familyBlock   = {true}
          handleClickBeat = {() => {this.handleClickBeat(beat.id)}}
          templateBlock = {true}
          deleteBlock   = {() => familyStore.deleteBeatFromLineage(i)}
        />
      )
    })

    const PlayStopButton = lineageViewStore.playingLineage ? MdStop : MdPlayArrow

    return (
      <StyledLineage>
        <h3
          style={{
            margin : "4px 8px",
            fontSize: 30,
          }}
        >Lineage</h3>
        <PlayStopButton
          size    = {50}
          onClick = {this.handleClickPlayLineage}
        />
        {beatBlocks}
      </StyledLineage>
    )
  }
}


export default Lineage
