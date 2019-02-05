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


const StyledBlock = styled.div`
  border-radius: 3px;
  box-shadow: 1px 1px 4px 0px black;
  margin: 6px;
  border: 1px solid #333;
  background-color: ${(props) => {
    return props.selected ? colors.red.base : "#1d1f27"
  }};
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
const OpenInNewWindow = styled(NavLink)`
  font-size : 15pt;
  margin-top : 5px;
`

@observer
class BeatBlock extends Component {
  handleHover = () => {
    if (this.props.familyBlock) {
      familyStore.updateCurrentHighlightedParent(this.props.beat.key)
    }
  }

  handleMouseLeave = ()=>{
    if(this.props.familyBlock){
      familyStore.updateCurrentHighlightedParent("")
    }
  }

  render() {
    const beat = deepClone(this.props.beat)
    const idData = beat.key.split(".")

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

    // `playing` is true under two conditions. the first is the "easy" way
    // to get a beat to play (pass in playing={true} prop), the second
    // is the more efficient way of playing, eg within an arrangement.
    let playing = this.props.playing
    if (this.props.activeBeat && this.props.activeBeat[this.props.index]) {
      playing = this.props.activeBeat[this.props.index].value
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
        highlight       = {this.props.highlight}
        childHighlight  = {childHighlight}
        parentHighlight = {parentHighlight}
        onMouseEnter   = {this.handleHover}
        onMouseLeave   = {this.handleMouseLeave}
        selected = {this.props.selected}
        onClick = {this.props.handleClickBeat}
      >
      {openInNewWindow}
        <PlayStopButton
          size    = {30}
          onClick = {this.props.handleClickPlay}
          style={{verticalAlign: "middle", "marginBottom" : "15px"}}
        />
        <p>{beat.key}</p>
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
