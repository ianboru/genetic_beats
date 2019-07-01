import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../stores/store"
import familyStore from "../stores/familyStore"


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
