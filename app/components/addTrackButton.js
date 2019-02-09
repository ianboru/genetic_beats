import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import {allNotesInRange} from "../utils"
import { colors } from "../colors"

import Button from "./button"


const StyledAddTrackPopup = styled.div`
  position: absolute;
  border-radius: 4px;
  left: 20px;
  right: 20px;
  top: 100%;
  background: black;
  border: 1px solid blue;
`

const StyledAddTrackButton = styled.div`
  background: ${colors.gray.darkest};
  border-radius: 3px;
  border: 2px solid ${colors.green.base};
  cursor: pointer;
  font-size: 18px;
  margin-top: 6px;
  padding: 2px 0;
  position: relative;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: #444;
  }

  &:active {
    background: #333;
  }

  &:hover ${StyledAddTrackPopup} {
    background: ${colors.gray.darkest};
  }
`



@observer
class AddTrackButton extends Component {
  state = {
    showAddTrack: false,
  }

  toggleShowAddTrack = (show) => {
    if (show === true || show === false) {
      this.setState({ showAddTrack: show})
    } else {
      this.setState({ showAddTrack: !this.state.showAddTrack})
    }
  }

  render() {
    return (
      <StyledAddTrackButton
        onClick = {this.toggleShowAddTrack}
        title   = "Add a new sampler or synth instrument track"
      >
        Add Instrument

        <AddTrackPopup
          handleCancel = {this.toggleShowAddTrack}
          show         = {this.state.showAddTrack}
        />
      </StyledAddTrackButton>
    )
  }
}


@enhanceWithClickOutside
@observer
class AddTrackPopup extends Component {
  handleClickOutside = () => {
    this.props.handleCancel(true)
  }

  handleAddSamplerTrack = () => {
    familyStore.addTrackToCurrentBeat(this.props.beat, "sampler")
    this.props.handleCancel()
  }

  handleAddSynthTrack = () => {
    familyStore.addTrackToCurrentBeat(this.props.beat, "synth")
    this.props.handleCancel()
  }

  render() {
    return (
      <StyledAddTrackPopup>
        <Button small onClick={this.handleAddSamplerTrack}>Add Sampler Track</Button>
        <Button small onClick={this.handleAddSynthTrack}>Add Synth Track</Button>
        <Button
          small
          color   = {[colors.red.base]}
          onClick = {this.props.handleCancel}
        >Cancel</Button>
      </StyledAddTrackPopup>
    )
  }
}


export default AddTrackButton
