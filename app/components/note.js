import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import {newColors} from "../colors"

const NoteWrapper = styled.div`
  border-right: ${(props) => (props.separator ? "1px solid white" : "0")};
  display: inline-block;

  &:last-child {
    border-right: 0;
  }
`

const lightGreen = chroma("#44DA5F").brighten(0.4)
const lighterGreen = chroma(lightGreen).brighten(1.0)
const lightestGreen = chroma(lightGreen).brighten(1.8)

const backgroundColor = (active, on) => {
  if (active) {
    return on ? lightestGreen : "darkgray"
  } else {
    return on ? lightGreen : "gray"
  }
}

const StyledNote = styled.div`
  background-color: ${(props) => backgroundColor(props.active, props.on)};
  box-shadow: ${(props) => (props.on ? `0 0 3px 1px ${lighterGreen}` : "none")};
  border-radius: 3px;
  border: 1px solid #202020;
  cursor: pointer;
  display: inline-block;
  position: relative;
  z-index: ${(props) => (props.on ? 1 : 0)};
  height: 24px;
  margin: 0px;
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
    const separator = this.props.index % 4 === 3 && this.props.index !== 15

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
