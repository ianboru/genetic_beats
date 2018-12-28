import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import store from "../store"
import familyStore from "../familyStore"
import { colors } from "../colors"

import Button from "./button"

import {allNotesInRange} from "../utils"


const StyledAddTrackButton = styled.div`
  background: ${colors.gray.darkest};
  border-radius: 3px;
  border: 2px solid ${colors.green.base};
  cursor: pointer;
  font-size: 18px;
  margin-top: 6px;
  padding: 2px 0;
  text-align: center;
  transition: background-color 0.2s;
  width: 100%;

  &:hover {
    background: #444;
  }

  &:active {
    background: #333;
  }
`


@observer
class AddTrackButton extends Component {
  state = {
    showTrackTypes: false,
  }

  handleAddTrack = (trackType) => {
    const steps = this.props.beat.tracks[0].sequence.length
    let sample

    if (trackType === "sampler") {
      const beatSamples = this.props.beat.tracks.map( (track) => { return track.sample } )
      const unusedSamples = Object.keys(store.samples).filter( (key) => {
        const sample = store.samples[key]
        return !beatSamples.includes(sample.path)
      })

      sample = unusedSamples[0]
    } else if (trackType === "synth") {
      sample = allNotesInRange[0]
    }
    //TODO move to ui control
    const synthType = "square"
    const sequence = Array(steps).fill(0)
    familyStore.addTrackToCurrentBeat({sample, sequence, trackType, synthType})
  }

  handleAddSamplerTrack = () => {
    this.handleAddTrack("sampler")
    this.toggleShowTrackTypes()
  }

  handleAddSynthTrack = () => {
    this.handleAddTrack("synth")
    this.toggleShowTrackTypes()
  }

  toggleShowTrackTypes = () => {
    this.setState({ showTrackTypes: !this.state.showTrackTypes})
  }

  renderTrackTypes = () => {
    return (
      <div>
        <Button small onClick={this.handleAddSamplerTrack}>Add Sampler Track</Button>
        <Button small onClick={this.handleAddSynthTrack}>Add Synth Track</Button>
        <Button
          small
          color   = {[colors.red.base]}
          onClick = {this.toggleShowTrackTypes}
        >Cancel</Button>
      </div>
    )
  }

  renderAddInstrument = () => {
    return (
      <StyledAddTrackButton onClick={this.toggleShowTrackTypes} title="Add a new sampler or synth instrument track">
        Add Instrument
      </StyledAddTrackButton>
    )
  }

  render() {
    if (this.state.showTrackTypes) {
      return this.renderTrackTypes()
    } else {
      return this.renderAddInstrument()
    }
  }
}


export default AddTrackButton
