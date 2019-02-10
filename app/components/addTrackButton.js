import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import { colors } from "../colors"

import DrumsetIcon from "../svg/drumset.svg"
import SynthIcon from "../svg/synth.svg"

import Button from "./button"


const StyledAddTrackPopup = styled.div`
  background: ${colors.gray.darker};
  border-radius: 4px;
  border: 2px solid ${colors.green.base};
  box-shadow: 0px 0px 5px 3px rgba(255, 255, 255, 0.8);
  left: 10px;
  right: 10px;
  opacity: ${props => props.show ? 1 : 0};
  padding: 2px;
  position: absolute;
  top: 100%;
  margin-top: 10px;
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
    showAddTrack: true,
  }

  handleClickOutside = () => {
    this.setState({ showAddTrack: false })
  }

  toggleShowAddTrack = () => {
    this.setState({ showAddTrack: !this.state.showAddTrack })
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
        <Button
          large
          onClick={this.handleAddSamplerTrack}
          color={[colors.green.lightest]}
          textColor = "black"
        >
          <br />
          <DrumsetIcon
            height={80}
            width={100}
          />
          <br /><br />
          Sampler
        </Button>
        <Button
          large
          onClick={this.handleAddSynthTrack}
          color={[colors.green.lightest]}
          textColor = "black"
        >
          <br />
          <SynthIcon
            height={80}
            width={100}
          />
          <br /><br />
          Synth
        </Button>
        <br />
        <Button
          small
          onClick = {this.props.handleCancel}
          color   = {[colors.red.base]}
        >Cancel</Button>
      </StyledAddTrackPopup>
    )
  }
}


export default AddTrackButton
