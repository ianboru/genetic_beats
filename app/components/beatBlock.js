import React, {Component} from "react"
import {toJS} from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import {MdPlayArrow, MdStop} from "react-icons/md"

import MiniBeat from "./miniBeat"

import {colors} from "../colors"
import {deepClone} from "../utils"

const selectedColor = colors.gray.dark

const StyledBlock = styled.div`
  border-radius: 3px;
  box-shadow: 1px 1px 4px 0px black;
  //margin: 6px;
  //border: 1px solid #333;
  background-color: ${(props) => (props.selected ? selectedColor : "#1d1f27")};
  display: inline-block;
  height: 100%;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #ccc;
    background-color: ${(props) =>
      props.selected ? selectedColor : colors.gray.light};
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
    // Re-render any time anything in the beat changes
    const beat = deepClone(this.props.beat)

    let playing = this.props.playing()
    const PlayStopButton = playing ? MdStop : MdPlayArrow

    const deleteButton = this.props.deleteBlock ? (
      <DeleteBlockButton
        onClick={(e) => {
          this.props.deleteBlock()
          e.stopPropagation()
        }}
      >
        &times;
      </DeleteBlockButton>
    ) : null

    return (
      <StyledBlock
        innerRef={this.props.innerRef}
        selected={this.props.selected || playing}
        onClick={this.props.handleClickBeat}
        {...this.props.draggableProps}
        {...this.props.dragHandleProps}
      >
        <div style={{textAlign: "left"}}>
          <PlayStopButton
            size={30}
            onClick={this.props.handleClickPlay}
            style={{verticalAlign: "middle"}}
          />
          <span style={{verticalAlign: "middle", marginLeft: 5}}>
            {beat.key}
          </span>
        </div>
        <MiniBeat beat={beat} playing={playing} />
        {deleteButton}
      </StyledBlock>
    )
  }
}
export default BeatBlock
