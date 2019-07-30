import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

const NoteWrapper = styled.div`
  border-right: ${(props) => (props.separator ? "1px solid white" : "0")};
  display: inline-block;

  &:last-child {
    border-right: 0;
  }
`

const lightGreen = chroma("lightgreen").darken(0.4)
const lighterGreen = chroma("lightgreen").brighten(0.4)
const lightestGreen = chroma("lightgreen").brighten(1.2)

const StyledNote = styled.div`
  background-color: ${(props) =>
    props.active
      ? props.on
        ? lightestGreen
        : "darkgray"
      : props.on
      ? lightGreen
      : "gray"};
  box-shadow: ${(props) => (props.on ? `0 0 2px 1px ${lightGreen}` : "none")};
  border-radius: 3px;
  border: 1px solid black;
  cursor: pointer;
  display: inline-block;
  position: relative;
  z-index: ${(props) => (props.on ? 1 : 0)};
  height: 24px;
  margin: 0;
  font-size: 15px;
  width: 24px;
  vertical-align: middle;
  transition: background-color 0.05s;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

  &:hover {
    background-color: ${(props) =>
      props.active ? lightestGreen : props.on ? lighterGreen : "darkgray"};
  }
`

@observer
class Note extends Component {
  render() {
    const separator = this.props.index % 4 === 3

    return (
      <NoteWrapper separator={separator}>
        <StyledNote
          active={this.props.activeNotes[this.props.index].value}
          on={this.props.value === 1}
          onMouseDown={this.props.onClick}
          onMouseOver={this.props.onMouseOver}
          className="note"
        >
          &nbsp;
        </StyledNote>
      </NoteWrapper>
    )
  }
}

export default Note
