import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"

import Button from "./button"

import beatTemplates from "../beatTemplates"
import store from "../store"
import {
  blue,
  green,
  itemBgColor,
  lightBlue,
  panelBackground,
} from "../colors"


const StyledNewBeatManager = styled.div`
  display: inline-block;
  position: relative;
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
`

const BeatOptionHeader = styled.div`
  font-weight bold;
  margin: 8px 4px 12px;
`

const NewBeatOption = styled.div`
  background-color: ${green};
  border-radius: 3px;
  border: 1px solid #555;
  display: inline-block;
  margin: 3px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${panelBackground};
  }
`

const NewBeatHeader = styled.div`
  font-size: 32px;
  color: #666;
  font-family: "Hind Madurai";
`

const StyledNewBeatPanel = styled.div`
  background-color: ${panelBackground};
  border-radius: 3px;
  border: 2px solid ${blue};
  box-shadow: 0px 0px 5px 3px rgba(255, 255, 255, 0.8);
  display: inline-block;
  font-family: sans-serif;
  font-size: 16px;
  left: 0px;
  min-height: 200px;
  max-height: 600px;
  padding: 10px;
  position: absolute;
  top: 52px;
  visibility: ${props => props.show ? "visible" : "hidden"};
  width: 400px;
  z-index: 1;
`


@observer
class NewBeatPanel extends Component {
  render() {
    return
  }
}


@enhanceWithClickOutside
@observer
class NewBeatManager extends Component {
  state = {
    show : true,
  }

  toggleShow = () => {
    this.setState({ show: !this.state.show })
  }

  handleClickOutside = () => {
    this.setState({ show: false })
  }

  render() {
    const stepOptions = [ 2, 4, 8, 16, 32 ].map( (stepCount) => {
      return (
        <option
          key   = {stepCount}
          value = {stepCount}
        >{stepCount}</option>
      )
    })

    let copyOptions = store.allGenerations.map( (generation) => {
      const generationOptions = generation.map( (beat) => {
        return <NewBeatOption>{beat.key}</NewBeatOption>
      })

      return <div>{generationOptions}</div>
    })

    const presetOptions = beatTemplates.map( (beat) => {
      return <NewBeatOption>{beat.name}</NewBeatOption>
    })

    return (
      <StyledNewBeatManager left={this.props.left} right={this.props.right}>
        <Button
          active  = {this.state.show}
          onClick = {this.toggleShow}
        >
          + Beat
        </Button>

        <StyledNewBeatPanel show={this.state.show}>
          <div>
            <div>
              <NewBeatHeader>
                Add new beat from
              </NewBeatHeader>

              <NewBeatOption>Empty Beat</NewBeatOption>
              with
              <select
                ref={(c) => { this.stepsSelect = c }}
                defaultValue={16}
                style={{
                  fontSize: 20,
                  color: "white",
                }}
              >
                {stepOptions}
              </select>
              steps

              <BeatOptionHeader>Presets</BeatOptionHeader>
              {presetOptions}

              <BeatOptionHeader>From Family Tree</BeatOptionHeader>
              {copyOptions}
            </div>
          </div>
        </StyledNewBeatPanel>
      </StyledNewBeatManager>
    )
  }
}


export default NewBeatManager
