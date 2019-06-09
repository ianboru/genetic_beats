import React, { Component } from "react"
import { toJS } from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom"

import {
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
  MdOpenInNew
} from "react-icons/md"

import familyStore from "../stores/familyStore"
import familyViewStore from "../stores/familyViewStore"
import arrangementStore from "../stores/arrangementStore"
import MiniBeat from "./miniBeat"

import { colors } from "../colors"
import { deepClone } from "../utils"



const selectedColor = colors.gray.dark

const StyledBlock = styled.div`
  border-radius: 3px;
  box-shadow: 1px 1px 4px 0px black;
  margin: 6px;
  border: 1px solid #333;
  background-color: ${(props) => props.selected ? selectedColor : "#1d1f27"};
  display: inline-block;
  height: 100%;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #ccc;
    background-color: ${(props) => props.selected ? selectedColor : colors.gray.light};
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
const OpenInNewWindow = styled(NavLink)`
  font-size : 15pt;
  margin-top : 5px;
`

@observer
class BeatBlock extends Component {
  render() {
    const beat = deepClone(this.props.beat)
    const idData = beat.key.split(".")

    // `playing` is true under two conditions. the first is the "easy" way
    // to get a beat to play (pass in playing={true} prop), the second
    // is the more efficient way of playing, eg within an arrangement.
    let playing = this.props.playing()
    if (this.props.beatPlayingStates && this.props.beatPlayingStates[this.props.arrangementKey]) {
      playing = this.props.beatPlayingStates[this.props.arrangementKey]
    }

    const PlayStopButton = playing ? MdStop : MdPlayArrow

    const openInNewWindow = !this.props.templateBlock ? <nav>
        <OpenInNewWindow exact to="/" onClick={()=>{
          familyViewStore.selectBeat(idData[0],idData[1]);
        }}>
          <MdOpenInNew />
        </OpenInNewWindow>
      </nav> : null

    const deleteButton = this.props.arrangementBlock ? <DeleteBlockButton onClick={(e) => {
          this.props.deleteBlock()
          e.stopPropagation()
        }}>
          &times;
        </DeleteBlockButton> : null

    return (
      <StyledBlock
        innerRef        = {this.props.innerRef}
        selected        = {this.props.selected || playing}
        onClick         = {this.props.handleClickBeat}
        {...this.props.draggableProps}
        {...this.props.dragHandleProps}
      >
        {openInNewWindow}
        <div style={{textAlign: "left"}}>
          <PlayStopButton
            size    = {30}
            onClick = {this.props.handleClickPlay}
            style={{verticalAlign: "middle"}}
          />
          <span style={{verticalAlign: "middle", marginLeft: 5}}>{beat.key}</span>
          <span style={{float: "right"}}>
            {this.props.children}
          </span>
        </div>
        <MiniBeat
          beat    = {beat}
          playing = {playing}
        />
        {deleteButton}
      </StyledBlock>
    )
  }
}
export default BeatBlock
