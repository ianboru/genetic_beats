import React, { Component } from "react"
import styled from "styled-components"

import { observer } from "mobx-react"

import Button from "./button"
import CreateBeat from "./createBeat"
import Player from "./player"

import store from "../store"


const StyledNewBeatManager = styled.div`
  display: inline-block;
  position: relative;
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
`

const NewBeatPanel = styled.div`
  display: inline-block;
  visibility: ${props => props.show ? "visible" : "hidden"};
  border: 2px solid #403F3F;
  border-radius: 3px;
  box-shadow: 2px 2px 3px #888;
  font-family: sans-serif;
  font-size: 16px;
  padding: 10px;
  position: absolute;
  top: 52px;
  left: -200px;
  background: white;
  width: 800px;
  z-index: 1;
`


@observer
export default class NewBeatManager extends Component {
  state = {
    play : false,
    show : false,
  }

  toggleShow = () => {
    this.setState({ show: !this.state.show })
  }

  togglePlay = () => {
    this.setState({ play: !this.state.play })
  }

  render() {
    let newBeatResolution

    if (store.newBeat.tracks.length > 0) {
       newBeatResolution = store.newBeat.tracks[0].sequence.length
    }

    return (
      <StyledNewBeatManager left={this.props.left} right={this.props.right}>
        <Player
          beat       = {store.newBeat}
          playing    = {this.state.play}
          resolution = {newBeatResolution}
        />

        <Button active={this.state.show} onClick={this.toggleShow}>
          {this.state.show ? "Hide" : ""} Create New Beat
        </Button>
        <NewBeatPanel show={this.state.show}>
          <CreateBeat playing={this.state.play} togglePlayBeat={this.togglePlay} />
        </NewBeatPanel>
      </StyledNewBeatManager>
    )
  }
}
