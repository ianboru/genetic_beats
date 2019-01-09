import React, { Component } from "react"
import { toJS } from "mobx"

import {
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
} from "react-icons/md"
import styled from "styled-components"
import { colors } from "../colors"
import {observer} from "mobx-react"
import playingStore from "../stores/playingStore"
import familyStore from "../stores/familyStore"
import arrangementStore from "../stores/arrangementStore"
import chroma from "chroma-js"
import MiniBeat from "./miniBeat"
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
    familyStore.updateCurrentHighlightedParent(this.props.beatKey)
  }
  handleClickBeat = (beatKey) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
  }
  handleClickPlay = () => {
    const beatKey = this.props.beatKey
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    playingStore.toggleBeatPlayer(beatKey)
    familyStore.inactivateNotes(beatKey)
  }
  render() {
    const idData = this.props.beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    const beat = familyStore.allGenerations[generation][beatNum]
    const PlayStopButton = playingStore.beatPlayers[this.props.beatKey] ? MdStop : MdPlayArrow
    let childHighlight = false

    if(beat.momKey == familyStore.currentHighlightedParent || beat.dadKey == familyStore.currentHighlightedParent){
      childHighlight = true
    }

    let parentHighlight = false

    if(familyStore.currentHighlightedParent){
      const hightlightedIdData = familyStore.currentHighlightedParent.split(".")
      const highlightedBeat = familyStore.allGenerations[hightlightedIdData[0]][hightlightedIdData[1]]

      if(beat.key == highlightedBeat.momKey|| beat.key == highlightedBeat.dadKey){
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
            onClick = {this.handleClickPlay}
            style={{verticalAlign: "middle", "marginBottom" : "15px"}}
          /> 
          <p>{this.props.beatKey}</p>
          <MiniBeat 
          beat={familyStore.allGenerations[generation][beatNum]}
          />
          <DeleteBlockButton onClick={(e) => {
            this.props.deleteBlock()
            e.stopPropagation()
          }}>
            &times;
          </DeleteBlockButton>
          {this.props.children}
        </StyledBlock>
    )
  }
}
export default BeatBlock
