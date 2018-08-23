import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import Button from "./button"

import store from "../store"
import {
  blue,
  lightBlue,
  panelBackground,
} from "../colors"


const labelWidth = 230
const inputWidth = 60

const Label = styled.div`
  width: ${labelWidth}px;
  display: inline-block;
`

const InputField = styled.input`
  width: ${inputWidth}px;
  font-size: 18px;
  text-align: center;
`


@observer
class ConfigControl extends Component {
  render() {
    const { name, min, max, value, changeHandler } = this.props

    return (
      <div>
        <Label>{name}</Label>
        <InputField
          type     = "number"
          min      = {min}
          max      = {max}
          value    = {value}
          onChange = {changeHandler}
        />
        <input
          type     = "range"
          min      = {min}
          max      = {max}
          value    = {value}
          onChange = {changeHandler}
        />
      </div>
    )
  }
}


const StyledConfigManager = styled.div`
  display: inline-block;
  position: relative;
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
`

const ConfigPanel = styled.div`
  background-color: ${panelBackground};
  border-radius: 3px;
  border: 2px solid ${blue};
  box-shadow: 0px 0px 5px 3px rgba(255, 255, 255, 0.8);
  display: ${props => props.show ? "inlineblock" : "none"};
  font-family: sans-serif;
  font-size: 16px;
  padding: 10px;
  position: absolute;
  top: 52px;
  left: -${labelWidth + inputWidth + 60}px;
  width: ${labelWidth + inputWidth + 160}px;
  z-index: 1;
`


@enhanceWithClickOutside
@observer
class ConfigManager extends Component {
  state = {
    show : false,
  }

  handleSetTempo = (e) => {
    store.setTempo(parseInt(e.target.value))
  }

  handleSetNoteMutationRate = (e) => {
    store.setNoteMutationRate(parseInt(e.target.value))
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

  handleSetFitnessPercentile = (e) => {
    store.setFitnessPercentile(parseInt(e.target.value))
  }

  toggleShow = () => {
    this.setState({ show : !this.state.show})
  }

  handleClickOutside = () => {
    this.setState({ show: false })
  }

  render() {
    return (
      <StyledConfigManager left={this.props.left} right={this.props.right}>
        <Button active={this.state.show} onClick={this.toggleShow}>
          {this.state.show ? "Hide" : ""} Config
        </Button>
        <ConfigPanel show={this.state.show}>
          <ConfigControl
            name          = "Tempo"
            value         = {store.tempo}
            changeHandler = {this.handleSetTempo}
            min           = {40}
            max           = {200}
          />
          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {store.noteMutationRate}
            changeHandler = {this.handleSetNoteMutationRate}
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
            value         = {store.fitnessPercentile}
            changeHandler = {this.handleSetFitnessPercentile}
            min           = {0}
            max           = {100}
          />
        </ConfigPanel>
      </StyledConfigManager>
    )
  }
}


export default ConfigManager
