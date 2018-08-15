import React, { Component } from "react"
import styled from "styled-components"

import { observer } from "mobx-react"

import ConfigControl from "./configControl"

import store from "../store"


const StyledConfigManager = styled.div`
  position: relative
`

const ConfigPanel = styled.div`
  display: ${props => props.show ? "inline-block" : "none"};
  border: 1px solid black;
  box-shadow: 3px 1px 1px #777;
  padding: 10px;
  position: absolute;
  top: 30px;
  left: 0;
  background: white;
`


@observer
export default class ConfigManager extends Component {
  state = {
    showConfig : false,
  }

  handleSetTempo = (e) => {
    store.setTempo(parseInt(e.target.value))
  }

  handleSetMutationRate = (e) => {
    store.setMutationRate(parseInt(e.target.value))
  }

  handleSetSampleMutationRate = (e) => {
    store.setSampleMutationRate(parseInt(e.target.value))
  }

  handleSetNumChildren = (e) => {
    store.setNumChildren(parseInt(e.target.value))
  }

  handleSetNumSurvivors = (e) => {
    store.setNumSurvivors(parseInt(e.target.value))
  }

  handleSetScoreThreshold = (e) => {
    store.setScoreThreshold(parseInt(e.target.value))
  }

  toggleShowConfig = () => {
    this.setState({ showConfig : !this.state.showConfig})
  }

  render() {
    console.log("SHOW", this.state.showConfig)
    return (
      <StyledConfigManager>
        <button onClick={this.toggleShowConfig}>
          {this.state.showConfig ? "Hide" : "Show"} Config
        </button>
        <ConfigPanel show={this.state.showConfig}>
          <ConfigControl
            name          = "Tempo"
            value         = {store.tempo}
            changeHandler = {this.handleSetTempo}
            min           = {0}
            max           = {200}
          />
          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {store.mutationRate}
            changeHandler = {this.handleSetMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {store.sampleMutationRate}
            changeHandler = {this.handleSetSampleMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Number of Children"
            value         = {store.numChildren}
            changeHandler = {this.handleSetNumChildren}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Number of Survivors"
            value         = {store.numSurvivors}
            changeHandler = {this.handleSetNumSurvivors}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Top Percentile of Survivors"
            value         = {store.scoreThreshold}
            changeHandler = {this.handleSetScoreThreshold}
            min           = {0}
            max           = {100}
          />
        </ConfigPanel>
      </StyledConfigManager>
    )
  }
}
