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
  render() {
    const PlayStopButton = playingStore.playingCurrentBeat ? MdStop : MdPlayArrow

    return (
        <StyledBlock
          highlight = {this.props.highlight}
          onClick   = {this.props.handleClickBeat}
        >
          <PlayStopButton
            size    = {30}
            onClick = {playingStore.togglePlayArrangement}
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
