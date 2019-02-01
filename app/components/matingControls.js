import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import Button from "./button"
import ConfigControl from "./configControl"
import controlStore from "../stores/controlStore"
import store from "../stores/store"
import { colors } from "../colors"
import {
 MdSettings
} from "react-icons/md"

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
  background-color: ${colors.gray.light};
  border-radius: 3px;
  border: 2px solid ${colors.blue.base};
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
        <MdSettings
            style   = {{'marginLeft': '15px', 'verticalAlign' : 'middle'}}
            active  = {this.state.show.toString()}
            onClick = {this.toggleShow}
          >
          Mating Controls
        </MdSettings>

        <StyledMatingControlPanel show={this.state.show}>
          <ControlsHeader topMargin={false}>
            Mutation
          </ControlsHeader>

          <ConfigControl
            name          = "Note Mutation Rate"
            value         = {controlStore.noteMutationRate}
            changeHandler = {controlStore.setNoteMutationRate}
            min           = {0}
            max           = {100}
            title         = "The likelihood that a note changes during mutation or mating"
          />
          <ConfigControl
            name          = "Sample Mutation Rate"
            value         = {controlStore.sampleMutationRate}
            changeHandler = {controlStore.setSampleMutationRate}
            min           = {0}
            max           = {100}
            title         = "The likelihood that a sample is added or removed during mutation or mating"
          />
          <div hidden={this.props.view != "familyTree"}>

            <ControlsHeader>
              New Generation
            </ControlsHeader>
              <ConfigControl
                name          = "Number of Children"
                value         = {controlStore.numChildren}
                changeHandler = {controlStore.setNumChildren}
                min           = {1}
                max           = {20}
                title         = "The number of children produced by set of parents during mating"
              />
              <ConfigControl
                name          = "Number of Survivors"
                value         = {controlStore.numSurvivors}
                changeHandler = {controlStore.setNumSurvivors}
                min           = {1}
                max           = {20}
                title         = "The maximum number of children in a new generation"
              />
              <ConfigControl
                name          = "Fitness Threshold"
                value         = {controlStore.fitnessPercentile}
                changeHandler = {controlStore.setFitnessPercentile}
                min           = {0}
                max           = {100}
                title         = "The minimum level of fitness a parent must have to mate"
              />
          </div>
        </StyledMatingControlPanel>
      </StyledMatingControls>
    )
  }
}


export default MatingControl
