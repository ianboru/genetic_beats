import React, { Component } from "react"

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


const StyledBlock = styled.div`
  border: 1px solid ${colors.white};

  background-color: ${props => props.highlight ? "#e9573f" : colors.blue.dark};
  display: inline-block;
  height: 100%;
  width: 100px;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: ${props => props.highlight ? chroma("#e9573f").brighten(0.5) : colors.blue.base};
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
  handleClickBeat = (beatKey) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    console.log("selecting " , generation, beatNum)
  }
  handleClickPlay = () => {
    const beatKey = this.props.beatKey
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    console.log("playing " , generation, beatNum)
    playingStore.toggleBeatPlayer(beatKey)
  }
  render() {
    const PlayStopButton = playingStore.beatPlayers[this.props.beatKey] ? MdStop : MdPlayArrow

    return (
        <StyledBlock
          highlight = {this.props.highlight}
          onHover   = {this.props.handleHover}
        >
          <PlayStopButton
            size    = {30}
            onClick = {this.handleClickPlay}
            style={{verticalAlign: "middle", "marginBottom" : "15px"}}
          /> 
          <p>{this.props.beatKey}</p>
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
