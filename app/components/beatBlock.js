import React, { Component } from "react"
import { toJS } from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import {
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
} from "react-icons/md"

import playingStore from "../stores/playingStore"
import familyStore from "../stores/familyStore"
import arrangementStore from "../stores/arrangementStore"

import MiniBeat from "./miniBeat"
import Player from "./player"

import { colors } from "../colors"
import { deepClone } from "../utils"


const StyledBlock = styled.div`

  border: 1px solid ${colors.white};

  background-color: ${props =>
    props.childHighlight ?
    colors.yellow.dark : props.highlight ?
    colors.gray.light : props.parentHighlight ?
    colors.blue.lighter : "e9573f"
  };
  display: inline-block;
  height: 100%;
  width: 150px;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: ${props => props.highlight ? chroma("#e9573f").brighten(0.5) : colors.red.lighter};
  }
`

const AddBlockButton = styled.div`
  cursor: pointer;
  display: inline-block;
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
  font-size: 25px;

  &:hover {
    color: red;
  }
`

@observer
class BeatBlock extends Component {
  handleHover = ()=>{
    if(this.props.familyBlock){
      familyStore.updateCurrentHighlightedParent(this.props.beat.key)
    }
  }

  handleClickBeat = (beatKey) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
  }


  render() {
    const beat = deepClone(this.props.beat)
    const PlayStopButton = this.props.playing ? MdStop : MdPlayArrow

    let childHighlight = false

    if(beat.momKey == familyStore.currentHighlightedParent || beat.dadKey == familyStore.currentHighlightedParent && this.props.familyBlock){
      childHighlight = true
    }

    let parentHighlight = false

    if(familyStore.currentHighlightedParent && this.props.familyBlock){
      const hightlightedIdData = familyStore.currentHighlightedParent.split(".")
      const highlightedBeat = familyStore.allGenerations[hightlightedIdData[0]][hightlightedIdData[1]]

      if(beat.key == highlightedBeat.momKey|| beat.key == highlightedBeat.dadKey && this.props.familyBlock){
        parentHighlight = true
      }
    }

    return (
      <StyledBlock
        highlight = {this.props.highlight}
        childHighlight = {childHighlight}
        parentHighlight = {parentHighlight}
        onMouseEnter   = {this.handleHover}
      >
        <PlayStopButton
          size    = {30}
          onClick = {this.props.handleClickPlay}
          style={{verticalAlign: "middle", "marginBottom" : "15px"}}
        />
        <p>{beat.key}</p>
        <MiniBeat
          beat    = {beat}
          playing = {this.props.playing}
        />
        <DeleteBlockButton onClick={(e) => {
          this.props.deleteBlock()
          e.stopPropagation()
        }}>
          &times;
        </DeleteBlockButton>
      </StyledBlock>
    )
  }
}
export default BeatBlock
