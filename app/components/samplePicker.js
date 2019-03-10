import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../stores/store"
import familyStore from "../stores/familyStore"

import { allNotesInRange } from "../utils"


const StyledSelect = styled.div`
  display: inline-block;
`


@observer
class SamplePicker extends Component {
  render() {
    let sampleOptions = Object.keys(store.samples).map( (key) => {
      const sample = store.samples[key]
      return (
        <option
          key   = {sample.path}
          value = {key}
        >{sample.name}</option>
      )
    })

    if (this.props.track.trackType === "synth") {
      sampleOptions = allNotesInRange.map( (noteName) => {
        const synthType = this.props.track.synthType ? this.props.track.synthType : "sine"
        const noteString = noteName + "-" + synthType
        return (
          <option
            key   = {noteName}
            value = {noteName}
          >{noteString}</option>
        )
      })
    }

    return (
      <StyledSelect>
        <select
          onChange = {this.props.handleSampleChange}
          value    = {this.props.track.sample}
          style    = {{
            fontSize: 15,
            backgroundColor: "lightgray",
          }}
        >
          {sampleOptions}
        </select>
      </StyledSelect>
    )
  }
}


export default SamplePicker
