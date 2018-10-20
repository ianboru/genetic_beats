import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import Button from "./button"
import ConfigControl from "./configControl"

import store from "../store"
import {
  blue,
  lightBlue,
  panelBackground,
} from "../colors"


const StyledMatingControls = styled.div`
  display: inline-block;
  position: relative;
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
`

const ControlsHeader = styled.div`
  display: inline-block;
  font-size: 18px;
  font-family: "Hind Madurai";
  margin: 6px;
  margin-top: ${props => (props.topMargin == null || props.topMargin) ? "18px" : 0 };
`


const StyledMatingControlPanel = styled.div`
  background-color: ${panelBackground};
  border-radius: 3px;
  border: 2px solid ${blue};
  box-shadow: 0px 0px 5px 3px rgba(255, 255, 255, 0.8);
  display: inline-block;
  font-family: sans-serif;
  font-size: 16px;
  right: 10px;
  min-height: 200px;
  padding: 15px;
  position: absolute;
  top: 52px;
  visibility: ${props => props.show ? "visible" : "hidden"};
  z-index: 1;
`


@enhanceWithClickOutside
@observer
class MatingControl extends Component {
  state = {
    show : false,
  }

  toggleShow = () => {
    this.setState({ show: !this.state.show })
  }

  handleClickOutside = () => {
    this.setState({ show: false })
  }

  render() {
    return (
      <StyledMatingControls left={this.props.left} right={this.props.right}>
        <Button
            active  = {this.state.show}
            onClick = {this.toggleShow}
          >
          Mating Controls
        </Button>

        <StyledMatingControlPanel show={this.state.show}>
          <ControlsHeader topMargin={false}>
            Mutation
          </ControlsHeader>

          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {store.noteMutationRate}
            changeHandler = {store.setNoteMutationRate}
            min           = {0}
            max           = {100}
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {store.sampleMutationRate}
            changeHandler = {store.setSampleMutationRate}
            min           = {0}
            max           = {100}
          />

          <ControlsHeader>
            New Generation
          </ControlsHeader>

          <ConfigControl
            name          = "Number of Children"
            value         = {store.numChildren}
            changeHandler = {store.setNumChildren}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Number of Survivors"
            value         = {store.numSurvivors}
            changeHandler = {store.setNumSurvivors}
            min           = {1}
            max           = {20}
          />
          <ConfigControl
            name          = "Fitness Threshold"
            value         = {store.fitnessPercentile}
            changeHandler = {store.setFitnessPercentile}
            min           = {0}
            max           = {100}
          />
        </StyledMatingControlPanel>
      </StyledMatingControls>
    )
  }
}


export default MatingControl
