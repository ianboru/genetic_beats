import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import { colors } from "../colors"

import Button from "./button"


const StyledAddTrackPopup = styled.div`
  position: absolute;
  padding: 2px;
  border-radius: 4px;
  left: 20px;
  right: 20px;
  top: 100%;
  background: ${colors.gray.darker};
  border: 2px solid ${colors.gray.dark};
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.2s;
`

const StyledAddTrackButton = styled.div`
  background: ${props => props.show ? colors.gray.darkest : colors.gray.darker};
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
    background: ${colors.gray.darkest};
  }

  &:active {
    background: #333;
  }
`


@enhanceWithClickOutside
@observer
class AddTrackButton extends Component {
  state = {
    showAddTrack: false,
  }

  handleClickOutside = () => {
    this.setState({ showAddTrack: false })
  }

  toggleShowAddTrack = () => {
    this.setState({ showAddTrack: !this.state.showAddTrack})
  }

  render() {
    return (
      <StyledAddTrackButton
        onClick = {this.toggleShowAddTrack}
        title   = "Add a new sampler or synth instrument track"
      >
        Add Instrument

        <AddTrackPopup
          handleCancel = {() => { this.setState({ showAddTrack: false }) }}
          show         = {this.state.showAddTrack}
        />
      </StyledAddTrackButton>
    )
  }
}


@observer
class AddTrackPopup extends Component {
  handleAddSamplerTrack = () => {
    familyStore.addTrackToCurrentBeat("sampler")
    this.props.handleCancel()
  }

  handleAddSynthTrack = () => {
    familyStore.addTrackToCurrentBeat("synth")
    this.props.handleCancel()
  }

  render() {
    return (
      <StyledAddTrackPopup show={this.props.show}>
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
