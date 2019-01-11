import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../stores/store"
import playingStore from "../stores/playingStore"


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
  border: 1px solid black;
  cursor: pointer;
  display: inline-block;
  height: 24px;
  margin: 0;
  font-size: 15px;
  width: 24px;
  transition: 0.2s background-color;
  vertical-align: middle;

  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  &:hover {
    background-color: ${props => props.active ? "lightpink" : props.on ? "#FF6666" : "darkgray" };
  }
`


@observer
class Note extends Component {
  render() {
    const separator = this.props.index % 4 === 3

    return (
      <NoteWrapper separator={separator}>
        <StyledNote
          active      = {this.props.activeNotes[this.props.index].value}
          on          = {this.props.value === 1}
          onMouseDown = {this.props.onClick}
          onMouseOver = {this.props.onMouseOver}
          className   = "note"
        >&nbsp;</StyledNote>
      </NoteWrapper>
    )
  }
}


export default Note
