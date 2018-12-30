import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../store"
import playingStore from "../playingStore"


const NoteWrapper = styled.div`
  border-right: ${props => props.separator ? "1px solid white" : "0"};
  display: inline-block;

  &:last-child {
    border-right: 0;
  }
`

const StyledNote = styled.div`
  background-color: ${props => props.active ? "pink" : props.on ? "red" : "gray" };
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  height: 20px;
  margin: 0 5px;
  font-size: 15px;
  width: 20px;

  &:hover {
    background-color: ${props => props.active ? "lightpink" : props.on ? "#FF6666" : "darkgray" };
  }
`



@observer
class Note extends Component {
  render() {
    const active = this.props.index == playingStore.currentLitNote && playingStore.playingCurrentBeat
    const separator = this.props.index % 4 === 3

    return (
      <NoteWrapper separator={separator}>
        <StyledNote
          on          = {this.props.value === 1}
          active      = {active}
          onMouseDown = {this.props.onClick}
          onMouseOver = {this.props.onMouseOver}
          className   = "note"
        >&nbsp;</StyledNote>
      </NoteWrapper>
    )
  }
}


export default Note
