import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"

import Button from "./button"

import arrangementStore from "../stores/arrangementStore"
import playingStore from "../stores/playingStore"

import { colors } from "../colors"

import {
  MdPlayArrow,
  MdStop,
} from "react-icons/md"


const StyledArrangementControls = styled.div`
  margin-left: 15px;

  button {
    margin-buttom : 20px;
  }
`


@observer
class ArrangementControls extends Component {
  handleSelectArrangement = (evt) => {
    arrangementStore.selectArrangement(parseInt(evt.target.value))
  }

  render() {
    const PlayStopButton = playingStore.playingArrangement ? MdStop : MdPlayArrow

    let arrangementOptions = []
    arrangementStore.arrangements.forEach((arrangement,index) => {
      arrangementOptions.push(
        <option key={index} value={index}>
          {index}
        </option>
      )
    })

    return (
      <StyledArrangementControls>
        <div style={{ textAlign: "left" , marginTop : 15, marginBottom: 15 }}>
          <span style={{color: colors.gray.lightest}}>Current Song:&nbsp;</span>

          <select
              style={{fontSize : "20px"}}
              onChange={this.handleSelectArrangement}
              value={arrangementStore.currentArrangementIndex}
            >
              {arrangementOptions}
          </select>

          <Button
            style   = {{background : colors.gray.darkest, marginLeft : "20px"}}
            color   = {[colors.yellow.dark]}
            onClick = {arrangementStore.addArrangement}
          >
          Blank Song
          </Button>
        </div>
        <div >
          Create song automatically:&nbsp;&nbsp;&nbsp;

          <Button color={[colors.yellow.dark]} onClick={this.randomizeBestBeats}>Randomize Best Beats</Button>
          <Button color={[colors.yellow.dark]} onClick={this.createSong}>Song with Arcs</Button>
        </div>

        <div>
          {arrangementStore.currentArrangement.length > 0 ?
          <PlayStopButton
            size    = {80}
            onClick = {playingStore.togglePlayArrangement}
            style={{verticalAlign: "middle", "marginBottom" : "15px"}}
          /> : null}
        </div>
      </StyledArrangementControls>
    )
  }
}


export default ArrangementControls
